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

    static loadProjectContent(projectName) {
        const projectPreview = document.getElementById("project-preview");

        const heading = document.createElement("div");
        heading.textContent = projectName;
        heading.classList.add("tasks-list");
        heading.setAttribute("id", "tasks-list");

        projectPreview.appendChild(heading);

        if(projectName !== "Today" && projectName!== "This Week") {

            const addTaskButton = document.createElement("button");
            addTaskButton.textContent = "Add Task";
            addTaskButton.classList.add("add-task-button");
            addTaskButton.setAttribute("id", "add-task-button");

            const addTaskPopup = document.createElement("div");
            addTaskPopup.classList.add("add-task-popup");
            addTaskPopup.setAttribute("id", "add-task-popup");

            const addTaskInput = document.createElement("input");
            addTaskInput.classList.add("add-task-input");
            addTaskInput.setAttribute("id", "add-task-input");

            const addTaskPopupButtons = document.createElement("div");
            addTaskPopupButtons.classList.add("add-task-popup-buttons");
            addTaskPopupButtons.setAttribute("id", "add-task-popup-buttons");


            const addTaskPopupSubmit = document.createElement("button");
            addTaskPopupSubmit.classList.add("add-task-popup-submit");
            addTaskPopupSubmit.setAttribute("id", "add-task-popup-submit");
            addTaskPopupSubmit.textContent = "Add";

            const addTaskPopupCancel = document.createElement("button");
            addTaskPopupCancel.classList.add("add-task-popup-cancel");
            addTaskPopupCancel.setAttribute("id", "add-task-popup-cancel");
            addTaskPopupCancel.textContent = "Cancel";

            projectPreview.appendChild(addTaskButton);
            
            addTaskPopupButtons.appendChild(addTaskPopupSubmit);
            addTaskPopupButtons.appendChild(addTaskPopupCancel);

            addTaskPopup.appendChild(addTaskInput);
            addTaskPopup.appendChild(addTaskPopupButtons);
            //Details input?
        }
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
        UI.closeAddProjectPopup();
        //function to load project content
    }

    static closeAddProjectPopup() {
        const addProjectPopup =  document.getElementById("add-project-popup");
        const addProjectButton = document.getElementById("add-project-submit");
        const addProjectPopupInput = document.getElementById("input-add-project");

        addProjectButton.classList.remove("active");
        addProjectPopup.classList.remove("acitve");
        addProjectPopupInput.value = "";
    }

    static loadProjects() {
        Storage.getTodoList().getProjects().forEach((project) => {
            if(project.name !== "Home" && project.name !== "Today" && project.name !== "This Week") {
                UI.createProject(project.name);
            }
        })
    }
}