// Change le statut de la tâche
const modifierTache = (e) => {
    // Récupère les éléments
    const id = e.dataset.taskid;
    const done = e.checked;
    console.log(id, done);

    // Envoi la requête
    fetch(`/todos/patch/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: done }),
    })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
};

// Supprime la tâche et rafraichit la page
const supprimerTache = (e) => {
    const id = e.dataset.taskid;
    console.log(id);
    fetch(`/todos/delete/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);

            // Supprime l'élément de la tâche du DOM sans recharger la page
            const card = e.closest(".card");
            if (card) card.remove();
        })
        .catch((err) => console.error(err));
};
