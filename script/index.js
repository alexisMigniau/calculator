// Création d'un tableau qui va servir à stocker les entrées de la calculatrice dans l'ordre d'entrée des touches
// L'objectif est de stocker les entrées sous cette forme pour faire le calcul après
// [ 52, '+', 10.2, '-', 5]
var entree = [];

const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");

// Récupération des élements HTML important
let screen = document.getElementById("result");
let numbersButtons = document.getElementsByClassName("numberKey");
let operationsButtons = document.getElementsByClassName("operationKey");
let delButton = document.getElementById("delKey")
let resetButton = document.getElementById("resetKey");
let enterButton = document.getElementById("enterKey");

// Création des event listener
// Nombre
for(let numberButton of numbersButtons)
{
    numberButton.addEventListener("click", onNumberPressed);
}

// Opérations
for(let operationButton of operationsButtons)
{
    operationButton.addEventListener("click", onOperationPressed);
}

// Del
delButton.addEventListener('click', onDelPressed)

// Reset
resetButton.addEventListener('click', onResetPressed)

// Entrée
enterButton.addEventListener('click', onEnterPressed) 

// Event listener pour les opérations
function onOperationPressed(event) {
    audio.play();

    if(event.target.innerHTML != '.') {
        // Si la dernière entrée est une opération, ou un point alors on ne fait rien
        if(!(["+", "-", "/", "x", "."].includes(entree[entree.length - 1])) && entree.length > 0)
        {
            entree.push(event.target.innerHTML);
        }
    } else if(!isNaN(entree[entree.length - 1]) && !entree[entree.length - 1].includes('.')) { // Cas du point, on l'ajoute uniquement si la dernière entrée est un nombre valide et qui ne contient pas déja un point
        var lastEntree = entree.pop() ?? '';
        entree.push(lastEntree + event.target.innerHTML);
    }
    
    updateScreen()
}

// Event listener pour les nombres
function onNumberPressed(event) {
    audio.play();

    // Si la dernière entrée est une opération alors on ajoute une case au tableau
    if(["+", "-", "/", "x"].includes(entree[entree.length - 1]))
    {
        entree.push(event.target.innerHTML)
    } else { // Sinon on concat avec la dernière entrée
        var lastEntree = entree.pop() ?? '';
        entree.push(lastEntree + event.target.innerHTML);
    }
    
    updateScreen()
}

// Supprime le dernier caractère
function onDelPressed(event) {
    audio.play();

    if(entree.length > 0)
    {
        var lastEntree = entree.pop();
        lastEntree = lastEntree.slice(0, -1)
        if(lastEntree.length > 0)
        {
            entree.push(lastEntree);
        }

        updateScreen()
    }
}

// Vide les entrées
function onResetPressed(event) {
    audio.play();

    entree = [];
    updateScreen();
}

// Fait le calcul
function onEnterPressed(event) {
    audio.play();
    
    // Priorité mathématique (division et multiplication en premier)
    while(entree.includes('/') || entree.includes('x')) {
        if((index = entree.indexOf('/')) != -1) {
            entree.splice(index-1, 3, getResult(entree[index], parseFloat(entree[index - 1]), parseFloat(entree[index + 1])))
        }

        if((index = entree.indexOf('x')) != -1) {
            entree.splice(index-1, 3, getResult(entree[index], parseFloat(entree[index - 1]), parseFloat(entree[index + 1])))
        }
    }

    while(entree.includes('+') || entree.includes('-')) {
        if((index = entree.indexOf('+')) != -1) {
            entree.splice(index-1, 3, getResult(entree[index], parseFloat(entree[index - 1]), parseFloat(entree[index + 1])))
        }

        if((index = entree.indexOf('-')) != -1) {
            entree.splice(index-1, 3, getResult(entree[index], parseFloat(entree[index - 1]), parseFloat(entree[index + 1])))
        }
    }

    updateScreen()
}

// Opération simple
function getResult(operation, v1, v2) {
    let result = 0;
    switch(operation)
    {
        case "/":
            result = v1 / v2;
        break;
        case "x":
            result = v1 * v2;
        break;
        case "+":
            result = v1 + v2;
        break;
        case "-":
            result = v1 - v2;
        break;
    }

    return result;
}

// Met à jour l'affichage
function updateScreen()
{
    screen.innerHTML = entree.join(' ')
}