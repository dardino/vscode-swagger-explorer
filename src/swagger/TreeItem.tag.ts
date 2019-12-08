import { SwaggerTreeItem } from "./TreeItem";
import { OpenAPI, OpenAPIV2, OpenAPIV3 } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";

export class TreeItemTag extends SwaggerTreeItem {
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
