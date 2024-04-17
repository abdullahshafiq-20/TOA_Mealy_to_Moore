function convertMealyToMoore() {
    // Get the Mealy transition table from the textarea
    const mealyTable = document.getElementById('transitionInput').value;
  
    // Convert Mealy to Moore transition table
    const mooreTable = convertToMoore(mealyTable);
  
    // Render Mealy diagram
    const mealyDiagramCode = generateMealyDiagram(mealyTable);
    mermaid.render('mealyDiagram', mealyDiagramCode, function(){});
  
    // Render Moore diagram
    const mooreDiagramCode = generateMooreDiagram(mooreTable);
    mermaid.render('mooreDiagram', mooreDiagramCode, function(){});
  
    // Display Moore transition table
    displayMooreTable(mooreTable);
  }




function convertToMoore(mealyTable) {
    // Split the input by lines to get each transition
    const transitions = mealyTable.trim().split('\n');

    // Initialize an object to store the Moore transition table
    const mooreTable = {};

    // Loop through each transition
    transitions.forEach(transition => {
        // Split the transition by '->' to get present state, input, output, and next state
        const [presentState, io, nextState] = transition.trim().split('->');
        const [input, output] = io.trim().split('/');

        // If the present state is not in the Moore table, add it
        if (!mooreTable[presentState]) {
            mooreTable[presentState] = {};
        }

        // If the output is not associated with the present state, add it
        if (!mooreTable[presentState][output]) {
            mooreTable[presentState][output] = {};
        }

        // Associate the next state with the present state and input
        mooreTable[presentState][output][input] = nextState.trim();
    });

    return mooreTable;
}

function generateMealyDiagram(mealyTable) {
    let mermaidCode = 'graph TD;\n';

    // Split the input by lines to get each transition
    const transitions = mealyTable.trim().split('\n');

    // Add nodes and edges for each transition
    transitions.forEach(transition => {
        const [presentState, io, nextState] = transition.trim().split('->');
        const [input, output] = io.trim().split('/');

        mermaidCode += `${presentState} -->|${input}/${output}| ${nextState};\n`;
    });

    return mermaidCode;
}

function generateMooreDiagram(mooreTable) {
    let mermaidCode = 'graph TD;\n';

    // Iterate over present states in the Moore table
    for (const presentState in mooreTable) {
        // Iterate over outputs associated with the present state
        for (const output in mooreTable[presentState]) {
            // Iterate over inputs associated with the present state and output
            for (const input in mooreTable[presentState][output]) {
                const nextState = mooreTable[presentState][output][input];
                mermaidCode += `${presentState}(${output}) -->|${input}| ${nextState}(${output});\n`;
            }
        }
    }

    return mermaidCode;
}

function displayMooreTable(mooreTable) {
    const mooreTableDiv = document.getElementById('mooreTable');
    mooreTableDiv.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = ['Present State', 'Next State', 'Output'];
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    table.appendChild(headerRow);

    for (const presentState in mooreTable) {
        for (const output in mooreTable[presentState]) {
            for (const input in mooreTable[presentState][output]) {
                const nextState = mooreTable[presentState][output][input];
                const row = document.createElement('tr');
                const presentStateCell = document.createElement('td');
                presentStateCell.textContent = presentState;
                const nextStateCell = document.createElement('td');
                nextStateCell.textContent = nextState;
                const outputCell = document.createElement('td');
                outputCell.textContent = output;
                row.appendChild(presentStateCell);
                row.appendChild(nextStateCell);
                row.appendChild(outputCell);
                table.appendChild(row);
            }
        }
    }

    mooreTableDiv.appendChild(table);
}
