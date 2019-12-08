import { SwaggerTreeItem } from "./TreeItem";
import { OpenAPI, OpenAPIV3, OpenAPIV2 } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";
import { TreeItemTag } from "./TreeItem.tag";
import { uniq } from "lodash";
import { extractTagsFromOperations } from "../utils/Doc";

export class TreeItemSectionEP extends SwaggerTreeItem {
	constructor(private parent: SwaggerTreeItem, private doc: OpenAPI.Document) {
		super("Endpoints", TreeItemCollapsibleState.Collapsed);
	}

	getParent(): SwaggerTreeItem | null {
		return this.parent;
	}
	async refreshChildren(): Promise<SwaggerTreeItem[]> {
		let tagStr = uniq(extractTagsFromOperations(this.doc));

		let tags =
			(this.doc.tags || []).map<TreeItemTag>((f: OpenAPIV2.TagObject | OpenAPIV3.TagObject) => {
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
