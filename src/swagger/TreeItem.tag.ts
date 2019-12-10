import { SwaggerTreeItem } from "./TreeItem";
import { OpenAPI, OpenAPIV2, OpenAPIV3 } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";
import * as path from "path";

export class TreeItemTag extends SwaggerTreeItem {
	private myIconPath = {
		light: path.join(__filename, "..", "..", "media", "light", "tag.svg"),
		dark: path.join(__filename, "..", "..", "media", "dark", "tag.svg")
	};
	get iconPath() {
		return this.myIconPath;
	}

	constructor(private parent: SwaggerTreeItem, private doc: OpenAPI.Document, private tag: OpenAPIV2.TagObject | OpenAPIV3.TagObject) {
		super(tag.name, TreeItemCollapsibleState.Collapsed);
	}

	getParent(): SwaggerTreeItem | null {
		return this.parent;
	}

	async refreshChildren(): Promise<SwaggerTreeItem[]> {
		return [];
	}
}
