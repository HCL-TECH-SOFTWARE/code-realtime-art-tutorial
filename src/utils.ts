/*******************************************************************************
* © Copyright HCL Technologies Ltd. 2025
*******************************************************************************/

/**
 * Misc utilities
 * 
 * @author Mattias Mohlin
 */


import * as vscode from 'vscode';
import showdown from 'showdown';
import { JSDOM } from "jsdom";
import DOMPurify from 'dompurify';

export function hasOwnProperty<X extends {}, Y extends PropertyKey>
    (obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop)
}

let outputChannel: vscode.OutputChannel = null;

// Write a log message for the extension to its own output channel
export function logMessage(msg: string) {
    if (!outputChannel)
        outputChannel = vscode.window.createOutputChannel("Art Tutorial");

    outputChannel.appendLine(getTimestamp() + ' ' + msg);
    outputChannel.show();
}

const markdownConverter = new showdown.Converter();
const window = new JSDOM("").window;
const DOMPurifyServer = DOMPurify(window);

export function markdownToHTML(markdown: string) : string {
    let html: string = markdownConverter.makeHtml(markdown);
    
    // Sanitize the HTML to prevent XSS attacks
    let cleanHtml = DOMPurifyServer.sanitize(html);
    return cleanHtml;
}

export function getTimestamp() : string {
    const timestamp = new Date();
    return timestamp.toLocaleDateString() + ' : ' + timestamp.toLocaleTimeString();
}

export function replaceAll(str : string, find : string, replace : string) {
    let s = str as any; // Workaround for that tsconfig modern string libraries doesn't work with node-html-parser
    return s.replaceAll(find, replace);
}

// Represents the result of invoking a command that can either fail or succeed with a message.
export class CmdResult {
    failed:boolean; // Did the command fail?
    info:boolean; // Did the command complete with an information message?
    msg:string; // Message returned by the command

    constructor(failed:boolean, info:boolean, msg:string) {
        this.failed = failed;
        this.info = info;
        this.msg = msg;
    }

    static error(msg : string) {
        return new CmdResult(true, false, msg);        
    }

    static info(msg : string) {
        return new CmdResult(false, true, msg);
    }

    // Command completed normally without providing a message. In this case the command typically
    // contains JSON.
    static noMessage() {
        return new CmdResult(false, false, "(no message)");
    }
};

/**
 * Checks if the result string returned by a command shows that the command
 * failed. In that case the result string is on the form "Failed:<msg>", 
 * where <msg> is a message that explains the failure.
 * 
 * Another option (for some commands) is that the result string is on the form "Info:<msg>", which
 * means that the command completed normally, but with an information message
 * that provides additional information.
 */
export function checkCommandFailure(result : any) : CmdResult {
    if (typeof result === 'string' && result.startsWith('Failed')) {
        let i = result.indexOf(':');
        if (i > 0) {
            const message = result.substring(i+1);            
            return CmdResult.error(message);
        }
        return CmdResult.error("(no error message provided)");
    }
    else if (typeof result === 'string' && result.startsWith('Info')) {
        let i = result.indexOf(':');
        if (i > 0) {
            const message = result.substring(i+1);            
            return CmdResult.info(message);
        }
        return CmdResult.info("(no info message provided)");
    }
    return CmdResult.noMessage();
}
