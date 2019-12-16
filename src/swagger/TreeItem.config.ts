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

	async refreshChildren(): Promise<TreeItemBase[]> {
		await this.initialize();
		return this.config?.config.sources?.map(f => new TreeItemSource(this, this.config!, f)) || [];
	}
}
