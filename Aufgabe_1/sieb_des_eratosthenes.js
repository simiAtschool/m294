class Medium {
    
    constructor(obj) {
        if(obj != null) {
            this._id = obj.id ? obj.id : 0;
            this._titel = obj.titel ? obj.titel : "";
            this._autor = obj.autor ? obj.autor : "";
        }
    }
    
    get id() {
        return this._id;
    }

    get titel() {
        return this._titel;
    }

    get autor() {
        return this._autor;
    }


}

button = document.getElementById("1");
medium = new Medium({id: 1, titel: "blablbalbla", autor: "jfksdjklfsd"});

function calculate(n) {

    if (n == null) {
        n = document.getElementById("inputSieve").value;
    }

    if (n == null) {
        return
    }

    // Eratosthenes algorithm to find all primes under n
    var array = [], upperLimit = Math.sqrt(n), output = [];

    // Make an array from 2 to (n - 1)
    for (var i = 0; i < n; i++) {
        array.push(true);
    }

    // Remove multiples of primes starting from 2, 3, 5,...
    for (var i = 2; i <= upperLimit; i++) {
        if (array[i]) {
            for (var j = i * i; j < n; j += i) {
                array[j] = false;
            }
        }
    }

    // All array[i] set to true are primes
    for (var i = 2; i < n; i++) {
        if (array[i]) {
            output.push(i);
        }
    }

    console.log(output);
};

async function fetchAsync(url) {
    if (url == null) {
        let value = document.getElementById("input").value.trim();
        const pattern = new RegExp("^(http[s]?:\/\/)?([0-9A-z]+\.)+[0-9A-z]+(:[0-9]+)?(\/[a-z]+|\/)+[?]?.*$", "i");
        if (!pattern.test(value)) {
            return;
        }
        url = value;
    }

    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    return data
}

async function getMedien() {
    const data = await fetchAsync("http://192.168.1.190:8080/bibliothek/medium");
    fillTable(data);
}

function fillTable(data) {
    const tblBody = document.getElementById("tbody");
    tblBody.replaceChildren();

    if(!(data instanceof Array)) {
        return;
    }
    // creating all cells
    for (let entry of data) {

        const obj = new Medium(entry);
        // creates a table row
        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        const cellText1 = document.createTextNode(obj.id ? obj.id : "");
        cell1.appendChild(cellText1);
        row.appendChild(cell1);

        
        const cell2 = document.createElement("td");
        const cellText2 = document.createTextNode(obj.titel ? obj.titel : "");
        cell2.appendChild(cellText2);
        row.appendChild(cell2);

        const cell3 = document.createElement("td");
        const cellText3 = document.createTextNode(obj.autor ? obj.autor : "");
        cell3.appendChild(cellText3);
        row.appendChild(cell3);

        // add the row to the end of the table body
        tblBody.appendChild(row);
    }

}

function test() {
    console.log(button);
    console.log(medium);
}

/* function generateTable() {
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");

    // creating all cells
    for (let i = 0; i < 2; i++) {
        // creates a table row
        const row = document.createElement("tr");

        for (let j = 0; j < 2; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            const cell = document.createElement("td");
            const cellText = document.createTextNode(`cell in row ${i}, column ${j}`);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }

        // add the row to the end of the table body
        tblBody.appendChild(row);
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    document.body.appendChild(tbl);
    // sets the border attribute of tbl to '2'
    tbl.setAttribute("border", "2");
} */
