import * as vscode from "vscode";

export type ContextValues =
	| "treeItemSource"
	| "treeItemSectionEndpoint"
	| "treeItemSectionDto"
	| "treeItemProject"
	| "treeItemPath"
	| "treeItemConfig"
	| "treeItemAny"
	| "treeItemTag";
export abstract class TreeItemBase extends vscode.TreeItem {
	redraw() {

	}
	protected workbenchConfig = vscode.workspace.getConfiguration("swaggerExplorer");
	private children: TreeItemBase[] = [];
	private needsReload: boolean = true;

	async getChildren(): Promise<TreeItemBase[]> {
		if (this.needsReload) {
			this.needsReload = false;
			this.children = await this.refreshChildren();
		}
		return this.children;
	}

	abstract contextValue: ContextValues;

	abstract getParent(): TreeItemBase | null;
	abstract refreshChildren(): Promise<TreeItemBase[]>;
}
