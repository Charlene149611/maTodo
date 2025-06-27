// Change le statut de la tâche
const modifierTache = (e) => {
    const id = e.dataset.taskid;
    const done = e.checked;
    console.log(id, done);
    fetch(`/todos/put/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: done }),
    })
        .then(() => console.log('ok'))  // Inutile de recharger la page
        .catch((err) => console.error(err));
};

// Supprime la tâche et rafraichit la page
const supprimerTache = (e) => {
    const id = e.dataset.taskid;
    console.log(id);
    fetch(`/todos/delete/${id}`, { method: "DELETE" })
        .then(() => location.reload())
        .catch((err) => console.error(err));
};
