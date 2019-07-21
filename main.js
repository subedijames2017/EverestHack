const express = require("express");
const app = express();
const path = require("path");
const knex = require("./db/knex");
const bodyParser = require("body-parser");

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Middleware for static folder
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/hospitals", (req, res) => {
  let district = req.query.district;
  console.log("TCL: req.query", req.query);
  knex
    .from("places")
    .select("hospital")
    .where("district", district)
    .then(result => {
      console.log("TCL: result", result);
      res.render("hospitals-list", { hospitals: result }, (ErrHtml, output) => {
        res.send({ html: output, status: true });
      });
    });
});
app.get("/hospitals/chart", (req, res) => {
  let hospital = req.query.hospital;
  console.log("TCL: req.query", req.query);
  knex
    .from("places")
    .join("helth_data", "places.id", "helth_data.place_id")
    .select("*")
    .where("places.hospital", hospital)
    .then(result => {
      res.render("charts", { chartDatas: result });
    });
});
app.use("*", (req, res) => {
  res.send("404 not found");
});
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server is created...");
});
