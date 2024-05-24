const ausleiheHeader = ["Medium-ID", "Kunden-ID", "Ausleihedatum", "Rückgabedatum", "", ""];
const mediumHeader = ["ID", "Titel", "Autor", "", ""];
const kundeHeader = ["ID", "Name", "E-Mail", "Adresse", "", ""];

/**
 * Function to create table head cell
 * @param {string} text Text for table head cell
 * @returns Table head cell
 */
function createHeaderCell(text) {
    const cell = document.createElement("th");
    cell.appendChild(document.createTextNode(text ? text : ""));
    return cell;
}

/**
 * Function to build table containing the ressource Ausleihe
 * @param {any[]} data Array of objects 
 * @version 1.0.0
 * @author Simon Fäs
 */
function constructAusleiheTable(data) {

    if (!(data instanceof Array)) {
        return;
    }
    softReset();

    btnCreate.addEventListener("click", () => linkToAusleiheErstellen());
    const row = document.createElement("tr");
    ausleiheHeader.forEach(element => row.appendChild(createHeaderCell(element)));
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

/**
 * Helper function for {@link constructAusleiheTable}. Used to create cell for given column
 * @param {*} obj Data, which should be represented
 * @param {number} cellNum Number of the needed cell
 * @returns Cell with content
 * @version 1.0.0
 * @author Simon Fäs
 */
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
            return editBtn(obj, linkToAusleiheErstellen);
        case 6:
            return deleteBtn(obj, linkToAusleiheTabelle, "ausleihe");
        default:
            return document.createTextNode("");
    }
}

/**
 * Function to build table containing the ressource Medium
 * @param {any[]} data Array of objects 
 * @version 1.0.0
 * @author Simon Fäs
 */
function constructMediumTable(data) {

    if (!(data instanceof Array)) {
        return;
    }

    softReset();

    btnCreate.addEventListener("click", () => linkToMediumErstellen());
    const row = document.createElement("tr");
    mediumHeader.forEach(element => row.appendChild(createHeaderCell(element)));
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

/**
 * Helper function for {@link constructMediumTable}. Used to create cell for given column
 * @param {*} obj Data, which should be represented
 * @param {number} cellNum Number of the needed cell
 * @returns Cell with content
 * @version 1.0.0
 * @author Simon Fäs
 */
function getMediumText(obj, cellNum) {
    switch (cellNum) {
        case 1:
            return document.createTextNode(obj.id ? obj.id : "");
        case 2:
            return document.createTextNode(obj.titel ? obj.titel : "");
        case 3:
            return document.createTextNode(obj.autor ? obj.autor : "");
        case 4:
            return editBtn(obj, linkToMediumErstellen);
        case 5:
            return deleteBtn(obj, linkToMediumTabelle, "medium");
        default:
            return document.createTextNode("");
    }
}


/**
 * Function to build table containing the ressource Kunde
 * @param {any[]} data Array of objects 
 * @version 1.0.0
 * @author Simon Fäs
 */
function constructKundeTable(data) {

    if (!(data instanceof Array)) {
        return;
    }

    softReset();

    btnCreate.addEventListener("click", () => linkToKundeErstellen());
    const row = document.createElement("tr");
    kundeHeader.forEach(element => row.appendChild(createHeaderCell(element)));
    tableHead.appendChild(row);

    // creating all cells
    for (let obj of data) {

        // creates a table row
        const row = document.createElement("tr");

        for (let index = 1; index <= 6; index++) {
            const cell1 = document.createElement("td");
            cell1.appendChild(getKundeText(obj, index));
            row.appendChild(cell1);
        }

        // add the row to the end of the table body
        tableBody.appendChild(row);
    }

}

/**
 * Helper function for {@link constructKundeTable}. Used to create cell for given column
 * @param {*} obj Data, which should be represented
 * @param {number} cellNum Number of the needed cell
 * @returns Cell with content
 * @version 1.0.0
 * @author Simon Fäs
 */
function getKundeText(obj, cellNum) {
    switch (cellNum) {
        case 1:
            return document.createTextNode(obj.id ? obj.id : "");
        case 2:
            return document.createTextNode(obj.vorname && obj.nachname ? `${obj.vorname} ${obj.nachname}` : "");
        case 3:
            return document.createTextNode(obj.email ? obj.email : "");
        case 4:
            return document.createTextNode(obj?.adresse?.adresse ? obj?.adresse?.adresse : "");
        case 5:
            return editBtn(obj, linkToKundeErstellen);
        case 6:
            return deleteBtn(obj, linkToKundeTabelle, "kunde");
        default:
            return document.createTextNode("");
    }
}

/**
 * Function to create edit button
 * @param {*} obj Object to be edited
 * @param {Function} linkFunction Function to change view
 * @returns Button element with event listener to change view
 * @version 1.0.0
 * @author Simon Fäs
 */
function editBtn(obj, linkFunction) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "edit";
    editBtn.classList.add("material-symbols-outlined");
    editBtn.addEventListener("click", () => { linkFunction(obj) });
    return editBtn;
}

/**
 * Function to create delete button
 * @param {*} obj Object to be deleted
 * @param {string} ressource Name of the resource of the element to be deleted
 * @returns Button element with event listener to call {@link confirmAndDelete}
 * @version 1.0.0
 * @author Simon Fäs
 */
function deleteBtn(obj, ressource) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.classList.add("material-symbols-outlined");
    deleteBtn.addEventListener("click", () => { confirmAndDelete(obj, ressource) });
    return deleteBtn;
}

/**
 * Function to confirm deleting an element. After confirmation, the element will be deleted
 * @param {*} obj Object to be deleted
 * @param {string} ressource Name of the resource of the element to be deleted
 * @version 1.0.0
 * @author Simon Fäs
 */
async function confirmAndDelete(obj, ressource) {
    result = await confirm("Wollen Sie wirklich diesen Eintrag löschen?").valueOf();
    if (result) {
        httpDelete(`${rootDir}/${ressource}`, obj.id)
            .catch(error => console.error(error))
            .then(() => (response) => {
                if (response.ok) {
                    showTable(ressource);
                } else {
                    errorHandler(response);
                }
            });
    }
}