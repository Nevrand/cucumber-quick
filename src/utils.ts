import * as vscode from 'vscode';
import * as fs from 'fs';
import { startProcess } from './executeCommand';

const workspaceFolder: vscode.Uri | any = vscode.window.activeTextEditor?.document.uri;

interface CucumberQuickConfiguration {
	tool: string;
	script: string;
}

/**
 * Collect cucumber-quick configuration object from .vscode/settings.json
 */
export const getCucumberQuickObject = (): CucumberQuickConfiguration => {
	let quickConfiguration: CucumberQuickConfiguration;
	console.log('workspaceFolder:', vscode.workspace.getWorkspaceFolder(workspaceFolder));
	try {
		quickConfiguration = JSON.parse(
			fs.readFileSync(
				`${vscode.workspace.getWorkspaceFolder(workspaceFolder)?.uri.fsPath}/.vscode/settings.json`,
				'utf8'
			)
		)['cucumber-quick'];
	} catch (err) {
		vscode.window.showErrorMessage('unable to read cucumber-quick configuration', err);
		throw new Error(err);
	}

	if (quickConfiguration) {
		return quickConfiguration;
	} else {
		vscode.window.showErrorMessage('cucumber-quick configuration not found in .vscode/settings.json');
		throw new Error('cucumber-quick configuration not found in .vscode/settings.json');
	}
};

/**
 * get script information from cucumber.quick configuration
 * @param cucumberQuickConfig
 */
export const getCucumberQuickScript = (cucumberQuickConfig: CucumberQuickConfiguration): string =>
	cucumberQuickConfig.script;

/**
 * get tool information from cucumber.quick configuration
 * @param cucumberQuickConfig
 */
export const getCucumberQuickTool = (cucumberQuickConfig: CucumberQuickConfiguration): string =>
	cucumberQuickConfig.tool;

/**
 * execute the command in the active vscode terminal
 * @param script
 * @param command
 * @param tool
 */
export const executeCucumberQuickCommand = (command: string) => {
	startProcess(command);
};

/**
 * create active terminal if not exists
 */
const getActiveTerminal = () => {
	return vscode.window.activeTerminal ? vscode.window.activeTerminal : vscode.window.createTerminal('cucumber-quick');
};

/**
 * This method helps to determine if the selected text is a valid scenario name
 * This method will throw error if user selects any line except Scenario or Scenario outline
 */
export const getScenarioName = () => {
	const selectedLine: string | undefined = vscode.window.activeTextEditor?.document.lineAt(
		vscode.window.activeTextEditor.selection.active.line
	).text;
	console.log('selectedLine:', selectedLine);

	if (selectedLine?.includes('Scenario')) {
		return selectedLine
			.replace(/(Scenario:|Scenario Outline:)/, '')
			.replace(/^\s\s*/, '')
			.replace(/\s\s*$/, '');
	} else if (selectedLine?.includes('@')) {
		return selectedLine.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	} else {
		vscode.window.showErrorMessage(
			`Incorrect line selected: ${selectedLine}.\n Please select Scenario or Scenario Outline`
		);
		throw new Error('Scenario Name incorrect. Please select scenario');
	}
};

/**
 * create command needed for specific scenario execution
 * @param cucumberQuickConfiguration
 * @param scenarioName
 */
export const createCommandToExecuteScenario = (scenarioName: string): string => {
	let command = `npm run test project="${scenarioName.match(/^\w+/)}" name="${scenarioName.replace(/^.+\|/, '')}"`;
	return command;
};

/**
 *
 * @param cucumberQuickConfiguration
 * @param currentFeatureFilePath
 */
const getCucumberJsFeatureExecutable = (
	cucumberQuickConfiguration: CucumberQuickConfiguration,
	currentFeatureFilePath: string | undefined
) => {
	const splitter = cucumberQuickConfiguration.script.split(' ');
	splitter[1] = `"${currentFeatureFilePath}"`;
	return splitter.join(' ');
};
