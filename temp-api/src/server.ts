import express, {Request, Response} from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as child_process from 'child_process';
import * as path from 'path';
import morgan from 'morgan';

const app: express.Application = express();

const automata_exec = process.env.NODE_ENV === 'production' ? 'automata' : 'cargo run';

app.set('port', process.env.PORT || 8080);

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.resolve('../front/build')));

app.post('/api', (req: Request, res: Response) => {
    const json = JSON.stringify(req.body, null);
    console.log(json);
    console.log(automata_exec);
    child_process.exec(`echo '${json}' | ${automata_exec} automata`, {cwd: '..'}, (error, stdout, stderr) => {
        if (error) res.status(500).send(stderr);
        else res.status(200).send(stdout);
    });
})

app.post('/cfg', (req: Request, res: Response) => {
    const json = JSON.stringify(req.body, null);
    console.log(json);
    console.log(automata_exec);
    child_process.exec(`echo '${json}' | ${automata_exec} cfg`, {cwd: '..'}, (error, stdout, stderr) => {
        if (error) res.status(500).send(stderr);
        else res.status(200).send(stdout);
    });
})

app.post('/generate-tests', (req: Request, res: Response) => {
    const json = JSON.stringify(req.body, null);
    child_process.exec(`echo '${json}' | cargo run tests`, {cwd: '..'}, (error, stdout, stderr) => {
        if (error) res.status(500).send(stderr);
        else res.status(200).send(stdout);
    });
})

app.listen(app.get('port'), () => console.log(`App listening on port ${app.get('port')}`));
