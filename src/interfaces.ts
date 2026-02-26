export default interface TaskObject {
	content: string;
	description?: string;
	projectId?: string;
	sectionId?: string;
	order?: number | null;
	labels?: string[];
	priority?: number | null;
	dueString?: string;
	dueDate?: string | null;
	dueDatetime?: string;
	dueLang?: string;
	assigneeId?: string;
	isCompleted?: boolean;
	todoistId?: string | null;
	parentId: string | null;
	hasParent: boolean;
}