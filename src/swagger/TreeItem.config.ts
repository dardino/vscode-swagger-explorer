import * as vscode from "vscode";
import { TreeItemBase, ContextValues } from "./TreeItem.base";
import { IConfigUrl, parseConfigFile } from "../config/Config";
import { TreeItemSource } from "./TreeItem.source";

export class TreeItemConfig extends TreeItemBase {
	public get contextValue(): ContextValues {
		return "treeItemConfig";
	}
	private config: IConfigUrl | null = null;

	async initialize(): Promise<void> {
		this.config = await parseConfigFile(this.projectFolder, this.uri, this.timeOut);
		this.label = this.config.projectName;
	}

	constructor(
		private parent: TreeItemBase,
		private projectFolder: vscode.WorkspaceFolder,
		private uri: vscode.Uri,
		private timeOut: number
	) {
		super(uri, vscode.TreeItemCollapsibleState.Collapsed);
	}

	getParent(): TreeItemBase {
		return this.parent;
	}


	async addToConfigFile(label: string, type: string, path: string) {
		if (!this.config) {
			throw new Error("Config uri not instantiated!");
		}
		if (!(this.config.content.sources instanceof Array)) {
			this.config.content.sources = [];
		}
		this.config.content.sources.push({
			label: label,
			url: path
		});
		const newText = JSON.stringify(this.config.content, null, "\t");
		const we1 = new vscode.WorkspaceEdit();
		we1.createFile(this.config.url, { overwrite: true });
		await vscode.workspace.applyEdit(we1);
		const we2 = new vscode.WorkspaceEdit();
		we2.insert(this.config.url, new vscode.Position(1, 1), newText);
		await vscode.workspace.applyEdit(we2);
	}

	async refreshChildren(): Promise<TreeItemBase[]> {
		await this.initialize();
		return this.config?.content.sources?.map(f => new TreeItemSource(this, this.config!, f)) || [];
	}
}
