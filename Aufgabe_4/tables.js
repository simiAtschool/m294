function createHeaderCell(text) {
    const cell = document.createElement("th");
    cell.appendChild(document.createTextNode(text ? text : ""));
    return cell;
}

function constructAusleiheTable(data) {

    if (!(data instanceof Array)) {
        return;
    }
    softReset();

    const row = document.createElement("tr");
    row.appendChild(createHeaderCell("Medium-ID"));
    row.appendChild(createHeaderCell("Ausleihe-ID"));
    row.appendChild(createHeaderCell("Ausleihedatum"));
    row.appendChild(createHeaderCell("Rückgabedatum"));
    row.appendChild(createHeaderCell());
    row.appendChild(createHeaderCell());
    tableHead.appendChild(row);

    // creating all cells
    for (let obj of data) {

        // creates a table row
        const row = document.createElement("tr");

        for (let index = 1; index <= 6; index++) {
            const cell = document.createElement("td");
            cell.appendChild(getAusleiheText(obj, index));
            row.appendChild(cell);
        }

        // add the row to the end of the table body
        tableBody.appendChild(row);
    }

}

function getAusleiheText(obj, cellNum) {
    const addDays = (date, days) => {
        date.setDate(date.getDate() + days);
        return date;
    };
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
            editBtn();
        case 6:
            deleteBtn();
        default:
            return document.createTextNode("");
    }
}

function constructMediumTable(data) {

    if (!(data instanceof Array)) {
        return;
    }

    softReset();

    const row = document.createElement("tr");
    row.appendChild(createHeaderCell("ID"));
    row.appendChild(createHeaderCell("Titel"));
    row.appendChild(createHeaderCell("Autor"));
    row.appendChild(createHeaderCell());
    row.appendChild(createHeaderCell());
    tableHead.appendChild(row);

    // creating all cells
    for (let obj of data) {

        // creates a table row
        const row = document.createElement("tr");

        for (let index = 1; index <= 5; index++) {
            const cell1 = document.createElement("td");
            cell1.appendChild(getMediumText(obj, index));
            row.appendChild(cell1);
        }

        // add the row to the end of the table body
        tableBody.appendChild(row);
    }

}

function getMediumText(obj, cellNum) {
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

function editBtn(obj, linkFunction) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "edit";
    editBtn.classList.add("btn", "material-symbols-outlined");
    editBtn.addEventListener("click", () => {linkFunction(obj)});
    return editBtn;
}

function deleteBtn() {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.classList.add("btn", "material-symbols-outlined");
    deleteBtn.addEventListener("click", () => {linkFunction(obj)});
    return deleteBtn;
}