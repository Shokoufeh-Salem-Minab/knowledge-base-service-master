

# Knowledge Base Test Service

This is test example to show how works Knowledge base. Every time we select name, Knowledge base updates it value, next time suggesting it higher.

## Project structure

|File|  Description|
|--|--|
| server | service that holds knowledge service|
|server/app.mjs| web server entry point|
| server/config.mjs | web server configuration |
| server/routes.mjs | endpoints for web service, main logic is here |
| server/db.mjs | knowledge base persistence |
|server/data/db.json | knowledge base in JSON format|
|client|client side app|
|client/index.html | client entry point |
|client/client.js| client logic|

Web Service implements two endpoints:
* `/names?q=<partial name>` - returns list of names matching query *q* ordered by trust level
* `/update?name=<name to update>` - adds or updates name in knowledge base

## Service logic
Knowledge database parameters defined in `server/config.js`:
* `defaultTrustLevel` - starting trust level for new entries (default 0.5)
* `trustLevelStep` - step trust level increased or decreased (default 0.15)
* `trustLevelThreshold` - minimal level after word will be removed (default 0.1)

Every time we add new word, it appends to database with value `defaultTrustLevel`.  
If word already exists in DB, it trust level **increased** using `trustLevelStep` step. In same time all other names that starts with entered word will be **decreased** using `trustLevelStep` step.
```
Example: 
We have Jim, Jim Beam and Jim The Great. 
We entered *Jim* and choose name Jim Beam, it trust level will be *increased*, 
but names Jim and Jim The Great will be *decreased* 
(because they started with entered name Jim and was declined. 
Service will receive *Jim Beam* as selected option, and *Jim* as declined, 
all names that starts with Jim except selected, will be decreased by trustLevelStep). 
```
Adding new names **won't trigger** other records trust level decrease.


## Interface

Interface consists of two zones. Left one is actual service. It contains input zone, where you can write the name. Every time you enter or delete character, service will suggest best options from knowledge base (on the right will be shown current trust level).  
You can either select name from list or press `Add Name` to add new one. When you select existing name service will **increase** its trust level and **decrease** trust level of other names in the suggestion list. If it is new name, it will be added in DB with **default trust level**, other names trust level won't be changed.    
Every time you update knowledge base on top will be displayed messages for every changed record in DB.  
On the right side we have full DB entries list with its trust level for easier debugging.

## Getting started

To start demo, install Node.js. Then in terminal switch to server folder and start web server
```
cd ./server
node app.mjs
```
Server will be started at http://localhost:3333 . Port can be changed in `server/config.mjs` (if port has been changed, it should be updated in client/client.js as well)  
After server is started open client `client/index.html` in browser.

To stop web server press `CTRL+C` in terminal




