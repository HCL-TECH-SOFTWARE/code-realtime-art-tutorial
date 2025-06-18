/*******************************************************************************
* © Copyright HCL Technologies Ltd. 2025
*******************************************************************************/

/**
 * Extension entry point
 * 
 * @author Mattias Mohlin
 */

import * as vscode from 'vscode';
import { registerExercisesCmd } from './exercises_cmd';

// This function is called when the extension is activated
function activate(context : vscode.ExtensionContext) {
	context.subscriptions.push(registerExercisesCmd(context));
}

// This function is called when the extension is deactivated
function deactivate() {
	// This is intentionally empty
}

module.exports = {
	activate,
	deactivate
}