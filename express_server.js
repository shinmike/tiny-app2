var express = require("express");
var cookieParser = require('cookie-parser');

var app = express();
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

var urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xK" : "http://www.google.com",
  "2kjg7L" : "http://www.tsn.ca"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// ------------------------------- Function - Generate random string
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// -------------------------------- See url databse
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  res.render("urls_index", templateVars);
});

// -------------------------------- Add new url to database
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

// -------------------------------- Create new url
app.get("/urls/new", (req, res) => {
  res.render("urls_new", {username: req.cookies.username});
});

// -------------------------------- See specific id
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies.username
  };
  res.render("urls_show", templateVars);
});

// -------------------------------- Register
app.get("/register", (req, res) => {
  res.render("register");
});


// -------------------------------- Function - Validate email and password
function validateEmailAndPassword(email, password) {
  return (password.length > 0 && email.includes('@'));
}

// -------------------------------- Function - Validate unique email
function validateUniqueEmail(email){
  for (var prop in users){
    var user = users[prop];
    if (user && user.email === email){
      return false;
    }
  }
  return true;
}

app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let userId = generateRandomString();

  console.log("users before validation: ", users);

  if (!validateEmailAndPassword(email, password)){
    res.status(400).send("Invalid email and/or password");
    return;
  }

  if (!validateUniqueEmail(email)){
    res.status(400).send("This email has already been registered");
    return;
  }

  let userTemplate = {
    id: userId,
    email: email,
    password: password
  };
  users[userId] = userTemplate;

  console.log("users after validation: ", users);

  res.cookie("user_id", userId);
  res.redirect("/urls");
});

// -------------------------------- Edit url for speific id
app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL;
  urlDatabase[req.params.id] = longURL;
  res.redirect("/urls");
});

// -------------------------------- Go to specified shortURL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// -------------------------------- Delete url from databse
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// -------------------------------- Login
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// -------------------------------- Logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

app.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});
