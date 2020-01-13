import * as express from 'express';
import * as bodyParser from 'body-parser';
// open with node_modules/.bin/nodemon --exec node_modules/.bin/ts-node src/server.ts 

import * as cors from 'cors';
import * as child_process from 'child_process';
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/api', (req, res) => {
    const json = JSON.stringify(req.body);
    child_process.exec(`echo '${json}' | cargo run `, {cwd: '..'}, (error, stdout, stderr) => {
        if (error) res.status(500).send(stderr);
        else res.status(200).send(stdout);
    });
})

app.listen(8080, () => console.log('App Running'));