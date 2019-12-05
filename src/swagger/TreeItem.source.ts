import * as vscode from "vscode";
import { SwaggerTreeItem } from "./TreeItem";
import { IConfigUrl } from "../config/Config";

export class TreeItemSource extends SwaggerTreeItem {
	constructor(private parent: SwaggerTreeItem, f: IConfigUrl) {
		super(f.label, vscode.TreeItemCollapsibleState.Collapsed);

	}

	getParent(): SwaggerTreeItem {
		return this.parent;
	}

	async refreshChildren(): Promise<SwaggerTreeItem[]> {
		return [];
	}

}
