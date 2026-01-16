import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();

app.use(express.json()); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Bootcamp_AngelaWU",
  password: "Luis2010#4571",
  port: 5432,
});

const port = 3000;

db.connect();


app.get("/", (req, res) => {
    res.render('index.ejs')
});

app.listen(port, () => {
    console.log('Server running on port ', port)
});