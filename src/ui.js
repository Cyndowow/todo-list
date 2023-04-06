import {format} from "date-fns";
import Project from "./project";
import Task from "./task";
import Storage from "./storage";

export default class UI {

    static loadHomepage() {
        UI.loadProjects();
        UI.initProjectButtons();
        UI.openProject("Home", document.getElementById("home-button"));
    }

    static createProject(name) {
        const userProjects = document.getElementById("projects-list");

        const projectBtn = document.createElement("button");
        projectBtn.classList.add("project-btn");
        projectBtn.setAttribute("data", "project-button");

        const projectName = document.createElement("div");
        projectName.textContent = name;

        projectBtn.appendChild(projectName);
        userProjects.appendChild(projectBtn);

        UI.initProjectButtons();
    }

    static createTask(name, dueDate) { //Details?
        const tasksList = document.getElementById("tasks-list");

        const leftPanel = document.createElement("div");
        leftPanel.classList.add("left-panel");

        const rightPanel = document.createElement("div");
        rightPanel.classList.add("right-panel");
        
        const taskButton = document.createElement("button");
        taskButton.classList.add("task-button");
        //taskButton.setAttribute("data", "data-task-button");
        //taskButton.dataset.taskButton;

        const checkmark = document.createElement("button");
        checkmark.classList.add("checkmark");

        const taskContent = document.createElement("p");
        taskContent.textContent = name;
        taskContent.classList.add("task-content");

        const inputTaskName = document.createElement("input");
        inputTaskName.classList.add("input-task-name");
        //inputTaskName.setAttribute("data", "data-task-name-input");
        //inputTaskName.dataset.taskNameInput;

        const dDate = document.createElement("p");
        dDate.classList.add("due-date");
        //dDate.setAttribute("data", "due-date");
        dDate.setAttribute("id", "due-date");
        dDate.textContent = `${dueDate}`;

        const dateInput = document.createElement("input");
        dateInput.classList.add("due-date-input");
        //dateInput.setAttribute("data", "due-date-input");
        dateInput.setAttribute("type", "date");

        const cross = document.createElement("button");
        cross.innerHTML = "&#10006;"
        cross.classList.add("task-delete-btn");
        //cross.setAttribute("data", "data-task-delete");
        //cross.dataset.taskDelete;
        
        leftPanel.appendChild(checkmark);
        leftPanel.appendChild(taskContent);
        leftPanel.appendChild(inputTaskName);
        rightPanel.appendChild(dDate);
        rightPanel.appendChild(dateInput);
        rightPanel.appendChild(cross);

        taskButton.appendChild(leftPanel);
        taskButton.appendChild(rightPanel);

        tasksList.appendChild(taskButton);

        UI.initTaskButtons();
    }

    static clearTasks() {
        const tasksList = document.getElementById("tasks-list");
        tasksList.textContent = "";
    }

    static clearProjects() {
        const projectsList = document.getElementById("projects-list");
        projectsList.textContent = "";
    }

    static clearProjectPreview() {
        const projectPreview = document.getElementById("project-preview");
        projectPreview.textContent = "";
    }

    static clear() {
        UI.clearTasks();
        UI.clearProjects();
        UI.clearProjectPreview();
    }


    static loadProjectContent(projectName) {
        const projectPreview = document.getElementById("project-preview");

        const heading = document.createElement("h1");
        heading.textContent = projectName;
        heading.setAttribute("id", "project-name");
        
        const tasksList = document.createElement("div");
        tasksList.classList.add("tasks-list");
        tasksList.setAttribute("id", "tasks-list");

        projectPreview.appendChild(heading);
        projectPreview.appendChild(tasksList);

        if(projectName !== "Today" && projectName!== "This week") {

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

            addTaskPopupButtons.appendChild(addTaskPopupSubmit);
            addTaskPopupButtons.appendChild(addTaskPopupCancel);

            addTaskPopup.appendChild(addTaskInput);
            addTaskPopup.appendChild(addTaskPopupButtons);

            projectPreview.appendChild(addTaskButton);
            projectPreview.appendChild(addTaskPopup);
            //Details input?
            

        UI.loadTasks(projectName);
    }}

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

    static initTaskButtons() {
        const taskButtons = document.querySelectorAll(".task-delete-btn");
        console.log(taskButtons);
        const taskNameInputs = document.querySelectorAll(".input-task-name");
        const dueDateInputs = document.querySelectorAll(".due-date-input");

        taskButtons.forEach((taskButton) => { //Brackets?
            taskButton.addEventListener("click", UI.handleTaskButton);
        });
        taskNameInputs.forEach((taskNameInput) => {
            taskNameInput.addEventListener("click", UI.renameTask);
        });
        dueDateInputs.forEach((dueDateInput) => {
            dueDateInput.addEventListener("change", UI.setTaskDate);
        })

    }

    static handleTaskButton(e) {
        if(e.target.classList.contains("checkmark")) {
            UI.setTaskCompleted(this);
            return;
        }
        if(e.target.classList.contains("task-delete-btn")) {
            console.log("Yep");
            UI.deleteTask(this);
            return;
        }
        if(e.target.classList.contains("task-content")) {
            UI.openRenameInput(this);
            return;
        }
        if(e.target.classList.contains("due-date")) {
            UI.openSetDateInput(this);
        }
    }

    static setTaskCompleted(taskButton) {
        const projectName = document.getElementById("project-name").textContent;
        const taskName = taskButton.children[0].children[1].textContent; //Debug?

        if(projectName === "Today" || projectName === "This week") {
            const parentProjectName = taskName.split("(")[1].split(")")[0];
            Storage.deleteTask(parentProjectName, taskName.split(" ")[0]);
            if(projectName === "Today") {
                Storage.updateTodayProject();
            } else {
                Storage.updateWeekProject();
            }
        } else {
            Storage.deleteTask(projectName, taskName);
        }

        UI.clearTasks();
        UI.loadTasks(projectName);
    }

    static deleteTask(taskButton) {
        const projectName = document.getElementById("project-name").textContent;
        const taskName = taskButton.parentNode.parentNode.children[0].children[1].textContent; //Debug?
        console.log(taskName);

        if(projectName === "Today" || projectName === "This week") {
            const mainProjectName = taskName.split("(")[1].split(")")[0];
            Storage.deleteTask(mainProjectName, taskName);
        }
        Storage.deleteTask(projectName, taskName);
        UI.clearTasks();
        UI.loadTasks(projectName);
    }

    static initAddTaskButtons() {
        const addTaskButton = document.getElementById("add-task-button");
        const addTaskPopup = document.getElementById("add-task-popup-submit");
        const cancelAddTaskPopup = document.getElementById("add-task-popup-cancel");
        const addTaskPopupInput = document.getElementById("add-task-input");

        addTaskButton.addEventListener("click", UI.openAddTaskPopup);
        addTaskPopup.addEventListener("click", UI.addTask);
        cancelAddTaskPopup.addEventListener("click", UI.closeAddTaskPopup);
        addTaskPopupInput.addEventListener("keypress", UI.handleTaskPopupInput);
    }

    static openAddTaskPopup() {
        const addTaskPopup = document.getElementById("add-task-popup");
        const addTaskButton = document.getElementById("add-task-button");

        UI.closeAllPopups();
        addTaskButton.classList.add("active");
        addTaskPopup.classList.add("active");
    }

    static closeAddTaskPopup() {
        const addTaskPopup = document.getElementById("add-task-popup");
        const addTaskButton = document.getElementById("add-task-button");
        const addTaskPopupInput = document.getElementById("add-task-input");

        addTaskButton.classList.remove("active");
        addTaskPopup.classList.remove("active");
        addTaskPopupInput.value = "";
    }

    static addTask() {
        const projectName = document.getElementById("project-name").textContent;
        const addTaskPopupInput = document.getElementById("add-task-input");
        const taskName = addTaskPopupInput.value;

        if(taskName === "") {
            alert("Task name can't be empty");
            return;
        }
        /*if(Storage.getTodoList().getProject(projectName).contains(taskName)) {
            alert("Task names must be different");
            addTaskPopupInput.value = "";
            return;
        }*/

        //Storage.addTask(projectName, new Task(taskName));
        UI.createTask(taskName, "No date");
        UI.closeAddTaskPopup();
    }

    static handleTaskPopupInput(e) {
        if(e.key === "Enter") {
            UI.addTask();
        }
    }

    static closeAllPopups() {
        UI.closeAddProjectPopup();
        if(document.getElementById("add-task-button")) {
            UI.closeAddTaskPopup();
        }
        if(document.getElementById("tasks-list") && document.getElementById("tasks-list").innerHTML !== "") {
            UI.closeAllInputs();
        }
    }

    static renameTask(e) {
        if(e.key !== "Enter") return;

        const projectName = document.getElementById("project-name").textContent;
        const taskName = this.previousElementSibling.textContent; //Debug?
        const newTaskName = this.value;

        if(newTaskName === "") {
            alert("Task name can't be empty!");
            return;
        }

        if(Storage.getTodoList().getProject(projectName).contains(newTaskName)) {
            this.value = "";
            alert("Task names must be different!");
            return;
        }

        if(projectName === "Today" || projectName === "This week") {
            const mainProjectName = taskName.split("(")[1].split(")")[0];
            const mainTaskName = taskName.split(" ")[0];
            Storage.renameTask(projectName, taskName, `${newTaskName} (${mainProjectName})`);
            Storage.renameTask(mainProjectName, mainTaskName, newTaskName);
        } else {
            Storage.renameTask(projectName, taskName, newTaskName)
        }
        UI.clearTasks();
        UI.loadTasks(projectName);
        UI.closeRenameInput(this.parentNode.parentNode); //Debug?
    }

    static openRenameInput(taskButton) { //Debug much?
        const taskNamePara = taskButton.children[0].children[1];
        let taskName = taskNamePara.textContent;
        const taskNameInput = taskButton.children[0].children[2];
        const projectName = taskButton.parentNode.parentNode.children[0].textContent;

        if(projectName === "Today" || projectName === "This week") {
            ;[taskName] = taskName.split(" (");
        }

        UI.closeAllPopups();
        taskNamePara.classList.add("active");
        taskNameInput.classList.add("active");
        taskNameInput.value = taskName;
    }

    static closeRenameInput(taskButton) {
        const taskName = taskButton.children[0].children[1]; //Debug?
        const taskNameInput = taskButton.children[0].children[2]; //Debug?

        taskName.classList.remove("active");
        taskNameInput.classList.remove("active");
        taskNameInput.value = ""
    }

    static openSetDateInput(taskButton) {
        const dueDate = taskButton.children[1].children[0]; //Debug?
        const dueDateInput = taskButton.children[1].children[1]; //Debug?

        UI.closeAllPopups();
        dueDate.classList.add("active");
        dueDateInput.classList.add("active");
    }

    static closeSetDateInput(taskButton) {
        const dueDate = taskButton.children[1].children[0]; //Debug?
        const dueDateInput = taskButton.children[1].children[1]; //Debug?

        dueDate.classList.remove("active");
        dueDateInput.classList.remove("active");
    }

    static setTaskDate() { //Debug much again?
        const taskButton = this.parentNode.parentNode;
        const projectName = document.getElementById("project-name").textContent;
        const taskName = taskButton.children[0].children[1].textContent;
        const newDueDate = format(new Date(this.value), "dd/mm/yyyy");

        if(projectName === "Today" || projectName === "This week") {
            const mainProjectName = taskName.split("(")[1].split(")")[0];
            const mainTaskName = taskName.split(" (")[0];
            Storage.setTaskDate(projectName, taskName, newDueDate);
            Storage.setTaskDate(mainProjectName, mainTaskName, newDueDate);
            if(projectName === "Today") {
                Storage.updateTodayProject();
            } else {
                Storage.updateWeekProject();
            }
        } else {
            Storage.setTaskDate(projectName, taskname, newDueDate);
        }

        UI.clearTasksU();
        UI.loadTasks(projectName);
        UI.closeSetDateInput(taskButton);
    }

    static closeAllInputs() {
        const taskButtons = document.querySelectorAll("[data-task-button]");

        taskButtons.forEach((button) => {
            UI.closeRenameInput(button);
            UI.closeSetDateInput(button);
        });
    }

    static openHomeTasks() {
        UI.openProject("Home", this);
    }

    static openTodayTasks() {
        UI.openProject("Today", this);
    }

    static openWeekTasks() {
        UI.openProject("This week", this);
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
        UI.loadProjectContent(projectName);
    }

    static closeAddProjectPopup() {
        const addProjectPopup =  document.getElementById("add-project-popup");
        const addProjectButton = document.getElementById("add-project-submit");
        const addProjectPopupInput = document.getElementById("input-add-project");

        addProjectButton.classList.remove("active");
        addProjectPopup.classList.remove("acitve");
        addProjectPopupInput.value = "";
    }

    static addProject() {
        const addProjectPopupInput = document.getElementById("input-add-project");
        const projectName = addProjectPopupInput.value;

        if(projectname === "") {
            alert("Project name can't be empty!");
            return;
        }
        if(Storage.getTodoList().contains(projectName)) {
            addProjectPopupInput.value = "";
            alert("Project already exists");
            return;
        }

        Storage.addProject(new Project(projectName));
        UI.createProject(projectName);
        UI.closeAddProjectPopup();
    }

    static initAddProjectButtons() {
        const addProjectButton = document.getElementById("add-project-submit");
        const addProjectPopupButton = document.getElementById("add-project-btn");
        const cancelAddProjectButton = document.getElementById("add-project-cancel");
        const addProjectInput = document.getElementById("input-add-project");

        addProjectButton.addEventListener("click", UI.addProject); 
        addProjectPopupButton.addEventListener("click", UI.openAddProjectPopup);
        cancelAddProjectButton = document.getElementById("click", UI.closeAddProjectPopup);
        addProjectInput.addEventListener("keypress", UI.handleProjectButton);
    }

    static openAddProjectPopup() {
        const addProjectPopup = document.getElementById("add-project-popup");
        const addProjectPopupButton = document.getElementById("add-project-btn");

        UI.closeAllPopups();
        addProjectPopup.classList.add("active");
        addProjectPopupButton.classList.add("active")
    }

    static deleteProject(projectName, button) {
        if(button.classList.contains("active")) {
            UI.clearProjectPreview();
        }
        Storage.deleteProject(projectName);
        UI.clearProjects();
        UI.loadProjects();
    }

    static loadProjects() {
        Storage.getTodoList().getProjects().forEach((project) => {
            if(project.name !== "Home" && project.name !== "Today" && project.name !== "This week") {
                UI.createProject(project.name);
            }
        })
    }

    static loadTasks(projectName) {
        Storage.getTodoList().getProject(projectName)?.getTasks()?.forEach((task) => UI.createTask(task.name, task.dueDate));
        //Details?

        if(projectName !== "Today" && projectName !== "This week") {
            UI.initAddTaskButtons();
        }
    }
}