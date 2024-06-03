const navigation = document.getElementById('nav');
const tableContent = document.getElementById("mainTable");
const editContent = document.getElementById("mainEdit");
const loginContent = document.getElementById("mainLogin");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const form = document.getElementById("form");
const btnCreate = document.getElementById("btnCreate");
const searchBar = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchBtn");
const btnMenu = document.getElementById("btnMenu");
const loginName = document.getElementById("inputName");
const loginPassword = document.getElementById("inputPassword");
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
    { name: "vorname", type: "text", required: true },
    { name: "nachname", type: "text", required: true },
    { name: "email", type: "text", required: true },
    { name: "geburtstag", type: "date" },
    { name: "adresse", var: "adresse.adresse", type: "text", required: true },
    { name: "Ort", var: "adresse.ort", type: "text", required: true },
    { name: "Postleitzahl", var: "adresse.zip", type: "text", required: true },
]
let authString = "";

/**
 * Extracts values from form and constructs an usable object from it
 * @returns Data extracted from form
 * @version 1.0.0
 * @author Simon Fäs
 */
function extractFormData() {
    return convertToNestedObject(Object.fromEntries(new FormData(form).entries().filter(([k, v]) => v != null || v != '')));
}

/**
 * Code was copied by ChatGPT
 * Explanation of the code:
 * Initial Object: We start with an object that has a key using dot notation.
 * 
 * convertToNestedObject Function:
 * Iteration: Loop through each key in the original object.
 * Split Key: Split the key by the dot to get an array of keys.
 * Construct Nested Object: Dynamically build the nested object using a temporary reference.
 * Assign Value: Set the value at the appropriate nested level.
 * Return Result: Return the newly constructed nested object.
 *  
 * @param {*} obj 
 * @returns Nested object 
 * @version 1.0.0
 * @author ChatGPT
 */
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

/**
 * Function for submitting the data from the form
 * @param {SubmitEvent} event SubmitEvent from form
 * @param {string} ressource Name of the ressource which is being submitted
 * @param {number} id Id of the submitted item
 * @version 1.0.0
 * @author Simon Fäs
 */
function submit(event, ressource, id = null) {
    const resolve = (response) => {
        if (response.ok) {
            showTable(ressource);
        } else {
            errorHandler(response);
        }
    }
    event.preventDefault();
    if (!id && ressource) {
        httpPost(`${rootDir}/${ressource}`, extractFormData())
            .catch(error => console.error(error))
            .then((response) => resolve(response));
    } else if (ressource) {
        let data = extractFormData();
        if (ressource === "ausleihe") {
            data.ausleihedauer = data.ausleihedauer + 14;
        }
        httpPut(`${rootDir}/${ressource}`, data)
            .catch(error => console.error(error))
            .then(response => resolve(response));
    }
}

/**
 * Function to close and open menu
 * @version 1.0.0
 * @author Simon Fäs
 */
function openMenu() {
    navigation.style.display = navigation.style.display && navigation.style.display === "none" ? "flex" : "none";
}

/**
 * Function to clear table and form content
 * @version 1.0.0
 * @author Simon Fäs
 */
function softReset() {
    form.replaceChildren();
    tableHead.replaceChildren();
    tableBody.replaceChildren();
}

/**
 * Function to clear event listeners, 
 * the table and form contents and make all contents invisible.
 * @version 1.0.0
 * @author Simon Fäs
 */
function reset() {
    softReset();
    form.removeEventListener("submit", form);
    tableContent.classList.add("notVisible");
    editContent.classList.add("notVisible");
    loginContent.classList.add("notVisible");
    searchBar.classList.add("notVisible");
    searchBtn.classList.add("notVisible");
}

/**
 * Function to open table view of a specific ressource
 * @param {string} ressource Name of the ressource
 * @version 1.0.0
 * @author Simon Fäs
 */
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

/**
 * Function to open edit view of a specific ressource
 * @param {string} ressource Name of the ressource
 * @version 1.0.0
 * @author Simon Fäs
 */
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

/**
 * Function to produce the buttons of the form
 * @param {*} obj Object to edit
 * @param {string} ressource Name of the resource to edit
 * @version 1.0.0
 * @author Simon Fäs
 */
function installButtons(obj, ressource) {
    const row = document.createElement("div");
    row.classList.add("row");
    let saveBtn = document.createElement("button");
    let cancelBtn = document.createElement("button");

    saveBtn.type = "submit";
    saveBtn.classList.add("btnSuccess");
    saveBtn.textContent = "Speichern";
    cancelBtn.addEventListener("click", () => showTable(ressource));
    cancelBtn.setAttribute("type", "button");
    cancelBtn.classList.add("btnDanger");
    cancelBtn.textContent = "Abbrechen";

    row.appendChild(saveBtn);
    if (obj && !(obj instanceof PointerEvent)) {
        saveBtn.textContent = ressource === "ausleihe" ? "Verlängern" : saveBtn.textContent;
        let deleteBtn = document.createElement("button");
        deleteBtn.addEventListener("click", () => confirmAndDelete(ressource === "ausleihe" ? obj?.medium?.id : obj?.id));
        deleteBtn.setAttribute("type", "button");
        deleteBtn.classList.add("btnDanger");
        deleteBtn.textContent = "Löschen";
        row.appendChild(deleteBtn);
    }
    row.appendChild(cancelBtn);
    form.appendChild(row);
}

/**
 * Function to load contents of the view "Ausleihe erstellen"
 * @param {*} obj Object to edit
 * @version 1.0.0
 * @author Simon Fäs
 */
function linkToAusleiheErstellen(obj) {
    reset();
    editContent.classList.remove("notVisible");
    createForm(obj, "ausleihe", form, ausleiheAttributes);
    if (obj && !(obj instanceof PointerEvent)) {
        const row = document.createElement("div");
        row.classList.add("row");
        row.textContent = "Verlängern klicken, um Ausleihe, um 14 Tage zu verlängern";
        form.appendChild(row);
    }
    installButtons(obj, "ausleihe");
}

/**
 * Function to load contents of the view "Ausleihetabelle"
 * @version 1.0.0
 * @author Simon Fäs
 */
function linkToAusleiheTabelle() {
    reset();
    tableContent.classList.remove("notVisible");
    httpGet(`${rootDir}/ausleihe`, constructAusleiheTable);
}

/**
 * Function to load contents of the view "Kunde erstellen"
 * @param {*} obj Object to edit
 * @version 1.0.0
 * @author Simon Fäs
 */
function linkToKundeErstellen(obj) {
    reset();
    editContent.classList.remove("notVisible");
    if (obj && obj.geburtstag) {
        obj.geburtstag = new Date(obj.geburtstag).toISOString().split("T")[0];
    }
    createForm(obj, "kunde", form, kundeAttributes);
    installButtons(obj, "kunde");
}

/**
 * Function to load contents of the view "Kundentabelle"
 * @param {string} [searchString=""] String to search for Objects
 * @version 1.0.0
 * @author Simon Fäs
 */
function linkToKundeTabelle(searchString = "") {
    reset();
    tableContent.classList.remove("notVisible");
    searchBar.classList.remove("notVisible");
    searchBtn.classList.remove("notVisible");
    searchString = searchBar.value && searchBar.value.trim() !== "" ? searchBar.value : searchString;
    if (searchString && searchString != "") {
        httpGet(`${rootDir}/kunde/nachname/${searchString}`, constructKundeTable);
    }
}

/**
 * Function to load contents of the view "Medium erstellen"
 * @param {*} obj Object to edit
 * @version 1.0.0
 * @author Simon Fäs
 */
function linkToMediumErstellen(obj) {
    reset();
    editContent.classList.remove("notVisible");
    createForm(obj, "medium", form, mediumAttributes);
    installButtons(obj, "medium");
}

/**
 * Function to load contents of the view "Medientabelle"
 * @version 1.0.0
 * @author Simon Fäs
 */
function linkToMediumTabelle() {
    reset();
    tableContent.classList.remove("notVisible");
    httpGet(`${rootDir}/medium`, constructMediumTable);
}

/**
 * Function to fill form with input elements
 * @param {*} obj Object to edit
 * @param {string} ressource Name of the ressource
 * @param {HTMLFormElement} form HTML form element
 * @param {Object[]} attributes Array of objects containing information about the input element.
 * @see {@link ausleiheAttributes}, {@link mediumAttributes}, {@link kundeAttributes}
 * @version 1.0.0
 * @author Simon Fäs
 */
function createForm(obj = null, ressource, form, attributes) {
    form.addEventListener("submit", (event) => { submit(event, ressource, obj?.id) });
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
                    input.readOnly = value;
                }
            } else if (key === "var") {
                input.id = value
                input.name = value;
                label.htmlFor = value;
            } else {
                input.setAttribute(key, value.toString());
            }
        }
        try {
            input.value = obj && getValueByString(obj, attribute.var) ? getValueByString(obj, attribute.var) : obj[attribute.name] ? obj[attribute.name] : "";
        } catch (error) { }

        row.appendChild(label);
        row.appendChild(input);
        form.appendChild(row);
    }
}

/**
 * Function to get a value from an nested object with a string
 * @version 1.0.0
 * @author Simon Fäs
 */
function getValueByString(obj, attrArr = "") {
    let e = obj;
    for (attr of attrArr.split(".")) {
        e = e ? e[attr] : null;
    }
    return e ? e.toString() : "";
}

/**
 * Function to log user in
 * @version 1.0.0
 * @author Simon Fäs
 */
function tryLogin() {
    tmp = `${loginName.value}:${loginPassword.value}`;
    authString = `Basic ${btoa(tmp)}`;
    fetch(`${rootDir}/ausleihe`, {
        headers: {
            "Authorization": authString,
        }
    }).then(response => {
        if(response.ok) {
            loginContent.classList.add("notVisible");
            btnMenu.classList.remove("notVisible");
            alert("Login erfolgreich");
        } else {
            alert("Logindaten ungültig");
        }
    })
}

