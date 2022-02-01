var express = require("express")
var app = express()
const PORT = 3000;
var hbs = require('express-handlebars');
var path = require("path")

var login = false
var users = [
    { login: 'admin', password: 'admin', age: '99', student: 'on', plec: 'M' }
]
var context = {
    create: "użytkownik stworzony",
    login: "zalogowany",
    users: users
}

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'index.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');

app.get("/", function (req, res) {
    res.render('main.hbs');
})
app.get("/register", function (req, res) {
    res.render('register.hbs');
})
app.post("/handlePost", function (req, res) {
    var temp = 0;
    for (let i = 0; i < users.length; i++) {
        if (req.body.login == users[i].login) {
            temp++;
        }

    }
    if (temp == 0) {
        users.push(req.body)
        context.create = "użytkownik stworzony"
        res.render('register.hbs', context);
    }
    else {
        context.create = "użytkownik już istnieje"
        res.render('register.hbs', context)
    }
})

app.get("/login", function (req, res) {
    res.render('login.hbs');
})

app.post("/handlePostL", function (req, res) {
    var temp = -1;
    var status = false
    for (let i = 0; i < users.length; i++) {
        if (req.body.login == users[i].login) {
            temp = i;
            if (req.body.password == users[temp].password) {
                context.login = "zalogowano"
                res.render('login.hbs', context);
                status = true;
                login = true;
            }
        }
    }
    if (status == false) {
        context.login = "złe dane"
        res.render('login.hbs', context);
    }
    console.log(users);

})

app.get("/admin", function (req, res) {
    if (login == true) res.render('adminL.hbs')
    else res.render('admin.hbs');
})

app.get("/sort", function (req, res) {
    var sorted = `<table>`
    for (let i = 0; i < users.length; i++) {
        sorted += `<tr>
        <td>`+ users[i].login + `</td>
        <td>`+ users[i].password + `</td>
        <td>`+ users[i].age + `</td>
        <td>`+ users[i].student + `</td>
        <td>`+ users[i].plec + `</td>
        </tr>`
    }
    sorted += `</table>`
    context.users = sorted;
    console.log(sorted)
    res.setHeader("content-type", "application/json")
    res.render('sort.hbs', context);
})


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})