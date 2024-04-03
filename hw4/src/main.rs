#[macro_use]
extern crate rocket;
use rocket::form::{Context, Contextual, Form};
use rocket::fs::{relative, FileServer, TempFile};
use rocket::http::Status;
use rocket::time::Date;
use rocket_dyn_templates::{context, Template};

#[derive(Debug, FromForm)]
struct Password<'v> {
    // #[field(validate = len(8..))]
    // #[field(validate = eq(self.second))]
    #[allow(unused)]
    first: &'v str,
    #[allow(unused)]
    // #[field(validate = eq(self.first))]
    second: &'v str,
}

#[derive(Debug, FromFormField)]
enum Rights {
    Public,
    Reserved,
    Exclusive,
}

#[derive(Debug, FromFormField)]
enum Category {
    Biology,
    Chemistry,
    Physics,
    #[field(value = "CS")]
    ComputerScience,
}

#[derive(Debug, FromFormField)]
enum City {
    Msc,
    Spb,
    NN,
}

#[derive(Debug, FromForm)]
#[allow(dead_code)]
struct Article<'v> {
    #[field(validate = len(1..))]
    title: &'v str,
    date: Date,
    #[field(validate = len(1..=250))]
    r#content: &'v str,
    // #[field(validate = ext(ContentType::PDF))]
    file: TempFile<'v>,
    #[field(validate = len(1..))]
    category: Vec<Category>,
    rights: Rights,
}

#[derive(Debug, FromForm)]
#[allow(dead_code)]
struct Account<'v> {
    #[field(validate = len(1..))]
    name: &'v str,
    password: Password<'v>,
    #[field(validate = contains('@').or_else(msg!("invalid email address")))]
    email: &'v str,
}

#[derive(Debug, FromForm)]
#[allow(dead_code)]
struct Company<'v> {
    city: Vec<City>,
    range: &'v str,
    color: &'v str,
}

#[derive(Debug, FromForm)]
#[allow(dead_code)]
struct Submit<'v> {
    account: Account<'v>,
    article: Article<'v>,
    company: Company<'v>,
    #[allow(unused)]
    post_id: &'v str,
}

#[get("/")]
fn index() -> Template {
    Template::render("index", &Context::default())
}

#[post("/", data = "<form>")]
fn submit<'r>(form: Form<Contextual<'r, Submit<'r>>>) -> (Status, Template) {
    let template = match form.value {
        Some(ref submission) => {
            println!("submission: {:#?}", submission);
            let file_size = submission.article.file.len();

            Template::render(
                "success",
                context! {
                    values: [
                        ("Name", submission.account.name),
                        ("Email address", submission.account.email),
                        ("Article title", submission.article.title),
                        ("Article file size(bytes)", &file_size.to_string()),
                    ]
                },
            )
        }
        None => {
            eprintln!("{:?}", form);
            Template::render("index", &Context::default())
        }
    };

    (form.context.status(), template)
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        .mount("/", routes![submit])
        .attach(Template::fairing())
        .mount("/", FileServer::from(relative!("/static")))
}
