import { SwaggerTreeItem } from "./TreeItem";
import { OpenAPI } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";
import * as path from "path";

export class TreeItemSectionDto extends SwaggerTreeItem {
	private myIconPath = {
		light: path.join(__filename, "..", "..", "media", "light", "dto.svg"),
		dark: path.join(__filename, "..", "..", "media", "dark", "dto.svg")
	};
	get iconPath() {
		return this.myIconPath;
	}

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
