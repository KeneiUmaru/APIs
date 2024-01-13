const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const database = [];

app.post('/updateData', (req, res) => {
    const { placeId, jobId, playersCount } = req.body;
    const existingDataIndex = database.findIndex(data => data.placeId === placeId && data.jobId === jobId && data.serverType);

    if (existingDataIndex === -1) {
        const gameInfo = { placeId, jobId, playersCount };
        database.push(gameInfo);
        res.json(database);
    } else {
        const currentData = database[existingDataIndex];

        if (currentData.playersCount !== playersCount) {
            currentData.playersCount = playersCount;
        }
        res.json(database);
    }
});

app.post('/removeData', (req, res) => {
    const { placeId, jobId } = req.body;
    const dataIndexToRemove = database.findIndex(data => data.placeId === placeId && data.jobId === jobId && data.serverType);

    if (dataIndexToRemove !== -1) {
        database.splice(dataIndexToRemove, 1);
        res.json(database);
    } else {
        res.json(database);
    }
});

app.get('/servers', (req, res) => {
    if (database.length > 0) {
        res.json(database);
    } else {
        res.json(database);
    }
});

app.get('/clearData', (req, res) => {
    database.length = 0;
    res.send('Data cleared successfully');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
