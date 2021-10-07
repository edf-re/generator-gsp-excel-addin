const fs = require('fs');
const path = require('path');

 const buildTarget = process.argv.slice(2)[0];

 function copyAuthConfig(target = buildTarget){
    const validTargets = ['production', 'staging', 'development', 'remote', 'local'];

    if (!target) {
        throw new Error('Target must be specified');
    }

    if(!validTargets.some(value => value === target)) {
        const valid = validTargets.join(", ");
        throw new Error(`Target must contain one of these values: [${valid}]\nInstead contained "${target}"`);
    }

    const targetFile = path.join(__dirname, `./src/taskpane/auth-config/auth-config.${target}.ts`);
    const locationFile = path.join(__dirname, './src/taskpane/auth-config/auth-config.ts');

    console.log(`${targetFile} -> ${locationFile}`);
    fs.copyFileSync(targetFile, locationFile);
 }

 copyAuthConfig();
