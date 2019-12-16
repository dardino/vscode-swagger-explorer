import { TreeItemBase, ContextValues } from "./TreeItem.base";
import { OpenAPIV3 } from "openapi-types";
import { TreeItemCollapsibleState } from "vscode";
import * as path from "path";
import { uniqBy } from "lodash";
import { toKeyValuePair, getReference } from "../utils/Doc";
import { TreeItemPath } from "./TreeItem.path";

export class TreeItemTag extends TreeItemBase {
	public get contextValue(): ContextValues {
		return "treeItemTag";
	}

	private myIconPath = {
		light: path.join(__filename, "..", "out", "media", "light", "tag.svg"),
		dark: path.join(__filename, "..", "out", "media", "dark", "tag.svg")
	};
	get iconPath() {
		return this.myIconPath;
	}

	constructor(private parent: TreeItemBase, private doc: OpenAPIV3.Document, private tag: OpenAPIV3.TagObject) {
		super(tag.name, TreeItemCollapsibleState.Collapsed);
	}

	getParent(): TreeItemBase | null {
		return this.parent;
	}

	async refreshChildren(): Promise<TreeItemBase[]> {
		let paths = toKeyValuePair<IItemPath>(this.doc.paths)
			.map(kvp => ({
				key: kvp.key,
				value: getReference<OpenAPIV3.PathItemObject>(kvp.value, this.doc)
			}))
			.filter(a =>
				Object.keys(a.value).some(f =>
					(a.value[f as keyof OpenAPIV3.PathItemObject] as OpenAPIV3.OperationObject).tags?.includes(this.tag.name)
				)
			)
			.map((a, kvp) => {
				return new TreeItemPath(this, a.key, a.value, this.tag.name, this.doc);
			}, [] as Array<TreeItemPath>);
		return paths;
	}
}

interface IItemPath {
	key: string;
	value: OpenAPIV3.PathItemObject;
}
