var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xK" : "http://www.google.com",
  "2kjg7L" : "http://www.tsn.ca"
};

// ------------------------------- Generate Random String
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
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

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// -------------------------------- Delete url from databse
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});