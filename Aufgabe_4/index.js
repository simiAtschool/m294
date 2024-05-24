const navigation = document.getElementById('nav');
const tableContent = document.getElementById("mainTable");
const editContent = document.getElementById("mainEdit");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const form = document.getElementById("form");
const btnCreate = document.getElementById("btnCreate");
const searchBar = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchBtn");
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

const kundeAttributes = [
    { name: "titel", type: "text", required: true },
    { name: "autor", type: "text", required: true },
    { name: "genre", type: "text" },
    { name: "altersfreigabe", type: "number", min: 0, max: 127 },
    { name: "isbn", type: "number", min: 0 },
    { name: "standortcode", type: "text" },
]

function extractFormData() {
    return convertToNestedObject(Object.fromEntries(new FormData(form).entries().filter(([k, v]) => v != null || v != '')));
}

function convertToNestedObject(obj) {
    let result = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let keys = key.split('.');
            let value = obj[key];

            let temp = result;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!temp[keys[i]]) {
                    temp[keys[i]] = {};
                }
                temp = temp[keys[i]];
            }
            temp[keys[keys.length - 1]] = value;
        }
    }

    return result;
}

function submit(event, ressource = "", id) {
    event.preventDefault();
    if(!id) {
            httpPost(`${rootDir}/${ressource}`, extractFormData())
        .catch(error => console.error(error))
        .then(() => showTable(ressource));
    } else {
        let data = extractFormData();
        if(ressource === "ausleihe") {
            data.ausleihedauer = data.ausleihedauer + 14;
        }
        httpPut(`${rootDir}/${ressource}`, data)
        .catch(error => console.error(error))
        .then(() => showTable(ressource));
    }
}

function openMenu() {
    navigation.style.display = navigation.style.display && navigation.style.display === "none" ? "flex" : "none";
}

function softReset() {
    form.replaceChildren();
    tableHead.replaceChildren();
    tableBody.replaceChildren();
}

function reset() {
    softReset();
    form.removeEventListener("submit", form);
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

    saveBtn.type = "submit";
    saveBtn.classList.add("btn", "btnSuccess");
    saveBtn.textContent = "Speichern";
    cancelBtn.addEventListener("click", () => showTable(ressource));
    cancelBtn.setAttribute("type", "button");
    cancelBtn.classList.add("btn", "btnDanger");
    cancelBtn.textContent = "Abbrechen";

    row.appendChild(saveBtn);
    if (obj && !(obj instanceof PointerEvent)) {
        saveBtn.textContent = ressource === "ausleihe" ? "Verlängern" : saveBtn.textContent;
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
    createForm(obj, "ausleihe", form, ausleiheAttributes);
    if(obj && !(obj instanceof PointerEvent)) {
        const row = document.createElement("div");
        row.classList.add("row");
        row.textContent = "Verlängern klicken, um Ausleihe, um 14 Tage zu verlängern";
        form.appendChild(row);
    }
    installButtons(obj, "ausleihe");
}

function linkToAusleiheTabelle() {
    reset();
    tableContent.classList.remove("notVisible");
    httpGet(`${rootDir}/ausleihe`, constructAusleiheTable);
}

function linkToKundeErstellen(obj) {
    reset();
    editContent.classList.remove("notVisible");
    createForm(obj, "ausleihe", form, kundeAttributes);
    installButtons(obj, "kunde");
}

function linkToKundeTabelle(searchString = "") {
    reset();
    tableContent.classList.remove("notVisible");
    searchString = searchBar.value && searchBar.value.trim() !== "" ? searchBar.value : searchString;
    httpGet(`${rootDir}/kunde/nachname/${searchString ? searchString : ""}`, constructKundeTable);
}

function linkToMediumErstellen(obj) {
    reset();
    editContent.classList.remove("notVisible");
    createForm(obj, "medium", form, mediumAttributes);
    installButtons(obj, "medium");
}

function linkToMediumTabelle() {
    reset();
    tableContent.classList.remove("notVisible");
    httpGet(`${rootDir}/medium`, constructMediumTable);
}

function createForm(obj, ressource, form, attributes) {
    form.addEventListener("submit", (event) => {submit(event, ressource, obj?.id)});
    for (attribute of attributes) {
        const row = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        row.classList.add("row");
        for (const [key, value] of Object.entries(attribute)) {
            if (key === "name") {
                input.id =  value
                input.name = value;
                label.appendChild(document.createTextNode(value));
                label.htmlFor = value;
            } else if (key === "readonly") {
                if (obj) {
                    input.readOnly = value;
                }
            } else if (key === "var") {
                input.id =  value
                input.name = value;
                label.htmlFor = value;
            } else {
                input.setAttribute(key, value.toString());
            }
        }
        try {
            input.value = obj && getValueByString(obj, attribute.var) ? getValueByString(obj, attribute.var) : obj[attribute.name] ? obj[attribute.name] : "";
        } catch (error) {}

        row.appendChild(label);
        row.appendChild(input);
        form.appendChild(row);
    }
}

function getValueByString(obj, attrArr = "") {
    let e = obj;
    for(attr of attrArr.split(".")) {
        e = e ? e[attr] : null;
    }
    return e ? e.toString() : "";
}