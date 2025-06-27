// Change le statut de la tâche
const modifierTache = (e) => {
    const id = e.value;
    console.log(id);
};

// Supprime la tâche et rafraichit la page
const supprimerTache = (e) => {
    const id = e.value;
    console.log(id);
    fetch(`/todos/delete/${id}`, { method: "DELETE" })
        .then(() => location.reload())
        .catch((err) => console.error(err));
};
