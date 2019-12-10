import { SwaggerTreeItem } from "./TreeItem";
import { OpenAPIV3 } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";
import * as path from "path";
import { toKeyValuePair } from "../utils/Doc";
import { TreeItemAny } from "./TreeItem.any";

export class TreeItemSectionDto extends SwaggerTreeItem {
	private myIconPath = {
		light: path.join(__filename, "..", "..", "media", "light", "dto.svg"),
		dark: path.join(__filename, "..", "..", "media", "dark", "dto.svg")
	};
	get iconPath() {
		return this.myIconPath;
	}

	constructor(private parent: SwaggerTreeItem, private doc: OpenAPIV3.Document) {
		super("DTOs", TreeItemCollapsibleState.Collapsed);
	}

	getParent(): SwaggerTreeItem | null {
		return this.parent;
	}
	async refreshChildren(): Promise<SwaggerTreeItem[]> {
		return toKeyValuePair(this.doc.components?.schemas).map(kvp => new TreeItemAny(kvp.key, kvp.value, this.doc));
	}

}
