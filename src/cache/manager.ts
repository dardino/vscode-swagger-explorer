import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { Logger } from "../utils/Logger";

export class CacheManager {
	private static instance: CacheManager;
	public static get Current() {
		return this.instance;
	}
	public static SetCurrent(mngr: CacheManager): void {
		if (CacheManager.instance instanceof CacheManager) {
			throw Error("Unamble to set more than one instance of CacheManager");
		}
		CacheManager.instance = mngr;
	}
	private folder: string | null;

	constructor(context: vscode.ExtensionContext) {
		let tempFolder = context.workspaceState.get<string>("folder");
		tempFolder = tempFolder ?? "./";
		context.workspaceState.update("folder", tempFolder);

		this.folder = path.join(tempFolder, "swagger-explorer-cache");
		try {
			if (!fs.existsSync(this.folder)) {
				fs.mkdirSync(this.folder, { recursive: true });
			}
		} catch(err) {
			this.folder = null;
			Logger.Current.Error(`Error creating cache folder: ${(err as Error).message}`);
		}
	}

	public setCache(key: string, content: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (!this.folder) {
				return resolve();
			}
			fs.writeFile(path.join(this.folder, key), content, err => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	public getFromCache(key: string): Promise<string | null> {
		return new Promise<string | null>((resolve, reject) => {
			if (!this.folder) {
				return resolve(null);
			}
			fs.readFile(path.join(this.folder, key), (err, data) => {
				if (err) {
					reject(err);
				} else {
					Logger.Current.Info("cache key read!");
					resolve(data.toString("utf8"));
				}
			});
		});
	}

	public exists(key: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			if (!this.folder) {
				return resolve(false);
			}
			fs.access(path.join(this.folder, key), exists => {
				resolve(exists == null);
			});
		});
	}

	public clear(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (!this.folder) {
				return resolve();
			}
			fs.readdir(this.folder, (err, files) => {
				if (err) {
					reject(err);
				} else {
					for (const file of files) {
						fs.unlink(path.join(this.folder!, file), err => { });
					}
					resolve();
				}
			});

		});
	}
}
