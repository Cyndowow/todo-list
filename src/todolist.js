import {compareAsc, toDate} from "date-fns";
import Project from "./project";
import Task from "./task";

export default class TodoList {
    constructor() {
       this.projects = [];
       //this.projects.push(new Project("Home"));
       this.projects.push(new Project("Today"));
       this.projects.push(new Project("This Week")); 
    }

    setProjects(projects) {
        this.projects = projects;
    }

    getProjects() {
        return this.projects;
    }

    getProject(projectName) {
        return this.projects.find((project) => project.getName() === projectName);
    }

    contains(projectName) {
        return this.projects.some((project) => project.getName() === projectName);
    }

    addProject(newProject) {
        if (this.projects.find((project) => project.getName() === newProject.name)) {
            return;
        }
        this.projects.push(newProject);
    }

    deleteProject(projectName) {
        const projectToDelete = this.projects.find((project) => project.getName() === projectName);
        this.projects.splice(this.projects.indexOf(projectToDelete), 1);
    }

    updateTodayProject() {
        this.getProject("Today").tasks = [];

        this.projects.forEach((project) => {
            if(project.getName() === "Today" || project.getName() === "This  Week") {
                return;
            }
            const todayTasks = project.getTasksToday();
            console.log(todayTasks);
            todayTasks.forEach((task) => {
                const taskName = `${task.getName()} (${project.getName()})`;
                this.getProject("Today").addTask(new Task(taskName, task.getDate()));
            })
        })
    }

    updateWeekProject() {
        this.getProject("This Week").tasks = [];

        this.projects.forEach((project) => {
            if(project.getName() === "Today" || project.getName() === "This  Week") {
                return;
            }

            const weekTasks = projects.getTasksThisWeek();
            weekTasks.forEach((task) => {
                const taskName = `${task.getName()} (${project.getName})`;
                this.getProject("This Week").addTask(new Task(taskName, task.getDetails(), task.getDate()));
            });
        });

        this.getProject("This Week").setTasks(
            this.getProject("This Week")
                .getTasks()
                .sort((taskA, taskB) =>
                compareAsc(
                    toDate(new Date(taskA.getDateFormatted())),
                    toDate(new Date(taskB.getDateFormatted()))
                ))    
        );
    }
}