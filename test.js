import fsPromise from 'node:fs/promises';


// ---
// from "io.js"
export async function loadJson(path) {
    const file = await fsPromise.readFile(path, 'utf8');
    return JSON.parse(file);
}

export async function saveJson(path, content) {
    let value = content;
    if (typeof content !== "string")
        value = JSON.stringify(content, null, 2);
    await fsPromise.writeFile(path, value);
}
// ---

export function json(data, title = "") {
    console.log(`\n${title}\n`);
    console.log(JSON.stringify(data, null, 2));
    console.log('\n');
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    // ReGeX flag i : /.../i case-insensitive
    // ([a-f\d]{2}) -> find a value a to d including digits two times
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
    return result ? [
        parseInt(result[1], 16), // r
        parseInt(result[2], 16), // g
        parseInt(result[3], 16)   // b
    ] : null;
}

const pathManifest = "./manifest.json";
const pathTheme = "./theme-hex.json";
export async function updateColors() {
    let oldData = await loadJson(pathManifest);
    const newData = await loadJson(pathTheme);

    // get the new rgb values from the hex data
    let nData = {};
    for (let [key, value] of Object.entries(newData)) {
        nData[key] = hexToRgb(value);
    }

    // assign and save it
    oldData.theme.colors = nData;
    await saveJson(pathManifest, oldData);
}

updateColors();