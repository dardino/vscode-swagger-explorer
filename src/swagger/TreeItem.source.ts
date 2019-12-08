import { SwaggerTreeItem } from "./TreeItem";
import { IConfigUrl, IConfig } from "../config/Config";
import * as vscode from "vscode";
import { Logger } from "../utils/Logger";
import { OpenAPI } from "openapi-types";
import { TreeItemSectionEP } from "./TreeItem.section.ep";
import { TreeItemSectionDto } from "./TreeItem.section.dto";
import * as SwaggerParser from "swagger-parser";

export class TreeItemSource extends SwaggerTreeItem {
	constructor(private parent: SwaggerTreeItem, private cfgUrl: IConfigUrl, private cfg: IConfig["sources"][0]) {
		super(cfg.label, vscode.TreeItemCollapsibleState.Collapsed);
	}
	getParent(): SwaggerTreeItem | null {
		return this.parent;
	}

	async refreshChildren(): Promise<SwaggerTreeItem[]> {
		try {
			let parser = new SwaggerParser();
			let config: OpenAPI.Document = await parser.parse(this.cfg.url);
			return [new TreeItemSectionEP(this, config), new TreeItemSectionDto(this, config)];
		} catch (err) {
			if (err.stack) {
				Logger.Current.Warning(err.stack);
			}
			Logger.Current.Error(`Error while parsing API file: ${err.message}`);
		}

		return [];
	}
}
