import express from "express";
import "dotenv/config";
import sqlite3 from "sqlite3";
// import twig from "twig";

// Créer le serveur et récupérer le port dans le .env
const app = express();
const PORT = process.env.PORT || 3009;

// Charge le module twig pour les rendus
app.set("view engine", "twig");
app.set("views", "./views");

// Créer la base de donnée
const db = new sqlite3.Database("./todos.db");

// Création de la table si elle n'existe pas déjà
db.run(`CREATE TABLE IF NOT EXISTS todos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    firstName TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

// Middlewares
app.use(express.static("public")); //pour définir /public comme dossier statique
app.use(express.json()); // pour parser le corps des requêtes JSON
app.use(express.urlencoded({ extended: true })); // pour parser les formulaires HTML

// Afficher toutes les tâches
app.get("/", (req, res) =>
    db.all(`SELECT * FROM todos ORDER BY created_at DESC`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.render("todos.twig", { rows }); // on rend le résultat dans twig
    })
);

// Création d'une tâche
app.post("/todos/create", (req, res) => {
    const { title, firstName } = req.body;
    console.log(req.url, req.body);

    db.run(
        `INSERT INTO todos (title, firstName) VALUES (?, ?)`,
        [title, firstName],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201)
                // .json({
                //     id: this.lastID, // dernier ID créé
                //     title: title,
                //     firstName: firstName,
                // })
                .redirect("/");
        }
    );
});

// Modifier le status d'une tâche
app.patch("/todos/patch/:id", (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    console.log(req.url, req.params, req.body);

    db.run(
        `UPDATE todos SET done = ? WHERE id = ?`,
        [done ? 1 : 0, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ update: this.changes });
            // .redirect("/");
        }
    );
});

// Supprimer une tâche
app.delete("/todos/delete/:id", (req, res) => {
    const { id } = req.params;
    console.log(req.url, req.params);

    db.run(`DELETE FROM todos WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ delete: this.changes }); // on retourne dans un json le nombre d'éléments supprimés
    });
});

// On lance le serveur
app.listen(PORT, () => {
    console.log(`Le serveur tourne à l'adresse http://localhost:${PORT}`);
});
