import {format} from "date-fns";
import Project from "./project";
import Task from "./task";
import Storage from "./storage";

export default class UI {

    static createProject(name) {
        const userProjects = document.getElementById("projects-list");

        const projectBtn = document.createElement("button");
        projectBtn.classList.add("project-btn");
        projectBtn.dataset.project-button;

        const projectName = document.createElement("div");
        projectName.textContent = name;

        projectBtn.appendChild(projectName);
        userProjects.appendChild(projectBtn);

        UI.initProjectButtons();
    }

    static initProjectButtons() {
        const homeBtn = document.getElementById("home-button");
        const todayBtn = document.getElementById("today-button");
        const weekBtn = document.getElementById("week-button");
        const projectButtons = document.querySelectorAll("[data-project-button]");

        homeBtn.addEventListener("click", UI.openHomeTasks);
        todayBtn.addEventListener("click", UI.openTodayTasks);
        weekBtn.addEventListener("click", UI.openWeekTasks);
        projectButtons.forEach((projectButton) => {
            projectButton.addEventListener("click", UI.handleProjectButton)
        });
    }

    static openHomeTasks() {
        UI.openProject("Home", this);
    }

    static openTodayTasks() {
        UI.openProject("Today", this);
    }

    static openWeekTasks() {
        UI.openProject("This Week", this);
    }

    static handleProjectButton(e) {
        const projectName = this.children[0].children[1].textContent; //console loggen beim debuggen

        UI.openProject(projectName, this);
    }

    static openProject(projectName, projectButton) {
        const defaultProjectButtons = document.querySelectorAll(".default-btn");

        const projectButtons = document.querySelectorAll(".project-btn");
        const buttons = [...defaultProjectButtons, ...projectButtons];

        buttons.forEach((button) => button.classList.remove("active"));
        projectButton.classList.add("active");
        //function to close adding popup
        //function to load project content
    }

    static loadProjects() {
        Storage.getTodoList().getProjects().forEach((project) => {
            if(project.name !== "Home" && project.name !== "Today" && project.name !== "This Week") {
                UI.createProject(project.name);
            }
        })
    }
}