import SwaggerParser from '@apidevtools/swagger-parser';
import axios from "axios";
import * as https from "https";
import { OpenAPIV3 } from "openapi-types";
import { dirname, join } from "path";
import * as converter from "swagger2openapi";
import * as vscode from "vscode";
import { CacheManager } from "../cache/manager";
import { IConfig, IConfigUrl } from "../config/Config";
import { Logger } from "../utils/Logger";
import { ContextValues, TreeItemBase } from "./TreeItem.base";
import { TreeItemSectionDto } from "./TreeItem.section.dto";
import { TreeItemSectionEP } from "./TreeItem.section.ep";

type DocExt = {
	swagger?: string;
} & OpenAPIV3.Document;

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

	async getFileContentFromRemote() {
		const validateSource = this.workbenchConfig.get<boolean>("validateSource");
		let content: OpenAPIV3.Document<{}> | null = null;
		let error: Error | null = null;
		try {
			// try to read directly from file
			const uriFile = vscode.Uri.parse(join(dirname(this.cfgUrl.url.toString() ?? "/"), this.cfg.url));
			Logger.Current.Info("> reading file <" + uriFile + "> ...");
			const contentString = (await vscode.workspace.fs.readFile(uriFile)).toString();
			Logger.Current.Info("> parsing... ");
			const parsed = await SwaggerParser.parse(JSON.parse(contentString), { validate: { schema: validateSource, spec: validateSource } });
			Logger.Current.Info("> file parsed! ");
			content = parsed as DocExt;
		} catch(err) {
			error = err as Error;
		}
		if(!content) {
			// if fails try to get with axios
			try {
				const allowInvalidCertificates = this.workbenchConfig.get<boolean>("allowInvalidCertificates");
				const agent = new https.Agent({ rejectUnauthorized: allowInvalidCertificates });
				const doc = await axios.get<string>(this.cfg.url, { responseType: "text", httpsAgent: agent });
				Logger.Current.Info("> file swagger downloaded, parsing...");
				return (await SwaggerParser.parse(JSON.parse(doc.data), { validate: { schema: validateSource, spec: validateSource }})) as DocExt;
			} catch(err) {
				error = error ?? err as Error;
			}
		}
		if (content == null) {
			throw error;
		}
		return content;
	}

	async refreshChildren(): Promise<TreeItemBase[]> {
		try {
			let config = await this.getFromCache();
			if (config == null) {
				Logger.Current.Info("Retrieving swagger file...");
				config = await this.getFileContentFromRemote();
				if (typeof config.swagger === "string") {
					config = await convert(config);
				}
				await this.saveInCache(config);
				Logger.Current.Info("Swagger file loaded!");
			} else {
				Logger.Current.Info("Swagger file loaded from cache!");
			}
			return [new TreeItemSectionEP(this, config), new TreeItemSectionDto(this, config)];
		} catch (err) {
			const {stack, message} = (err as Error);
			if (stack) {
				Logger.Current.Warning(stack);
			}
			Logger.Current.Error(`Error while parsing API file: ${message}`);
		}

		return [];
	}

	private async getFromCache(): Promise<DocExt | null> {
		const key = this.keyFromurl(this.cfg.url);
		const cacheExists = await CacheManager.Current.exists(key);
		if (cacheExists) {
			const cacheValue = await CacheManager.Current.getFromCache(key);
			if (!cacheValue) {
				return null;
			}
			try {
				return JSON.parse(cacheValue);
			} catch (err) {
				const {stack, message} = (err as Error);
				if (stack) {
					Logger.Current.Warning(stack);
				}
				Logger.Current.Error(`Error while parsing API file: ${message}`);
			}
		}
		return null;
	}

	private async saveInCache(config: DocExt) {
		const key = this.keyFromurl(this.cfg.url);
		await CacheManager.Current.setCache(key, JSON.stringify(config));
	}

	private keyFromurl(url: string): string {
		return url.replace(/\//g, "").replace(/:/g, "");
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
