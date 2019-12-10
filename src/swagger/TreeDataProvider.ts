import * as vscode from "vscode";
import { SwaggerTreeItem } from "./TreeItem";
import { TreeItemProject } from "./TreeItem.project";
export class SwaggerTreeDataProvider implements vscode.TreeDataProvider<SwaggerTreeItem> {
	private roots: SwaggerTreeItem[] = [];
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
		this.myOnDidChangeTreeData.fire();
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
	 * @param {SwaggerTreeItem} element
	 * @returns {Promise<SwaggerTreeItem>}
	 * @memberof SwaggerTreeDataProvider
	 */
	async getTreeItem(element: SwaggerTreeItem): Promise<SwaggerTreeItem> {
		return element;
	}
	/**
	 * this method is called everytime vscode needs to retrieve the list of children of a specific TreeElement
	 *
	 * @param {(SwaggerTreeItem | undefined)} [element]
	 * @returns {Promise<SwaggerTreeItem[]>}
	 * @memberof SwaggerTreeDataProvider
	 */
	async getChildren(element?: SwaggerTreeItem | undefined): Promise<SwaggerTreeItem[]> {
		if (element == null) {
			if (this.requireReload) {
				this.requireReload = false;
				this.roots = await this.refreshRoots();
			}
			return this.roots;
		}
		return await element.getChildren();
	}
	constructor(private context: vscode.ExtensionContext) {
	}

	/**
	 * this method produces an Array of SwaggerTreeItem starting from loaded Configs
	 *
	 * @private
	 * @returns {Promise<SwaggerTreeItem[]>}
	 * @memberof SwaggerTreeDataProvider
	 */
	private async refreshRoots(): Promise<SwaggerTreeItem[]> {
		return vscode.workspace.workspaceFolders?.map(f => new TreeItemProject(f)) || [];
	}

}
