use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use serde::{Deserialize, Serialize};
use serde_json::Value;
use socketioxide::{
    extract::{Bin, Data, SocketRef, State},
    SocketIo,
};

use tower::ServiceBuilder;
use tower_http::{cors::CorsLayer, services::ServeDir};
use tracing::info;
use tracing_subscriber::FmtSubscriber;

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(transparent)]
struct Username(String);

#[derive(Deserialize, Serialize, Debug, Clone)]
struct User {
    name: Username,
    room: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase", untagged)]
enum Res {
    UserEvent {
        #[serde(rename = "numUsers")]
        num_users: usize,
        username: Username,
    },
    Message {
        username: Username,
        text: String,
    },
    Username {
        username: Username,
    },
}

struct RoomUserCount {
    user_count: HashMap<String, usize>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let subscriber = FmtSubscriber::new();

    tracing::subscriber::set_global_default(subscriber)?;

    info!("Starting server");
    let shared_state = Arc::new(Mutex::new(RoomUserCount {
        user_count: HashMap::new(),
    }));

    let (layer, io) = SocketIo::builder().with_state(shared_state).build_layer();

    io.ns("/", |s: SocketRef| {
        s.on("message", |s: SocketRef, Data::<String>(text)| {
            info!("Get message: {}", text);

            let user = s.extensions.get::<User>().unwrap().clone();
            let msg = Res::Message {
                username: user.name,
                text,
            };
            s.to(user.room).emit("new message", msg).ok();
        });

        s.on(
            "image",
            |socket: SocketRef, Data::<Value>(data), Bin(bin)| {
                info!("Get binary for: {}, {:?}", data, bin);
                if let Some(user) = socket.extensions.get::<User>() {
                    // This will send the binary payload received to all clients in this namespace with the test message
                    socket
                        .within(user.room.clone())
                        .bin(bin)
                        .emit("new image", data)
                        .unwrap();
                    info!("Send binary");
                }
            },
        );

        s.on(
            "connection",
            |s: SocketRef, Data::<User>(user), app_state: State<Arc<Mutex<RoomUserCount>>>| {
                if s.extensions.get::<User>().is_some() {
                    return;
                }
                info!("Client {:?} connected", user);
                s.join(user.room.clone()).unwrap();
                s.extensions.insert(user.clone());

                let mut state = app_state.lock().unwrap();
                let num_users = state.user_count.get(&user.room).unwrap_or(&0usize) + 1;
                state.user_count.insert(user.room.clone(), num_users);

                let res = Res::UserEvent {
                    num_users,
                    username: user.name,
                };
                s.within(user.room).emit("user joined", res).ok();
            },
        );

        s.on(
            "change room",
            |s: SocketRef, app_state: State<Arc<Mutex<RoomUserCount>>>| {
                if let Some(user) = s.extensions.get::<User>() {
                    info!("Client {:?} changed room", user);
                    let res = {
                        let mut state = app_state.lock().unwrap();
                        *state.user_count.get_mut(&user.room.clone()).unwrap() -= 1;
                        Res::UserEvent {
                            num_users: state.user_count[&user.room],
                            username: user.name.clone(),
                        }
                    };
                    s.to(user.room.clone()).emit("user left", res).ok();
                }
                s.extensions.remove::<User>();
            },
        );

        // s.on("typing", |s: SocketRef| {
        //     let username = s.extensions.get::<Username>().unwrap().clone();
        //     s.broadcast()
        //         .emit("typing", Res::Username { username })
        //         .ok();
        // });

        // s.on("stop typing", |s: SocketRef| {
        //     let username = s.extensions.get::<Username>().unwrap().clone();
        //     s.broadcast()
        //         .emit("stop typing", Res::Username { username })
        //         .ok();
        // });

        s.on_disconnect(
            |s: SocketRef, app_state: State<Arc<Mutex<RoomUserCount>>>| {
                if let Some(user) = s.extensions.get::<User>() {
                    info!("Client {:?} disconnected", user);
                    let mut state = app_state.lock().unwrap();
                    *state.user_count.get_mut(&user.room).unwrap() -= 1;
                    let res = Res::UserEvent {
                        num_users: state.user_count[&user.room],
                        username: user.name.clone(),
                    };
                    s.to(user.room.clone()).emit("user left", res).ok();
                }
            },
        );
    });

    let app = axum::Router::new()
        .nest_service("/", ServeDir::new("dist"))
        .layer(
            ServiceBuilder::new()
                .layer(CorsLayer::permissive()) // Enable CORS policy
                .layer(layer),
        );

    let listener = tokio::net::TcpListener::bind("127.0.0.1:1234")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
