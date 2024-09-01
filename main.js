///// DOM elements /////
const resistorElem = document.querySelector("[js-resistor]");
const resistorForm = document.querySelector("[js-resistor-form]");
const resistorGuess = document.querySelector("[js-resistor-guess]");
const infoElem = document.querySelector("[js-info]");


///// Globals /////
let currentResistorValue = null;


///// Generation /////
function generateResistorBars(nBands){
    if(nBands < 4 || nBands > 5){
        nBands = 4;
    }

    let nValueBands = nBands - 2;

    let colorBars = [
        ...choice(valueCodingColors, nValueBands),
        ...choice(multiplierCodingColors, 1),
        ...choice(toleranceCodingColors, 1),
    ];

    return colorBars;
}


const getColorBarHTML = (color) => {
    if(resistorColors.indexOf(color) === -1)
        return null;

    return `<div class="resistor__bar resistor__bar__${color}"></div>`
}


function generateResistor(nBands){
    const bars = generateResistorBars(nBands);
    const resistorValue = calculateResistorValue(bars);
    const barsAsHTML = bars.map(bar => getColorBarHTML(bar)).join("");

    resistorElem.innerHTML = barsAsHTML;
    currentResistorValue = resistorValue;
}


///// Event handling /////
resistorForm.addEventListener("submit", e => {
    e.preventDefault();

    let guess = resistorGuess.value;

    if(guess === "")
        return;

    guess = parseInt(guess);

    if(guess !== currentResistorValue){
        infoElem.innerHTML = "WRONG";
        infoElem.classList.add("info--wrong");

        setTimeout(() => infoElem.classList.remove("info--wrong"), 2500);
        return;
    }

    infoElem.innerHTML = "CORRECT";
    infoElem.classList.add("info--correct");

    setTimeout(() => infoElem.classList.remove("info--correct"), 2500);

    generateResistor(5);
})


///// TOOLS /////

function choice(array, nChoices){
    if(!(array instanceof Array) || array.length < nChoices || nChoices < 0)
        return [];

    let indices = [];
    let choice = [];

    while(indices.length < nChoices){
        console.log("Random guess");
        
        let randomIndex = Math.floor(Math.random() * array.length);

        if(indices.indexOf(randomIndex) !== -1)
            continue;

        indices.push(randomIndex);
        choice.push(array[randomIndex]);
    }

    return choice;
}


generateResistor(5);