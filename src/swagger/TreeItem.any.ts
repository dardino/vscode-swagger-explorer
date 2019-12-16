import { TreeItemCollapsibleState } from "vscode";
import { TreeItemBase, ContextValues } from "./TreeItem.base";
import { OpenAPIV3 } from "openapi-types";

export class TreeItemAny extends TreeItemBase {
	public get contextValue(): ContextValues {
		return "treeItemAny";
	}
	getParent(): TreeItemBase | null {
		return null;
	}

	async refreshChildren(): Promise<TreeItemBase[]> {
		if (
			typeof this.object === "string" ||
			typeof this.object === "bigint" ||
			typeof this.object === "boolean" ||
			typeof this.object === "number"
		) {
			return [];
		} else if (this.object instanceof Array) {
			return this.object.map((v, i) => new TreeItemAny(i.toString(), v, this.doc));
		} else {
			return Object.keys(this.object).map(l => new TreeItemAny(l, this.object[l], this.doc));
		}
	}

	constructor(label: string, private object: any, private doc: OpenAPIV3.Document) {
		super(getMyLabel(label, object), getCollapsible(object));
	}
}

function getMyLabel(label: string, object: any): string {
	if (typeof object === "string" || typeof object === "bigint" || typeof object === "boolean" || typeof object === "number") {
		return `${label}: ${object}`;
	}
	return label;
}

function getCollapsible(object: any): TreeItemCollapsibleState {
	if (object instanceof Array) {
		return TreeItemCollapsibleState.Collapsed;
	}
	if (typeof object === "string" || typeof object === "bigint" || typeof object === "boolean" || typeof object === "number") {
		return TreeItemCollapsibleState.None;
	}
	return TreeItemCollapsibleState.Collapsed;
}
