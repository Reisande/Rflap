import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as child_process from 'child_process';
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/api', (req, res) => {
    const json = JSON.stringify(req.body);
    child_process.exec(`cargo run` /*${json}`*/, {cwd: '..'}, (error, stdout, stderr) => {
        if (error) res.status(500).send(stderr);
        res.status(200).send(stdout);
    });
})

app.listen(8000, () => console.log('App Running'));