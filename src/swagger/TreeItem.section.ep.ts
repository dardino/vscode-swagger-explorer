import { TreeItemBase, ContextValues } from "./TreeItem.base";
import { OpenAPIV3 } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";
import { TreeItemTag } from "./TreeItem.tag";
import { uniq, sortBy } from "lodash";
import { extractTagsFromOperations } from "../utils/Doc";
import * as path from "path";
import { currentExtensionPath } from "../config/Config";

export class TreeItemSectionEP extends TreeItemBase {
	public get contextValue(): ContextValues {
		return "treeItemSectionEndpoint";
	}

	private myIconPath = {
		light: path.join(currentExtensionPath, "out", "media", "light", "ep.svg"),
		dark: path.join(currentExtensionPath, "out", "media", "dark", "ep.svg")
	};

	readonly iconPath = this.myIconPath;

	constructor(private parent: TreeItemBase, private doc: OpenAPIV3.Document) {
		super("Endpoints", TreeItemCollapsibleState.Collapsed);
	}

	getParent(): TreeItemBase | null {
		return this.parent;
	}
	async refreshChildren(): Promise<TreeItemBase[]> {
		let tagStr = uniq(extractTagsFromOperations(this.doc));

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
