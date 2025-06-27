console.log("app.js fonctionne !");

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3010;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "twig");
app.set("views", "./views");

//Création de la base de données

const db = new sqlite3.Database("./todo.db");

//Création de la table

db.run(`
    CREATE TABLE IF NOT EXISTS todos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    firstname TEXT NOT NULL, 
    done INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP)
    `);

//CREATE (tâche)
app.post("/todo/create", (req, res) => {
  const { title, firstname } = req.body;
  db.run(
    "INSERT INTO todos (title, firstname) VALUES (?, ?)",
    [title, firstname],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.redirect("/");
    }
  );
});

//READ (afficher les tâches)
app.get("/", (req, res) => {
  console.log("Route / appelée !");
  db.all("SELECT * FROM todos ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.render("index", { rows }); // une liste de tâches envoyée depuis Express
  });
});

//DELETE (supprimer une tâche)
app.post("/todo/:id/delete", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM todos WHERE id = ?`, id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.redirect("/");
  });
});

//UPDATE (mise à jour du du status d'une tâche)
app.put("/todo/:id", (req, res) => {
  const { done } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE todos SET done = ? WHERE id =?",
    [done ? 1 : 0, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ update: this.changes });
    }
  );
});

//Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur tourne sur http://localhost:${PORT}`);
});
