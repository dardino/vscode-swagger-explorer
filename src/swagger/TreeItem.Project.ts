import * as vscode from "vscode";
import { SwaggerTreeItem } from "./TreeItem";
import { Config } from "../config/Config";
import { TreeItemSource } from "./TreeItem.source";

export class TreeItemProject extends SwaggerTreeItem {
	getParent(): SwaggerTreeItem | null {
		return null;
	}

	constructor(private projectFolder: vscode.WorkspaceFolder) {
		super(projectFolder.name, vscode.TreeItemCollapsibleState.Collapsed);
	}


	/**
	 * this method searches all configuration files in the current project,
	 * then creates an instance of the Config class and return the sources as children
	 *
	 * @returns {Promise<SwaggerTreeItem[]>}
	 * @memberof TreeItemProject
	 */
	async refreshChildren(): Promise<SwaggerTreeItem[]> {
		const config_patterns = (this.workbenchConfig.get("configFilePattern") as string) || `**/swagger-codegen.config.json`;
		if (!vscode.workspace.workspaceFolders) {
			return [];
		}
		let files = await new Promise<vscode.Uri[]>((resolve, reject) => {
			vscode.workspace.findFiles(config_patterns, `**/node_modules/**`).then(f => {
				resolve(f);
			});
		});
		files = files.filter(p => p.path.indexOf(this.projectFolder.uri.path) >= 0);
		const cfg = new Config(this.projectFolder, files);
		await cfg.initialize();

		return cfg.sources.map(f => new TreeItemSource(this, f));
	}
}
