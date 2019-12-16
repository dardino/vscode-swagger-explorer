import * as vscode from "vscode";
import { TreeItemBase } from "./TreeItem.base";
import { TreeItemProject } from "./TreeItem.project";
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
	constructor(private context: vscode.ExtensionContext) {
	}

	/**
	 * this method produces an Array of SwaggerTreeItem starting from loaded Configs
	 *
	 * @private
	 * @returns {Promise<TreeItemBase[]>}
	 * @memberof SwaggerTreeDataProvider
	 */
	private async refreshRoots(): Promise<TreeItemBase[]> {
		return vscode.workspace.workspaceFolders?.map(f => new TreeItemProject(f)) || [];
	}
}
