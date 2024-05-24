const rootDir = "http://192.168.1.190:8080/bibliothek";

/**
 * Function to send request with HTTP GET Method 
 * @param {string} url URL 
 * @param {Function} consumerFunction Function which consumes the retrieved data
 * @version 1.0.0
 * @author Simon Fäs
 */
function httpGet(url, consumerFunction) {
    fetch(url).then(response => {
        if (response.ok) {
            response.json().then(data => consumerFunction(data))    
        } else {
            errorHandler(response);
        }
    });
}

/**
 * Function to send request with HTTP POST Method 
 * @param {string} url URL 
 * @param {any} data Content of the body
 * @version 1.0.0
 * @author Simon Fäs
 */
async function httpPost(url, data = {}) {
    const response = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Function to send request with HTTP PUT Method 
 * @param {string} url URL 
 * @param {any} data Content of the body
 * @version 1.0.0
 * @author Simon Fäs
 */
async function httpPut(url, data = {}) {
    const response = await fetch(url, {
        method: "PUT", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Function to send request with HTTP DELETE Method 
 * @param {string} url URL 
 * @param {number|string} id ID of the to be deleted element
 * @version 1.0.0
 * @author Simon Fäs
 */
async function httpDelete(url, id) {
    await fetch(`${url}/${id}`, {method: "DELETE"});
}

/**
 * Function to handle HTTP-Errors
 * @param {Response} error Response-Object with the needed information
 */
function errorHandler(error = new Response()) {
    if(error?.status || error?.statusText?.trim()?.length === 0) {
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