const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const database = [];

app.post('/updateData', (req, res) => {
    const { placeId, jobId, playersCount } = req.body;

    const gameInfo = { placeId, jobId, playersCount };
    database.push(gameInfo);

    res.send('Data inserted successfully');
    console.log("data is recived")
});

app.get('/servers', (req, res) => {
    res.json(database);
    console.log("data is sent")
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
