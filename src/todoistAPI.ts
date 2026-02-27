import {
	TodoistApi as DoistApi,
	Task,
	AddTaskArgs
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

	async closeTask(taskId: string): Promise<void> {
		try {
			await this.api.closeTask(taskId);
		} catch (error) {
			throw new Error(`Error closing task: ${error.message}`);
		}
	}
}
