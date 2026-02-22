import { TodoistApi as DoistApi } from "@doist/todoist-api-typescript";
import { App, Notice } from "obsidian";
import Obsidianist from "../main";

export class TodoistAPI {
	app: App;
	plugin: Obsidianist;

	constructor(app: App, plugin: Obsidianist) {
		this.app = app;
		this.plugin = plugin;
	}

	initializeAPI(): DoistApi {
		// Initialize API object and return it
		const token = this.plugin.settings.todoistAPIToken;
		const api = new DoistApi(token);
		console.log("API initialized");
		return api;
	}

	async getAllProjects() {
		/**
		 * Fetch all project for current API key
		 */

		const api = this.initializeAPI();

		try {
			let allProjects = [];
			let cursor = null;
			do {
				const projects = await api.getProjects({
					cursor: cursor,
					limit: 10,
				});
				cursor = projects.nextCursor;
				allProjects = [...allProjects, ...projects.results];
			} while (cursor != null);
			//console.log(allProjects)
			return allProjects;
		} catch (error) {
			console.error("Error while fetching projects:" + error);
			new Notice("Can't fetch all projects, check API key");
			return false;
		}
	}
}
