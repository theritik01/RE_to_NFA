const express = require("express");

const app = express();
//Serving the static files present in "soc" folder
app.use(express.static("soc"));

//Redirecting the default GET api to landing html file
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

//Redirecting the default GET api to landing html file
app.get("/module1", (req, res) => {
  res.redirect("/module1.html");
});

//Redirecting the default GET api to landing html file
app.get("/module2", (req, res) => {
  res.redirect("/module2.html");
});

const port = process.env.PORT || 5050;

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
