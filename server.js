var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;
var hbs = require('express-handlebars');
var path = require("path");
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'index.hbs' }));
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var login = false
var users = [
    { id: 1, login: "AAA", password: "PASS1", age: '10', student: "checked", plec: "M" },
    { id: 2, login: "BBB", password: "PASS2", age: '9', student: "checked", plec: "K" },
    { id: 3, login: 'admin', password: 'admin', age: '99', student: 'checked', plec: 'M' }
]
var id = 2;

app.get("/", function (req, res) {
    context = {};
    if (login == true) {
        context.logout = "logout";
    }
    res.render('main.hbs', context);
})
app.get("/register", function (req, res) {
    context = {};
    if (login == true) {
        context.logout = "logout";
    }
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
        id++;
        req.body.id = id;
        if (req.body.plec == undefined) req.body.plec = "undefined";
        users.push(req.body);
        res.redirect('/login');
    }
    else {
        res.redirect('/register');
    }
})

app.get("/login", function (req, res) {
    context = {};
    if (login == true) {
        context.logout = "logout";
    }
    res.render('login.hbs', context);
})

app.post("/handlePostL", function (req, res) {
    var temp = -1;
    for (let i = 0; i < users.length; i++) {
        if (req.body.login == users[i].login) {
            temp = i;
            if (req.body.password == users[temp].password) {
                res.redirect('/');
                login = true;
            }
        }
    }
    if (login == false) {
        res.redirect('/login');
    }
})

app.get("/admin", function (req, res) {
    context = {};
    if (login == true) {
        context.logout = "logout";
        res.render('adminL.hbs', context);
    }
    else {
        context = {};
        res.render('admin.hbs', context);
    }
})

app.get("/logout", function (req, res) {
    login = false;
    res.redirect("/");
})

app.get("/sort", function (req, res) {
    context = {};
    if (login == true) {
        context.logout = "logout";
    }


    if (req.query.sort == "up") {
        users.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        });
    }
    else {
        users.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        }).reverse();
    }
    context.data = users;

    res.render('sort.hbs', context);
})

app.get("/gender", function (req, res) {
    context = {};
    if (login == true) context.logout = "logout";
    k = [];
    o = [];

    for (let i = 0; i < users.length; i++) {
        if (users[i].plec == "K") k.push(users[i]);
        else o.push(users[i]);
    }
    context.k = k;
    context.i = o;
    res.render('gender.hbs', context);
})

app.get("/show", function (req, res) {
    context = {};
    if (login == true) context.logout = "logout";

    users.sort(function (a, b) {
        return parseFloat(a.wiek) - parseFloat(b.wiek);
    }).reverse();
    context.data = users;

    res.render('show.hbs', context);
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})