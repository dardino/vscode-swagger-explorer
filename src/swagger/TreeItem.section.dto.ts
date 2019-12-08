import { SwaggerTreeItem } from "./TreeItem";
import { OpenAPI } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";

export class TreeItemSectionDto extends SwaggerTreeItem {

	constructor(private parent: SwaggerTreeItem, private doc: OpenAPI.Document) {
		super("DTOs", TreeItemCollapsibleState.Collapsed);
	}

	getParent(): SwaggerTreeItem | null {
		return this.parent;
	}
	async refreshChildren(): Promise<SwaggerTreeItem[]> {
		return [];
	}

}
