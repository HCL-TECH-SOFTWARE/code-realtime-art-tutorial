/*******************************************************************************
Copyright 2025 HCL Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
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