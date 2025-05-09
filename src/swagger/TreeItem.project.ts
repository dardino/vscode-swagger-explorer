import * as path from "path";
import * as vscode from "vscode";
import { currentExtensionPath } from "../config/Config";
import { Logger } from "../utils/Logger";
import { ContextValues, TreeItemBase } from "./TreeItem.base";
import { TreeItemConfig } from "./TreeItem.config";

export class TreeItemProject extends TreeItemBase {
	private cfgFiles: TreeItemConfig[] = [];
	public get contextValue(): ContextValues {
		return this.cfgFiles.length === 0 ? "treeItemProject" : "treeItemProjectMulti";
	}

	private myIconPathOpen = {
		light: vscode.Uri.file(path.join(currentExtensionPath, "out", "media", "light", "project_open.svg")),
		dark: vscode.Uri.file(path.join(currentExtensionPath, "out", "media", "dark", "project_open.svg"))
	};
	private myIconPathClose = {
		light: vscode.Uri.file(path.join(currentExtensionPath, "out", "media", "light", "project_close.svg")),
		dark: vscode.Uri.file(path.join(currentExtensionPath, "out", "media", "dark", "project_close.svg"))
	};

	iconPath = this.myIconPathClose;

	getParent(): TreeItemBase | null {
		return null;
	}

	get CfgFiles() {
		return this.cfgFiles;
	}

	constructor(private projectFolder: vscode.WorkspaceFolder) {
		super(projectFolder.name, vscode.TreeItemCollapsibleState.Collapsed);
		Logger.Current.Info(`Created treeItem Project...`);
	}

	/**
	 * this method searches all configuration files in the current project,
	 * then creates an instance of the Config class and return the sources as children
	 *
	 * @returns {Promise<TreeItemBase[]>}
	 * @memberof TreeItemProject
	 */
	async refreshChildren(): Promise<TreeItemBase[]> {
		const config_patterns = ((this.workbenchConfig.get("configFilePattern") as string) || `**/swaggerexplorer.config.json`).split(
			";"
		);
		const timeOut = (this.workbenchConfig.get("httpTimeout") as number) || 20000;
		if (!vscode.workspace.workspaceFolders) {
			return [];
		}
		let filesP = config_patterns.map(
			config_pattern =>
				new Promise<vscode.Uri[]>((resolve, reject) => {
					vscode.workspace.findFiles(config_pattern, `**/node_modules/**`).then(f => {
						resolve(f);
					});
				})
		);
		let files = (await Promise.all(filesP)).reduce((a, e) => a.concat(e));
		files = files.filter(p => p.path.indexOf(this.projectFolder.uri.path) >= 0);
		this.cfgFiles = files.map(f => new TreeItemConfig(this, this.projectFolder, f, timeOut));
		if (this.cfgFiles.length === 1) {
			await Promise.all(this.cfgFiles.map(c => c.initialize()));
			const childrenOfAllConfigs = await Promise.all(this.cfgFiles.map(c => c.getChildren()));
			return childrenOfAllConfigs.reduce((a, b) => a.concat(b), []);
		} else {
			return this.cfgFiles;
		}
	}
}
