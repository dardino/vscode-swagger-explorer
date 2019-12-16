import { TreeItemBase, ContextValues } from "./TreeItem.base";
import { OpenAPIV3 } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";
import { TreeItemTag } from "./TreeItem.tag";
import { uniq } from "lodash";
import { extractTagsFromOperations } from "../utils/Doc";
import * as path from "path";

export class TreeItemSectionEP extends TreeItemBase {
	public get contextValue(): ContextValues {
		return "treeItemSectionEndpoint";
	}

	private myIconPath = {
		light: path.join(__filename, "..", "out", "media", "light", "ep.svg"),
		dark: path.join(__filename, "..", "out", "media", "dark", "ep.svg")
	};
	get iconPath() {
		return this.myIconPath;
	}
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

		tags = tags.concat(tagStr.map(s => new TreeItemTag(this, this.doc, { name: s, description: s })));

		return tags;
	}
}
