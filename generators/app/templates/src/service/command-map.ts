export const commandMap = {
    // map your commands here!
}

export const commandMapper = async (commandName, context) => {
    if (typeof commandMap[commandName] === 'function') {
        await commandMap[commandName](context);
    } else {
        Promise.reject(`No command found at '${commandName}'.`);
    }
}