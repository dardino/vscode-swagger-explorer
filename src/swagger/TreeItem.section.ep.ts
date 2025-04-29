import { OpenAPIV3 } from "openapi-types";
import * as path from "path";
import { TreeItemCollapsibleState, Uri } from "vscode";
import { currentExtensionPath } from "../config/Config";
import { sortBy } from "../utils/Array";
import { extractTagsFromOperations } from "../utils/Doc";
import { ContextValues, TreeItemBase } from "./TreeItem.base";
import { TreeItemTag } from "./TreeItem.tag";

export class TreeItemSectionEP extends TreeItemBase {
	public get contextValue(): ContextValues {
		return "treeItemSectionEndpoint";
	}

	private myIconPath = {
		light: Uri.file(path.join(currentExtensionPath, "out", "media", "light", "ep.svg")),
		dark : Uri.file(path.join(currentExtensionPath, "out", "media", "dark", "ep.svg"))
	};

	readonly iconPath = this.myIconPath;

	constructor(private parent: TreeItemBase, private doc: OpenAPIV3.Document) {
		super("Endpoints", TreeItemCollapsibleState.Collapsed);
	}

	getParent(): TreeItemBase | null {
		return this.parent;
	}
	async refreshChildren(): Promise<TreeItemBase[]> {
		let tagStr = Array.from(new Set(extractTagsFromOperations(this.doc)));

		let tags =
			(this.doc.tags || []).map<TreeItemTag>((f: OpenAPIV3.TagObject) => {
				const ix = tagStr.indexOf(f.name);
				if (ix >= 0) {
					tagStr.splice(ix, 1);
				}
				return new TreeItemTag(this, this.doc, f);
			}) || [];

		tags = sortBy(tags.concat(tagStr.map(s => new TreeItemTag(this, this.doc, { name: s, description: s }))), s => s.label);

		return tags;
	}
}
