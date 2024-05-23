function init() {
    getAusleihen();
}

function getAusleihen() {
    fetch("http://192.168.1.190:8080/bibliothek/ausleihe")
        .then(response => response.json().then(data => fillTable(data)));
}

function addDays(date, days) {
    let result = structuredClone(date);
    result.setDate(result.getDate() + days);
    return result;
}

function fillTable(data) {
    const tableBody = document.getElementById("ausleiheTabelleBody");

    if (!(data instanceof Array)) {
        return;
    }

    tableBody.replaceChildren();

    // creating all cells
    for (let obj of data) {

        // creates a table row
        const row = document.createElement("tr");

        for (let index = 1; index <= 6; index++) {
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
    const date = new Date(obj.ausleihedatum ? obj.ausleihedatum : "");
    switch (cellNum) {
        case 1:
            return document.createTextNode(obj.medium?.id ? obj.medium.id : "");
        case 2:
            return document.createTextNode(obj.kunde?.id ? obj.kunde.id : "");
        case 3:
            return document.createTextNode(date.toLocaleDateString());
        case 4:
            return document.createTextNode(addDays(date, obj.ausleihedauer ? obj.ausleihedauer : 14).toLocaleDateString())
        case 5:
            const editBtn = document.createElement("button");
            editBtn.textContent = "edit";
            editBtn.classList.add("btn", "material-symbols-outlined");
            editBtn.addEventListener("click", () => window.location.assign(`../erstellen/?${obj.medium.id}`));
            return editBtn;
        case 6:
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "delete";
            deleteBtn.classList.add("btn", "material-symbols-outlined");
            deleteBtn.addEventListener("click", () => window.location.assign(`../erstellen/?${obj.medium.id}`));
            return deleteBtn;
        default:
            return document.createTextNode("");
    }
}

init();