const rootDir = "/Aufgabe_4";

function openMenu() {
    let displayMode = document.getElementById('nav').style.display;
    if(displayMode && displayMode === "none") {
        displayMode = "flex";
    } else {
        displayMode = "none";
    }
    document.getElementById('nav').style.display = displayMode;
}

function linkToHome() {
    window.location.assign(rootDir);
}

function linkToAusleiheErstellen(id) {
    window.location.assign(`${rootDir}/ausleihe/erstellen` + (id ? `/?id=${id}` : ""));
}

function linkToAusleiheTabelle() {
    window.location.assign(`${rootDir}/ausleihe/tabelle`);
}

function linkToKundeErstellen(id) {
    window.location.assign(`${rootDir}/kunde/erstellen` + (id ? `/?id=${id}` : ""));
}

function linkToKundeTabelle() {
    window.location.assign(`${rootDir}/kunde/tabelle`);
}

function linkToMediumErstellen(id) {
    window.location.assign(`${rootDir}/medium/erstellen` + (id ? `/?id=${id}` : ""));
}

function linkToMediumTabelle() {
    window.location.assign(`${rootDir}/medium/tabelle`);
}

// window.location.assign("./medium_erstellen.html?id=2");
// document.getElementById("main").style.paddingTop = document.getElementById("header").getBoundingClientRect().height.toString() + "px";