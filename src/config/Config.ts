import * as vscode from "vscode";
import { Logger } from "../utils/Logger";

export interface IConfigUrl {
	projectName: string;
	url: vscode.Uri;
	label: string;
	local: boolean;
	projectFolder?: vscode.WorkspaceFolder;
	content: Partial<IConfig>;
}

export interface IConfig {
	sources: Array<{ label: string; url: string }>;
	generators: {
		basePath: string;
		endpoints: string[];
		dtos: string[];
	};
}

export async function parseConfigFile(project: vscode.WorkspaceFolder, uri: vscode.Uri, timeOut: number): Promise<IConfigUrl> {
	const document = await vscode.workspace.openTextDocument(uri).then(document => Promise.resolve(document));
	let config: Partial<IConfig> = {};
	try {
		config = JSON.parse(document.getText());
	} catch (err) {
		const { stack, message } = err as Error;
		if (stack) {
			Logger.Current.Warning(stack);
		}
		Logger.Current.Error(`Error while parsing config file: ${message}`);
	}

	return {
		projectName: project.name,
		url: uri,
		label: project.name,
		projectFolder: project,
		local: project.uri.scheme === "file",
		content: config
	};
}

export const currentExtension = vscode.extensions.getExtension("ganori80.swagger-explorer");
export const currentExtensionPath = currentExtension?.extensionPath || __filename;
