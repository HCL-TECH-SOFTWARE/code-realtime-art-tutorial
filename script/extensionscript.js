/*******************************************************************************
* © Copyright HCL Technologies Ltd. 2025
*******************************************************************************/

/**
 * Javascript for the Art Tutorial web view
 * 
 * @author Mattias Mohlin
 */

const vscode = acquireVsCodeApi();

// Selects the exercise row in the table
function selectExerciseRow(row) {
    // Remove the selected class from all rows
    const rows = document.querySelectorAll('#exercises_table tr');
    rows.forEach(r => r.classList.remove('selected'));
    
    row.classList.add('selected');
}

// Returns the currently selected row in the exercise table
function getSelectedExerciseRow() {
    const rows = document.querySelectorAll('#exercises_table tr.selected');
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
}

// Complete or reopen the exercise row
function completeOrReopenExerciseRow(row, completedTimestamp) {
    // Remove the selected class from all rows
    const rows = document.querySelectorAll('#exercises_table tr');
    rows.forEach(r => r.classList.remove('selected'));
    
    if (completedTimestamp != '') {
        row.classList.add('completed');
        row.getElementsByClassName('complete_button')[0].classList.add('hidden');
        row.getElementsByClassName('reopen_button')[0].classList.remove('hidden');

    }
    else {
        row.classList.remove('completed');
        row.getElementsByClassName('complete_button')[0].classList.remove('hidden');
        row.getElementsByClassName('reopen_button')[0].classList.add('hidden');
    }

    // Update the count of completed exercises
    const completedRows = document.querySelectorAll('#exercises_table tr.completed');
    document.getElementById('completed_exercises_count').textContent = completedRows.length;
}

// Return the row with the exercise name, null if none
function getExerciseRow(exercise) {    
    const rows = document.querySelectorAll('#exercises_table tr');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (getExerciseNameFromRow(row) === exercise) {
            return row;
        }
    }
    return null;
}

// Extract the name of the exercise from the row (stripping the number)
function getExerciseNameFromRow(row) {
    let text = row.firstChild.textContent;
    return text.split(':')[1].trim();
}

// Add click handler for info button
document.getElementById('info_image').addEventListener('click', async function(event) {
    vscode.postMessage({
        command: 'showInfo'
    });	
});

// Add event listeners for buttons
const openButtons = document.getElementsByClassName('open_button');
for (let i = 0; i < openButtons.length; i++) {
    openButtons[i].addEventListener('click', async function(event) {
        let tableRow = event.target.parentElement.parentElement;
        selectExerciseRow(tableRow);
        vscode.postMessage({
            command: 'openExercise',
            exerciseName: getExerciseNameFromRow(tableRow)
        });		
    });
}

const hintButtons = document.getElementsByClassName('hint_button');
for (let i = 0; i < hintButtons.length; i++) {
    hintButtons[i].addEventListener('click', async function(event) {
        let tableRow = event.target.parentElement.parentElement;
        selectExerciseRow(tableRow);
        vscode.postMessage({
            command: 'openHint',
            exerciseName: getExerciseNameFromRow(tableRow)
        });		
    });
}

const completeButtons = document.getElementsByClassName('complete_button');
for (let i = 0; i < completeButtons.length; i++) {
    completeButtons[i].addEventListener('click', async function(event) {    
        let tableRow = event.target.parentElement.parentElement;            
        vscode.postMessage({
            command: 'completeExercise',
            exerciseName: getExerciseNameFromRow(tableRow)
        });		
    });
}

const reopenButtons = document.getElementsByClassName('reopen_button');
for (let i = 0; i < reopenButtons.length; i++) {
    reopenButtons[i].addEventListener('click', async function(event) {
        let tableRow = event.target.parentElement.parentElement;                
        vscode.postMessage({
            command: 'reopenExercise',
            exerciseName: getExerciseNameFromRow(tableRow)
        });		
    });
}

const solutionButtons = document.getElementsByClassName('solution_button');
for (let i = 0; i < solutionButtons.length; i++) {
    solutionButtons[i].addEventListener('click', async function(event) {
        let tableRow = event.target.parentElement.parentElement;                
        vscode.postMessage({
            command: 'viewSolution',
            exerciseName: getExerciseNameFromRow(tableRow)
        });		
    });
}

const runButtons = document.getElementsByClassName('run_button');
for (let i = 0; i < runButtons.length; i++) {
    runButtons[i].addEventListener('click', async function(event) {
        let tableRow = event.target.parentElement.parentElement;                
        vscode.postMessage({
            command: 'runExercise',
            exerciseName: getExerciseNameFromRow(tableRow)
        });
    });
}

// Add event listener for messages sent to webview	
window.addEventListener('message', event => {
    if (event.origin && !((event.origin.startsWith("vscode-webview://"))||(event.origin.startsWith("https:")))){
        return;
    }
    const message = event.data;
    switch (message.command) {
        case 'showExerciseDescription':
            showDescription('<div id="description_top"></div>' + message.descriptionHTML);
            document.getElementById('description_top').scrollIntoView();
            break;        		
        case 'showExerciseHint':
            showDescription('<div id="description_top"></div>' + message.descriptionHTML + '<div id="hint_separator" class="separator">Hint!</div>' + message.hintHTML);
            // Make sure the hint is visible
            document.getElementById('hint_separator').scrollIntoView();
            break;        		
        case 'exerciseStatusChanged':
            let tableRow = getExerciseRow(message.exercise);
            if (tableRow) {
                completeOrReopenExerciseRow(tableRow, message.completed);
            }            
            if (message.completed) {
                showDescription('Exercise completed on ' + message.completed);
            }
            else {
                showDescription('');
            }
            break;  
    }
});

// Show the html in the description div
function showDescription(html) {
    document.getElementById('description_div').innerHTML = html;
    hookActionLinks();
    Prism.highlightAll();
}

// Set-up hyperlinks that should invoke actions
function hookActionLinks() {
    let links = document.getElementsByClassName("open-file-link");
    for (let i = 0; i < links.length; i++) {
        links[i].onclick = function() {
            let currentExerciseRow = getSelectedExerciseRow();
            if (currentExerciseRow) {                
                let filePath = this.getAttribute("href");
                vscode.postMessage({
                    command: 'openFile',
                    exerciseName: getExerciseNameFromRow(currentExerciseRow),
                    filePath: filePath
                });
            }
            return false;
        }
    }
}