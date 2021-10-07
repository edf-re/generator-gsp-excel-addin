/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

const fs = require('fs');

function copySettings(target){
    const validTargets = ['production', 'staging', 'development', 'remote', 'local'];

    if (!target) {
        throw new Error('Target must be specified');
    }

    if(!validTargets.some(value => value === target)) {
        const valid = validTargets.join(", ");
        throw new Error(`Target must contain one of these values: [${valid}]\nInstead contained "${target}"`);
    }

    const targetFile = `./settings-data.${target}.ts`;
    const locationFile = './src/taskpane/Logic/settings-data.ts';

    console.log(`${targetFile} -> ${locationFile}`);
    fs.copyFileSync(targetFile, locationFile);
}

module.exports = copySettings;