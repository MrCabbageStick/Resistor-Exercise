///// DOM elements /////
const resistorElem = document.querySelector("[js-resistor]");
const resistorForm = document.querySelector("[js-resistor-form]");
const resistorGuess = document.querySelector("[js-resistor-guess]");
const infoElem = document.querySelector("[js-info]");


///// Globals /////
let currentResistorValue = null;

const suffixMultiplierMap = new Map([
    ['k', 1000],
    ['K', 1000],
    ['m', 1_000_000],
    ['M', 1_000_000],
    ["g", 1_000_000_000],
    ["G", 1_000_000_000],
]);
const possibleSuffixes = Array.from(suffixMultiplierMap.keys());


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

    return `<div class="resistor__bar resistor__bar--${color}">${color}</div>`
}


function generateResistor(nBands){
    const bars = generateResistorBars(nBands);
    const resistorValue = calculateResistorValue(bars);
    const barsAsHTML = bars.map(bar => getColorBarHTML(bar)).join("");

    resistorElem.innerHTML = barsAsHTML;
    currentResistorValue = resistorValue;
}


const getRandomBarCount = () => 4 + Math.round(Math.random());


///// Event handling /////
resistorForm.addEventListener("submit", e => {
    e.preventDefault();

    let guess = resistorGuess.value;

    if(guess === "")
        return;

    guess = stringToNumber(guess);

    if(!compareFloats(guess, currentResistorValue, 3)){
        infoElem.innerHTML = "WRONG";
        infoElem.classList.add("info--wrong");

        setTimeout(() => infoElem.classList.remove("info--wrong"), 2500);
        return;
    }

    resistorGuess.value = "";

    infoElem.innerHTML = "CORRECT";
    infoElem.classList.add("info--correct");

    setTimeout(() => infoElem.classList.remove("info--correct"), 2500);

    generateResistor(getRandomBarCount());
})


resistorGuess.addEventListener("keydown", checkGuessValue, { capture: true });

function checkGuessValue(e){
    let inputLength = resistorGuess.value.length;

    let lastChar = null;

    if(inputLength > 0)
        lastChar = resistorGuess.value[resistorGuess.value.length - 1];
    
    if(
        e.key === "Backspace" // Allow backspace
        || e.key === "Enter" // Allow Enter
        || e.key === "." // Allow dot
        || e.key.slice(0, 5) === "Arrow"
        || (!isNaN(parseInt(e.key)) && (lastChar === null || !isNaN(parseInt(lastChar) || lastChar === '.'))) // Allow numbers but not after suffix
        || (possibleSuffixes.indexOf(e.key) !== -1 && !isNaN(parseInt(lastChar))) // Allow suffixes but only after numbers
    )
        return;

    // console.log(e.key.slice(0, 5));

    e.preventDefault();

    if(inputLength === 0){
        setTimeout(() => resistorGuess.value = '', 1);
    }
}


///// TOOLS /////
function choice(array, nChoices){
    if(!(array instanceof Array) || array.length < nChoices || nChoices < 0)
        return [];

    let indices = [];
    let choice = [];

    while(indices.length < nChoices){
        let randomIndex = Math.floor(Math.random() * array.length);

        if(indices.indexOf(randomIndex) !== -1)
            continue;

        indices.push(randomIndex);
        choice.push(array[randomIndex]);
    }

    return choice;
}


const stringToNumber = (string) => 
    possibleSuffixes.indexOf(string[string.length - 1]) == -1
    ? parseFloat(string)
    : parseFloat(string.slice(0, -1)) * suffixMultiplierMap.get(string[string.length - 1])


const compareFloats = (float1, float2, precision) => 
    Math.round(float1 * Math.pow(10, precision)) / Math.pow(10, precision) === Math.round(float2 * Math.pow(10, precision)) / Math.pow(10, precision)

generateResistor(getRandomBarCount());