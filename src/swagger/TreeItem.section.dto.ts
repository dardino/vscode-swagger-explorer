import { TreeItemBase, ContextValues } from "./TreeItem.base";
import { OpenAPIV3 } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";
import * as path from "path";
import { toKeyValuePair } from "../utils/Doc";
import { TreeItemAny } from "./TreeItem.any";
import { currentExtensionPath } from "../config/Config";

export class TreeItemSectionDto extends TreeItemBase {
	public get contextValue(): ContextValues {
		return "treeItemSectionDto";
	}

	private myIconPath = {
		light: path.join(currentExtensionPath, "out", "media", "light", "dto.svg"),
		dark: path.join(currentExtensionPath, "out", "media", "dark", "dto.svg")
	};
	get iconPath() {
		return this.myIconPath;
	}

	constructor(private parent: TreeItemBase, private doc: OpenAPIV3.Document) {
		super("DTOs", TreeItemCollapsibleState.Collapsed);
	}

	getParent(): TreeItemBase | null {
		return this.parent;
	}
	async refreshChildren(): Promise<TreeItemBase[]> {
		return toKeyValuePair(this.doc.components?.schemas).map(kvp => new TreeItemAny(kvp.key, kvp.value, this.doc));
	}

}
