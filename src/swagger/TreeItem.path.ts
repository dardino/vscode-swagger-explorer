import { SwaggerTreeItem } from "./TreeItem";
import { OpenAPIV3 } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";
import { TreeItemAny } from "./TreeItem.any";

export class TreeItemPath extends SwaggerTreeItem {
	getParent(): SwaggerTreeItem | null {
		return this.parent;
	}

	async refreshChildren(): Promise<SwaggerTreeItem[]> {
		return Object.keys(this.path).map(c => new TreeItemAny(c, this.path[c as keyof OpenAPIV3.PathItemObject], this.doc));
	}

	constructor(
		private parent: SwaggerTreeItem,
		private url: string,
		private path: OpenAPIV3.PathItemObject,
		private tag: string,
		private doc: OpenAPIV3.Document
	) {
		super(url, TreeItemCollapsibleState.Collapsed);
	}
}
