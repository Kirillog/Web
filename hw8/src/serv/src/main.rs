use std::sync::Mutex;

use lazy_static::lazy_static;
use rocket::figment::value::Map;
use rocket::response::{self, content, Responder};
use rocket::serde::json::{to_string, Json};
use rocket::serde::{Deserialize, Serialize};
use rocket::time::Date;
use rocket::FromFormField;
use rocket::{form::FromForm, get, launch, post, routes};
lazy_static! {
    static ref TODO_LIST: Mutex<Map<usize, TodoItem>> = Mutex::new(Map::new());
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[derive(FromForm)]
struct Status<'v> {
    status: &'v str,
}

#[derive(Responder)]
#[response(status = 200, content_type = "json")]
struct OkJson(String);

#[get("/?all&<status>")]
fn get_all<'v>(status: Status<'v>) -> OkJson {
    let guard = TODO_LIST.lock().unwrap();
    let typ = TodoType::from_str(status.status);
    let value: Vec<IdTodoItem> = guard
        .iter()
        .filter(|(_, v)| typ == TodoType::ALL || v.status == typ)
        .map(|(&k, v)| IdTodoItem {
            id: k,
            title: v.title.clone(),
            description: v.description.clone(),
            status: v.status.clone(),
            date: v.date.clone(),
        })
        .collect();
    OkJson(to_string(&value).unwrap())
}
#[derive(Serialize, Deserialize, Clone, PartialEq, FromFormField)]
#[serde(crate = "rocket::serde")]
enum TodoType {
    OPEN,
    PROGRESS,
    DONE,
    ALL,
}

#[derive(Serialize, Deserialize, Clone, FromForm)]
#[serde(crate = "rocket::serde")]
struct TodoItem {
    #[field(validate = len(1..))]
    title: String,
    #[field(validate = len(1..))]
    description: String,
    status: TodoType,
    date: String,
}

impl TodoType {
    fn from_str(s: &str) -> Self {
        match s {
            "OPEN" => TodoType::OPEN,
            "PROGRESS" => TodoType::PROGRESS,
            "DONE" => TodoType::DONE,
            "" => TodoType::ALL,
            _ => panic!("{} get, status expected", s),
        }
    }
}

#[derive(Deserialize, Serialize, Clone, FromForm)]
#[serde(crate = "rocket::serde")]
struct IdTodoItem {
    id: usize,
    title: String,
    description: String,
    status: TodoType,
    date: String,
}

fn validate_date(date: &str) -> bool {
    return true;
}

#[post("/add", data = "<item>")]
fn add_item(item: Json<TodoItem>) -> OkJson {
    let item_copy = item.clone().0;
    let mut guard = TODO_LIST.lock().unwrap();
    let size = guard.len();
    guard.insert(size, item.0);
    let item = IdTodoItem {
        id: size,
        title: item_copy.title,
        description: item_copy.description,
        status: item_copy.status,
        date: item_copy.date,
    };
    OkJson(to_string(&item).unwrap())
}

#[post("/<id>", data = "<item>")]
fn update_item<'a>(id: usize, item: Json<IdTodoItem>) -> OkJson {
    let item_copy = item.clone().0;
    let mut guard = TODO_LIST.lock().unwrap();
    guard.insert(
        id,
        TodoItem {
            title: item.0.title,
            description: item.0.description,
            status: item.0.status,
            date: item.0.date,
        },
    );
    OkJson(to_string(&item_copy).unwrap())
}

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Request, Response};

pub struct Cors;

#[rocket::async_trait]
impl Fairing for Cors {
    fn info(&self) -> Info {
        Info {
            name: "Cross-Origin-Resource-Sharing Fairing",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, PATCH, PUT, DELETE, HEAD, OPTIONS, GET",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Cors)
        .mount("/", routes![index, get_all, update_item, add_item])
}
