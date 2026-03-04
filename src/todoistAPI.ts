import {
	TodoistApi as DoistApi,
	Task,
	AddTaskArgs,
	UpdateTaskArgs
} from "@doist/todoist-api-typescript";
import { App, Notice } from "obsidian";
import Obsidianist from "../main";
import TaskObject from "./interfaces";

export class TodoistAPI {
	app: App;
	plugin: Obsidianist;
	api: DoistApi

	constructor(app: App, plugin: Obsidianist) {
		this.app = app;
		this.plugin = plugin;

		this.api = this.initializeAPI();
	}

	initializeAPI(): DoistApi {
		// Initialize API object and return it
		const token = this.plugin.settings.todoistAPIToken;
		const api = new DoistApi(token);
		return api;
	}

	async getAllProjects() {
		/**
		 * Fetch all projects for current API key
		 * @todo Define correct return type hint (Promise of PersonalProject/WorkspaceProject array or boolean)
		 */
		try {
			let allProjects = [];
			let cursor = null;

			do {
				const projects = await this.api.getProjects({
					cursor: cursor,
					limit: 10,
				});
				cursor = projects.nextCursor;
				allProjects = [...allProjects, ...projects.results];
			} while (cursor != null);

			return allProjects;
		} catch (error) {
			console.error("Error while fetching projects:" + error);
			new Notice("Unable to fetch all projects, check API key");

			return false;
		}
	}

	async getActiveTasks(opts: {
		projectId?: string;
		section_id?: string;
		label?: string;
		filter?: string;
		lang?: string;
		ids?: Array<string>;
	}) {

		try {
			let allTasks: Task[] = [];
			let cursor = null;

			do {
				const tasks = await this.api.getTasks({
					...opts,
					cursor: cursor,
					limit: 10,
				});
				cursor = tasks.nextCursor;
				allTasks = [...allTasks, ...tasks.results];
			} while (cursor != null);

			return allTasks;
		} catch (error) {
			console.error("Error while fetching tasks:" + error);
			new Notice("Unable to fetch all tasks, check API key");

			return false;
		}
	}

	async getTaskById(taskId: string): Promise<Task> {
		try {
			const task = await this.api.getTask(taskId);
			return task;
		} catch (error) {
			throw new Error(`Error fetching task by ID: ${error.message}`);
		}
	}

	async addTask(task: TaskObject): Promise<Task> {
		try {
			if (task.dueDate) {
				task.dueDatetime = localDateStringToUTCDatetimeString(task.dueDatetime);
				task.dueDate = null;
			}

			const newTask = await this.api.addTask(task as AddTaskArgs);
			return newTask;
		} catch (error) {
			throw new Error(`Error adding task: ${error.message}`);
		}
	}

	async updateTask(taskId: string, updatedFields: Partial<TaskObject>): Promise<Task> {
		try {
			const updatedTask = await this.api.updateTask(taskId, updatedFields as UpdateTaskArgs);
			return updatedTask;
		} catch (error) {
			throw new Error(`Error updating task: ${error.message}`);
		}
	}

	async closeTask(taskId: string): Promise<void> {
		try {
			await this.api.closeTask(taskId);
		} catch (error) {
			throw new Error(`Error closing task: ${error.message}`);
		}
	}

	async deleteTask(taskId: string): Promise<void> {
		try {
			await this.api.deleteTask(taskId);
		} catch (error) {
			throw new Error(`Error deleting task: ${error.message}`);
		}
	}

	async openTask(taskId: string): Promise<void> {
		try {
			await this.api.reopenTask(taskId);
		} catch (error) {
			throw new Error(`Error opening task: ${error.message}`);
		}
	}
}
