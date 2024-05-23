const navigation = document.getElementById('nav');
const tableContent = document.getElementById("mainTable");
const editContent = document.getElementById("mainEdit");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const form = document.getElementById("form");
const btnCreate = document.getElementById("btnCreate");
const mediumAttributes = [
    { name: "titel", type: "text", required: true },
    { name: "autor", type: "text", required: true },
    { name: "genre", type: "text" },
    { name: "altersfreigabe", type: "number", min: 0, max: 127 },
    { name: "isbn", type: "number", min: 0 },
    { name: "standortcode", type: "text" },
]

const ausleiheAttributes = [
    { name: "medium-Id", var: "medium.id", type: "number", required: true, readonly: true },
    { name: "kunden-Id", var: "kunde.id", type: "number", required: true, readonly: true },
]

function extractFormData() {
    return Object.fromEntries(new FormData(form).entries().filter(([k, v]) => v != null || v != ''));
}

function submit(event, ressource, id) {
    event.preventDefault();
    if(!id) {
            httpPost(`${rootDir}/${ressource}`, extractFormData())
        .catch(error => console.error(error))
        .then(() => showTable(ressource));
    } else {
        httpPut(`${rootDir}/${ressource}`, extractFormData())
        .catch(error => console.error(error))
        .then(() => showTable(ressource));
    }


}

function openMenu() {
    navigation.style.display = navigation.style.display && navigation.style.display === "none" ? "flex" : "none";
}

function softReset() {
    form.removeEventListener("submit", form);
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
    if (!ressource) {
        return;
    }
    if (ressource === "ausleihe") {
        linkToAusleiheTabelle();
    } else if (ressource === "kunde") {
        linkToKundeTabelle();
    } else if (ressource === "medium") {
        linkToMediumTabelle();
    }
}

function showEdit(ressource) {
    if (!ressource) {
        return;
    }
    if (ressource === "ausleihe") {
        linkToAusleiheErstellen();
    } else if (ressource === "kunde") {
        linkToKundeErstellen();
    } else if (ressource === "medium") {
        linkToMediumErstellen();
    }
}

function installButtons(obj, ressource) {
    const row = document.createElement("div");
    row.classList.add("row");
    let saveBtn = document.createElement("button");
    let cancelBtn = document.createElement("button");

    saveBtn.setAttribute("type", "submit");
    saveBtn.classList.add("btn", "btnSuccess");
    saveBtn.textContent = "Speichern";
    cancelBtn.addEventListener("click", () => showTable(ressource));
    cancelBtn.setAttribute("type", "button");
    cancelBtn.classList.add("btn", "btnDanger");
    cancelBtn.textContent = "Abbrechen";

    row.appendChild(saveBtn);
    if (obj && !(obj instanceof PointerEvent)) {
        let deleteBtn = document.createElement("button");
        deleteBtn.addEventListener("click", () => confirmAndDelete(ressource === "ausleihe" ? obj?.medium?.id : obj?.id));
        deleteBtn.setAttribute("type", "button");
        deleteBtn.classList.add("btn", "btnDanger");
        deleteBtn.textContent = "Löschen";
        row.appendChild(deleteBtn);
    }
    row.appendChild(cancelBtn);
    form.appendChild(row);
}


function linkToAusleiheErstellen(obj) {
    reset();
    editContent.classList.remove("notVisible");
    createForm(obj, form, ausleiheAttributes);
    installButtons(obj, "ausleihe");
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
    createForm(obj, form, mediumAttributes);
    installButtons(obj, "medium");
}

function linkToMediumTabelle() {
    reset();
    tableContent.classList.remove("notVisible");
    httpGet(`${rootDir}/medium`, constructMediumTable);
}

function createForm(obj, form, attributes) {
    form.addEventListener("submit", submit);
    for (attribute of attributes) {
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
            } else if (key === "readonly") {
                if (obj) {
                    input.readOnly = value
                }
            // } {

            } else if (key === "var") {
                continue;
            } else {
                input.setAttribute(key, value.toString());
            }
        }
        try {
            input.value = obj[attribute.var] ? obj[attribute.var] : obj[attribute.name] ? obj[attribute.name] : "";
        } catch (error) {}

        row.appendChild(label);
        row.appendChild(input);
        form.appendChild(row);
    }
}

function getValueByString(attrArr = []) {
    if(attrArr.length <= 0)
}