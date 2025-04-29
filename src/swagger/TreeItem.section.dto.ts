import { OpenAPIV3 } from "openapi-types";
import * as path from "path";
import { TreeItemCollapsibleState, Uri } from "vscode";
import { currentExtensionPath } from "../config/Config";
import { sortBy } from "../utils/Array";
import { toKeyValuePair } from "../utils/Doc";
import { TreeItemAny } from "./TreeItem.any";
import { ContextValues, TreeItemBase } from "./TreeItem.base";

export class TreeItemSectionDto extends TreeItemBase {
	public get contextValue(): ContextValues {
		return "treeItemSectionDto";
	}

	private myIconPath = {
		light: Uri.file(path.join(currentExtensionPath, "out", "media", "light", "dto.svg")),
		dark : Uri.file(path.join(currentExtensionPath, "out", "media", "dark", "dto.svg"))
	};

	readonly iconPath = this.myIconPath;

	constructor(private parent: TreeItemBase, private doc: OpenAPIV3.Document) {
		super("DTOs", TreeItemCollapsibleState.Collapsed);
	}

	getParent(): TreeItemBase | null {
		return this.parent;
	}
	async refreshChildren(): Promise<TreeItemBase[]> {
		return sortBy(toKeyValuePair(this.doc.components?.schemas).map(kvp => new TreeItemAny(kvp.key, kvp.value, this.doc)), s => s.label);
	}

}
