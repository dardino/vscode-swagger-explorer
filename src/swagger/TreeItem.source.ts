import { TreeItemBase, ContextValues } from "./TreeItem.base";
import { IConfigUrl, IConfig } from "../config/Config";
import * as vscode from "vscode";
import { Logger } from "../utils/Logger";
import { OpenAPIV3 } from "openapi-types";
import { TreeItemSectionEP } from "./TreeItem.section.ep";
import { TreeItemSectionDto } from "./TreeItem.section.dto";
import * as SwaggerParser from "swagger-parser";

import * as converter from "swagger2openapi";

export class TreeItemSource extends TreeItemBase {
	public get contextValue(): ContextValues {
		return "treeItemSource";
	}

	constructor(private parent: TreeItemBase, private cfgUrl: IConfigUrl, private cfg: IConfig["sources"][0]) {
		super(cfg.label, vscode.TreeItemCollapsibleState.Collapsed);
	}
	getParent(): TreeItemBase | null {
		return this.parent;
	}

	async refreshChildren(): Promise<TreeItemBase[]> {
		try {
			let parser = new SwaggerParser();
			const vSource = this.workbenchConfig.get("validateSource") === "true";
			let config = (await parser.parse(this.cfg.url, { validate: { schema: vSource, spec: vSource } })) as { swagger?: string } & OpenAPIV3.Document;
			if (typeof config.swagger === "string") {
				config = await convert(config);
			}
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

/**
 * @see https://github.com/Mermade/oas-kit/blob/master/packages/swagger2openapi/README.md
 *
 * @param {*} swagger
 * @returns {Promise<OpenAPIV3.Document>}
 */
function convert(swagger: any): Promise<OpenAPIV3.Document> {
	return new Promise<OpenAPIV3.Document>((resolve, reject) => {
		let options = { patch: true, warnOnly: true };
		//options.patch = true; // fix up small errors in the source definition
		//options.warnOnly = true; // Do not throw on non-patchable errors
		converter.convertObj(swagger, options, (err: any, opt: any) => {
			// options.openapi contains the converted definition
			if (err) {
				reject(err);
			} else {
				resolve(opt.openapi);
			}
		});
		// also available are asynchronous convertFile, convertUrl, convertStr and convertStream functions
		// if you omit the callback parameter, you will instead receive a Promise
	});
}
