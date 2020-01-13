import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
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
	private folder: string;

	constructor(context: vscode.ExtensionContext) {
		this.folder = path.join(context.storagePath || "./", "swagger-explorer-cache");
		if (!fs.existsSync(this.folder)) {
			fs.mkdirSync(this.folder, { recursive: true });
		}
	}

	public setCache(key: string, content: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(path.join(this.folder, key), content, err => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	public getFromCache(key: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			fs.readFile(path.join(this.folder, key), (err, data) => {
				if (err) {
					reject(err);
				} else {
					Logger.Current.Info("cache key read!");
					resolve(data.toString("UTF8"));
				}
			});
		});
	}

	public exists(key: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			fs.exists(path.join(this.folder, key), exists => {
				resolve(exists);
			});
		});
	}

	public clear(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fs.readdir(this.folder, (err, files) => {
				if (err) {
					reject(err);
				} else {
					for (const file of files) {
						fs.unlink(path.join(this.folder, file), err => { });
					}
					resolve();
				}
			});

		});
	}
}
