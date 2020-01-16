import * as vscode from "vscode";
import { TreeItemBase } from "./TreeItem.base";
import { TreeItemProject } from "./TreeItem.project";
import { CacheManager } from "../cache/manager";
import { Logger } from "../utils/Logger";
import { TreeItemConfig } from "./TreeItem.config";
import { TreeItemSource } from "./TreeItem.source";
export class SwaggerTreeDataProvider implements vscode.TreeDataProvider<TreeItemBase> {
	private roots: TreeItemBase[] = [];
	private requireReload: boolean = true;

	/**
	 * refreshes the tree item(s).
	 * this method is linked to vscode command "swaggerExplorer.refresh"
	 *
	 * @param {...any[]} args arguments provided by vscode when the command is triggered
	 * @memberof SwaggerTreeDataProvider
	 */
	public async refresh(...args: any[]) {
		this.requireReload = true;
		try {
			await CacheManager.Current.clear();
		} catch (err) {
			Logger.Current.Error(`Error deleting cache: ${err.message}`);
		}
		this.roots = [];
		this.myOnDidChangeTreeData.fire();
	}

	/**
	 * add a new source in config file
	 * @param args
	 */
	public async addNewSource(...args: any[]) {
		let arg0: TreeItemProject | TreeItemConfig = args[0];
		if (!(arg0 instanceof TreeItemProject) && !(arg0 instanceof TreeItemConfig)) {
			return;
		}
		let config: TreeItemConfig | undefined = undefined;
		if (arg0 instanceof TreeItemProject) {
			await arg0.refreshChildren();
			if (arg0.CfgFiles.length === 1) {
				config = arg0.CfgFiles[0];
			} else {
				let path = await vscode.window.showQuickPick(
					arg0.CfgFiles.map(f => f.resourceUri?.fsPath || f.resourceUri?.path || ""),
					{ canPickMany: false, placeHolder: "Select source file" }
				);
				config = arg0.CfgFiles.find(f => f.resourceUri?.fsPath || f.resourceUri?.path || "" === path);
			}
		} else {
			config = arg0;
		}
		if (config == null) {
			return;
		}

		let label = await vscode.window.showInputBox({
			prompt: "Define the source label"
		});
		if (label == null) {
			return;
		}
		let type = await vscode.window.showQuickPick(["Remote", "Local"], { placeHolder: "What is the source type?" });
		if (type == null) {
			return;
		}
		let path: string | undefined = undefined;
		if (type === "Remote") {
			path = await vscode.window.showInputBox({
				prompt: "What is the " + (type === "Remote" ? "URL" : "path") + " of source?"
			});
		} else {
			const uri = await vscode.window.showOpenDialog({
				canSelectFiles: true,
				canSelectFolders: false,
				canSelectMany: false,
				filters: { "swagger json": ["json"] },
				openLabel: "Select the swagger config file"
			});
			if (!(uri instanceof Array) || uri.length === 0) {
				return;
			}
			console.log(uri[0]);
			path = uri[0].path;
		}
		if (path == null) {
			return;
		}
		await config.refreshChildren();
		await config.addToConfigFile(label, type, path);
	}

	public get onDidChangeTreeData() {
		return this.myOnDidChangeTreeData.event;
	}
	/**
	 * event emitter to trigger a tree update
	 *
	 * @private
	 * @type {vscode.EventEmitter<undefined>}
	 * @memberof SwaggerTreeDataProvider
	 */
	private myOnDidChangeTreeData: vscode.EventEmitter<undefined> = new vscode.EventEmitter<undefined>();

	/**
	 * the element binded to the tree (SwaggerTreeItem) is itself a vscode.TreeItem
	 *
	 * @param {TreeItemBase} element
	 * @returns {Promise<TreeItemBase>}
	 * @memberof SwaggerTreeDataProvider
	 */
	async getTreeItem(element: TreeItemBase): Promise<TreeItemBase> {
		return element;
	}
	/**
	 * this method is called everytime vscode needs to retrieve the list of children of a specific TreeElement
	 *
	 * @param {(TreeItemBase | undefined)} [element]
	 * @returns {Promise<TreeItemBase[]>}
	 * @memberof SwaggerTreeDataProvider
	 */
	async getChildren(element?: TreeItemBase | undefined): Promise<TreeItemBase[]> {
		if (element == null) {
			if (this.requireReload) {
				this.requireReload = false;
				this.roots = await this.refreshRoots();
			}
			return this.roots;
		}
		return await element.getChildren();
	}

	constructor(private context: vscode.ExtensionContext) {}

	/**
	 * this method produces an Array of SwaggerTreeItem starting from loaded Configs
	 *
	 * @private
	 * @returns {Promise<TreeItemBase[]>}
	 * @memberof SwaggerTreeDataProvider
	 */
	private async refreshRoots(): Promise<TreeItemBase[]> {
		const tip = vscode.workspace.workspaceFolders?.map(f => new TreeItemProject(f)) || [];
		tip.forEach(t => t.refreshChildren());
		return tip;
	}
}
