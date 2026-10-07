import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("auth");
});

app.get("/login", (req, res) => res.redirect("/"));
app.get("/register", (req, res) => res.redirect("/"));

app.get("/posts", (req, res) => {
  res.render("posts");
});

app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});
