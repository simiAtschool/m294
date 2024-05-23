function init() {
    getMedien();
}

function getMedien() {
    fetch("http://192.168.1.190:8080/bibliothek/kunde/nachname/")
        .then(response => response.json().then(data => fillTable(data)));
}

function fillTable(data) {
    const tableBody = document.getElementById("mediumTabelleBody");

    if (!(data instanceof Array)) {
        return;
    }

    tableBody.replaceChildren();

    // creating all cells
    for (let obj of data) {

        // creates a table row
        const row = document.createElement("tr");

        for (let index = 1; index <= 5; index++) {
            const cell1 = document.createElement("td");
            cell1.appendChild(getText(obj, index));
            cell1.setAttribute("scope", "row");
            row.appendChild(cell1);
        }

        // add the row to the end of the table body
        tableBody.appendChild(row);
    }

}

function getText(obj, cellNum) {
    switch (cellNum) {
        case 1:
            return document.createTextNode(obj.id ? obj.id : "");
        case 2:
            return document.createTextNode(obj.titel ? obj.titel : "");
        case 3:
            return document.createTextNode(obj.autor ? obj.autor : "");
        case 4:
            const editBtn = document.createElement("button");
            editBtn.textContent = "edit";
            editBtn.classList.add("btn", "material-symbols-outlined");
            editBtn.addEventListener("click", () => window.location.assign(`../erstellen/?${obj.id}`));
            return editBtn;
        case 5:
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "delete";
            deleteBtn.classList.add("btn", "material-symbols-outlined");
            deleteBtn.addEventListener("click", () => window.location.assign(`../erstellen/?${obj.id}`));
            return deleteBtn;
        default:
            return document.createTextNode("");
    }
}

init();