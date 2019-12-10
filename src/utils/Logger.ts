import * as vs from "vscode";
import * as chalk from "chalk";

export class Logger {
	static readonly INFO: "INFO" = "INFO";
	static readonly WARN: "WARN" = "WARN";
	static readonly ERR: "ERR" = "ERR";

	private static loggerInstance: Logger;
	private outputChannel: vs.OutputChannel;
	private constructor() {
		this.outputChannel = vs.window.createOutputChannel("Swagger Explorer");
		this.outputChannel.show(true);
	}
	static get Current(): Logger {
		if (!(Logger.loggerInstance instanceof Logger)) {
			Logger.loggerInstance = new Logger();
		}
		return Logger.loggerInstance;
	}

	Log(
		message: string,
		Level: typeof Logger.INFO | typeof Logger.ERR | typeof Logger.WARN = Logger.INFO,
		newline: boolean = false
	) {
		const fnColor = Level === "INFO" ? chalk.gray : Level === "WARN" ? chalk.yellow : Level === "ERR" ? chalk.red : chalk.white;
		const msg = `${message}`;
		try {
			if (newline) {
				this.outputChannel.appendLine(fnColor(msg));
			} else {
				this.outputChannel.append(fnColor(msg));
			}
		} catch (err) {
			// tslint:disable-next-line: no-console
			console.error(message);
		}
	}
	Info(message: string) {
		this.Log(`[${Logger.INFO[0]}] - ${message}`, Logger.INFO, true);
	}
	Warning(message: string) {
		this.Log(`[${Logger.WARN[0]}] - ${message}`, Logger.WARN, true);
	}
	Error(message: string) {
		this.Log(`[${Logger.ERR[0]}] - ${message}`, Logger.ERR, true);
	}
}
