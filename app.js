import express from "express";
import dotenv from "dotenv";
dotenv.config();
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import twig from "twig";

const PORT = process.env.PORT || 3010;
const app = express();

app.set("view engine", "twig");
app.set("views", "./views");

app.use(bodyParser.json());

//Création de la base de données

const db = new sqlite3.Database("./todo.db");

db.run(`
    CREATE TABLE IF NOT EXISTS todos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    firstname TEXT NOT NULL, 
    done INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP)
    `);

//CREATE
app.post("/todo/create", (req, res) => {
  const { title, firstname } = req.body;
  db.run(
    "INSERT INTO todos (title, firstname) VALUES (?, ?)",
    [title, firstname],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: `la tache ${title} a été attribué à ${firstname}`,
        id: this.lastID,
        title,
      });
    }
  );
});

//READ
app.get("/", (req, res) => {
  db.all("SELECT * FROM todos ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.render("index", { todos: rows });
  });
});

//DELETE
app.delete("/todo/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM todos WHERE id = ?`, id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ delete: this.changes });
  });
});

//UPDATE
app.put("/todo/:id", (req, res) => {
  const { title, firstname, done } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE todos SET title = ?, firstname = ?, done = ? WHERE id =?",
    [title, firstname, done ? 1 : 0, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ update: this.changes });
    }
  );
});

//Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur tourne sur http://localhost:${PORT}`);
});
