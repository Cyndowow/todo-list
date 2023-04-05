import UI from "./ui";

load();

function load() {
    document.addEventListener("DOMContentLoaded", UI.loadHomepage);
}

function dummyTask() {
    UI.createTask("Finish this damn project", "No date");
}