import * as db from './db.mjs'
import url from "url";
import {config} from "./config.mjs";

const routeGetNames = (request, response) => {
    const entries = db.getKnowledgeBase();
    const query = url.parse(request.url, true).query;

    let matchedNames = [];
    if (query.q) {
        // get list of names, starts with provided letter
        const testName = new RegExp(query.q, 'i');
        const filteredNames = entries.filter(entry => testName.test(entry.name));

        // sort list by trust level
        matchedNames = filteredNames.sort((entryA, entryB) => entryB.trust - entryA.trust);
    } else if (query.all) {
        matchedNames = entries.sort((entryA, entryB) => entryA.name.localeCompare(entryB.name));
    }

    // return list of names
    response.write(JSON.stringify(matchedNames));
};

const routeUpdateName = (request, response) => {
    const entries = db.getKnowledgeBase();
    const query = url.parse(request.url, true).query;
    const selectedName = query.name ? query.name.trim() : null;
    const declinedName = query.declined ? query.declined.trim() : null;
    const messages = [];

    if (selectedName) {
        let exists = false;
        const startsWith = declinedName ? new RegExp(`^${declinedName}`, 'i') : null;
        for (let i = entries.length - 1; i >= 0; i--) {//backward loop, for safe elements removing
            const entry = entries[i];
            if (entry.name === selectedName) {
                // if name exists update the trust level of the name using formula TrustLevel = Pk previous  + (1 - Pk previous) * Pk new
                const newTrustLevel = entry.trust + (1 - entry.trust) * config.trustLevelStep;
                messages.push(`${entry.name}: trust level increased from ${entry.trust} to ${newTrustLevel}`);
                entry.trust = newTrustLevel;
                exists = true;
            } else if (declinedName && startsWith.test(entry.name)) {
                //if db name starts with selectedName, but was not chosen, decrease it value
                const newTrustLevel = entry.trust - entry.trust * config.trustLevelStep;
                if (newTrustLevel < config.trustLevelThreshold) {
                    messages.push(`${entry.name}: removed, because it trust level decreased bellow ${config.trustLevelThreshold} to ${newTrustLevel}. `);
                    entries.splice(i, 1);
                } else {
                    messages.push(`${entry.name}: trust level decreased from ${entry.trust} to ${newTrustLevel}`);
                    entry.trust = newTrustLevel;
                }
            }
        }
        if (!exists) {
            const entry = {name: selectedName, trust: config.defaultTrustLevel};
            entries.push(entry);
            messages.push(`Added new name ${selectedName} with trust level ${entry.trust}`);
        }

        if (!messages.length) {
            messages.push('Please provide name to update');
        }

        // saving db
        db.saveKnowledgeBase(entries);
    }
    console.log(messages.join("\n"));
    response.write(JSON.stringify({message: messages.join('<br>')}));
};


export {routeGetNames, routeUpdateName}
