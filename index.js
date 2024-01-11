const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const database = [];

app.post('/updateData', (req, res) => {
    const { placeId, jobId, playersCount } = req.body;
    const existingDataIndex = database.findIndex(data => data.placeId === placeId && data.jobId === jobId);

    if (existingDataIndex === -1) {
        const gameInfo = { placeId, jobId, playersCount };
        database.push(gameInfo);
        res.send('Data inserted successfully');
    } else {;
    }
});

app.post('/removeData', (req, res) => {
    const { placeId, jobId } = req.body;
    const dataIndexToRemove = database.findIndex(data => data.placeId === placeId && data.jobId === jobId);

    if (dataIndexToRemove !== -1) {
        database.splice(dataIndexToRemove, 1);
        res.send('Data removed successfully');
    } else {
        res.send('Data not found in the database');
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
