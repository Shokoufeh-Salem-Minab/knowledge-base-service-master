const config = {
    hostname: '127.0.0.1', // server hostname
    port: 3333, // server port
    database: 'data/db.json', // knowledge base location path relative to /server folder
    defaultTrustLevel: 0.5, // default trust level for new name added to DB
    trustLevelThreshold: 0.1, // trust level threshold below what name will be deleted from DB
    trustLevelStep: 0.15 // trust level increasing or decreasing step when updating knowledge base
}
export {config};
