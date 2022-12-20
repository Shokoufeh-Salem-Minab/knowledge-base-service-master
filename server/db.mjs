import fs from "fs";
import path from "path";
import {config} from "./config.mjs";

const getKnowledgeBase = () => {
    const dataFolder = path.resolve(process.cwd(), 'data');
    const dbPath = path.resolve(process.cwd(), config.database);
    let json = null;
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
    }
    if (fs.existsSync(dbPath)) {
        json = fs.readFileSync(dbPath, 'utf8');
    }
    return json ? JSON.parse(json) : [];
};
const saveKnowledgeBase = (db) => {
    fs.writeFileSync(path.resolve(process.cwd(), config.database), JSON.stringify(db), 'utf8');
};

export {getKnowledgeBase, saveKnowledgeBase};
