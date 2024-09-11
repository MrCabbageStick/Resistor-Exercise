class ResistorData{
    value;
    multiplier;
    tolerance;

    constructor(value, multiplier, tolerance){
        this.value = value;
        this.multiplier = multiplier;
        this.tolerance = tolerance;
    }
}


const resistorColorMap = new Map([
    ["black",   new ResistorData(0,     1,          null)],
    ["brown",   new ResistorData(1,     10,         1   )],
    ["red",     new ResistorData(2,     100,        2   )],
    ["orange",  new ResistorData(3,     1000,       null)],
    ["yellow",  new ResistorData(4,     10000,      null)],
    ["green",   new ResistorData(5,     100000,     0.5 )],
    ["blue",    new ResistorData(6,     1000000,    0.25)],
    ["violet",  new ResistorData(7,     10000000,   0.1 )],
    ["grey",    new ResistorData(8,     null,       0.05)],
    ["white",   new ResistorData(9,     null,       null)],
    ["gold",    new ResistorData(null,  0.1,        5   )],
    ["silver",  new ResistorData(null,  0.01,       10  )],
]);


const resistorColors = Array.from(resistorColorMap.keys());

const valueCodingColors = resistorColors.filter(color => resistorColorMap.get(color).value !== null);
const multiplierCodingColors = resistorColors.filter(color => resistorColorMap.get(color).multiplier !== null);
const toleranceCodingColors = resistorColors.filter(color => resistorColorMap.get(color).tolerance !== null);


const calculateResistorValue = (colors) => {
    if(!(colors instanceof Array) || colors.length < 4 || colors.length > 5)
        return -1;

    const nColorBands = colors.length - 2;

    let value = 0;

    for(let i = 0; i < nColorBands; i++){
        value *= 10;

        let colorValue = resistorColorMap.get(colors[i]).value;

        if(colorValue === null)
            return -1;

        value += colorValue;
    }

    let colorMultiplier = resistorColorMap.get(colors[nColorBands]).multiplier;

    if(colorMultiplier === null)
        return -1;

    value *= colorMultiplier;

    return value;
}