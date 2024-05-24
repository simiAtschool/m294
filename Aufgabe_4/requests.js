const rootDir = "http://192.168.1.190:8080/bibliothek";

function test() {
    console.log("Success")
}

function httpGet(url, consumerFunction) {
    fetch(url).then(response => {
        if (response.ok) {
            response.json().then(data => consumerFunction(data))    
        } else {
            errorHandler(response);
        }
    });
}

async function httpPost(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function httpPut(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function httpDelete(url = "", id) {
    // Default options are marked with *
    await fetch(`${url}/${id}`, {method: "DELETE"});
}

function errorHandler(error = new Response()) {
    if(error.statusText.trim().length === 0) {
        let text = "";
        if(error.status === 404) {
            text = "Objekt nicht gefunden";
        } else if(error.status === 409) {
            text = "Konflikt. Objekt besteht bereits";
        } else if(error.status === 500) {
            text = "Interner Server-Error";
        }
        window.alert(`HTTP-Code ${error.status}: ${text}`);
    } else {
        window.alert(`HTTP-Code ${error.status}: ${error.statusText}`);
    }
}