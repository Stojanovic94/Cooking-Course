const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/rezervacija', (req, res) => {
    fs.readFile('rezervacija.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.send(JSON.parse(data));
    });
});

app.post('/rezervacija', (req, res) => {
    fs.readFile('rezervacija.json', 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            fs.writeFile('rezervacija.json', JSON.stringify([req.body], null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error writing file');
                }
                res.send('Rezervacija je uspešno dodata!');
            });
        } else if (err) {
            return res.status(500).send('Error reading file');
        } else {
            const rezervacije = JSON.parse(data);
            rezervacije.push(req.body);
            fs.writeFile('rezervacija.json', JSON.stringify(rezervacije, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error writing file');
                }
                res.send('Rezervacija je uspešno dodata!');
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
