const navigation = document.getElementById('nav');
const tableContent = document.getElementById("mainTable");
const editContent = document.getElementById("mainEdit");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const form = document.getElementById("form");
const mediumAttributes = [
    { name: "titel", type: "text", required: true },
    { name: "autor", type: "text", required: true },
    { name: "genre", type: "text" },
    { name: "altersfreigabe", type: "number", min: 0, max: 127 },
    { name: "isbn", type: "number", min: 0 },
    { name: "standortcode", type: "text" },
]

const ausleiheAttributes = [
    { name: "medium.id", type: "number", required: true },
    { name: "kunde.id", type: "number", required: true },
]

const element = openMenu;

function submit(event) {
    event.preventDefault();
    httpPost(`${rootDir}/medium`, Object.fromEntries(new FormData(form).entries().filter(([k, v]) => v != null || v != '')))
        .catch(error => console.error(error)).then(() => showTable('medium'));

    // console.log(

    // );
    // fetch()
}

function openMenu() {
    navigation.style.display = navigation.style.display && navigation.style.display === "none" ? "flex" : "none";
}

// function linkToHome() {
//     window.location.assign(rootDir);
// }

function softReset() {
    form.removeEventListener("submit", submit);
    form.replaceChildren();
    tableHead.replaceChildren();
    tableBody.replaceChildren();
}

function reset() {
    softReset();
    tableContent.classList.add("notVisible");
    editContent.classList.add("notVisible");
}

function showTable(ressource) {


    if (ressource) {
        if (ressource === "ausleihe") {
        } else if (ressource === "kunde") {
            const row = document.createElement("tr");
            row.appendChild(createHeaderCell("ID"));
            row.appendChild(createHeaderCell("Titel"));
            row.appendChild(createHeaderCell("Autor"));
            row.appendChild(createHeaderCell());
            row.appendChild(createHeaderCell());
            tableHead.appendChild(row);
        } else if (ressource === "medium") {
        }
    } else {

    }
}

function installButtons(edit, deleteFunc, link) {
    const row = document.createElement("div");
    row.classList.add("row");
    let saveBtn = document.createElement("button");
    let cancelBtn = document.createElement("button");
    
    saveBtn.setAttribute("type", "submit");
    saveBtn.classList.add("btnSuccess");
    cancelBtn.addEventListener("click", link);
    cancelBtn.classList.add("btnDanger");

    row.appendChild(saveBtn);
    if (edit) { 
        let deleteBtn = document.createElement("button");
        deleteBtn.addEventListener("click", deleteFunc);
        deleteBtn.classList.add("btnDanger");
        row.appendChild(deleteBtn);
    }
    row.appendChild(cancelBtn);
    form.appendChild(row);
}


function linkToAusleiheErstellen(obj) {
    reset();
    editContent.classList.remove("notVisible");

    for (attribute of ausleiheAttributes) {
        const row = document.createElement("div");
        const label = document.createElement("label")
        const input = document.createElement("input");
        row.classList.add("row");
        for (const [key, value] of Object.entries(attribute)) {
            if (key === "name") {
                input.id = value
                input.name = value;
                label.appendChild(document.createTextNode(value));
                label.htmlFor = value;
            } else {
                input.setAttribute(key, value.toString());
            }
        }
        row.appendChild(label);
        row.appendChild(input);
        form.appendChild(row);
    }
}

function linkToAusleiheTabelle() {
    reset();
    tableContent.classList.remove("notVisible");
    httpGet(`${rootDir}/ausleihe`, constructAusleiheTable)
}

function linkToKundeErstellen(id) {
    window.location.assign(`${rootDir}/kunde/erstellen` + (id ? `/?id=${id}` : ""));
}

function linkToKundeTabelle() {
    window.location.assign(`${rootDir}/kunde/tabelle`);
}

function linkToMediumErstellen(obj) {
    reset();
    editContent.classList.remove("notVisible");

    form.addEventListener('submit', submit);

    for (attribute of mediumAttributes) {
        const row = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        row.classList.add("row");
        for (const [key, value] of Object.entries(attribute)) {
            if (key === "name") {
                input.id = value
                input.name = value;
                label.appendChild(document.createTextNode(value));
                label.htmlFor = value;
            } else {
                input.setAttribute(key, value.toString());
            }
        }
        row.appendChild(label);
        row.appendChild(input);
        form.appendChild(row);
    }
    // installButtons(
    //     edit, 
    // );
}

function linkToMediumTabelle() {
    reset();
    tableContent.classList.remove("notVisible");
    httpGet(`${rootDir}/medium`, constructMediumTable);
}


