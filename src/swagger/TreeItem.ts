import * as vscode from "vscode";
export abstract class SwaggerTreeItem extends vscode.TreeItem {
	protected workbenchConfig = vscode.workspace.getConfiguration("swaggerExplorer");
	private children: SwaggerTreeItem[] = [];
	private needsReload: boolean = true;

	async getChildren(): Promise<SwaggerTreeItem[]> {
		if (this.needsReload) {
			this.needsReload = false;
			this.children = await this.refreshChildren();
		}
		return this.children;
	}

	abstract getParent(): SwaggerTreeItem | null;
	abstract refreshChildren(): Promise<SwaggerTreeItem[]>;
}
