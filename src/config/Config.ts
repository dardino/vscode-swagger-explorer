import * as vscode from "vscode";
import { SwaggerTreeItem } from "../swagger/TreeItem";

export interface IConfigUrl {
	projectName: string;
	url: string;
	label: string;
	local: boolean;
	projectFolder?: string;
}

export class Config {
	getChildren(): SwaggerTreeItem[] {
		return [];
	}
	public sources: IConfigUrl[] = [];

	async initialize(): Promise<void> {
	}
	constructor(private workspaceFolder: vscode.WorkspaceFolder, private cfgFiles: vscode.Uri[]) {}
}
