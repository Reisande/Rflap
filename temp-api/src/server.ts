import express, {Request, Response} from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as child_process from 'child_process';
import * as path from 'path';
import morgan from 'morgan';

const app: express.Application = express();


app.set('port', process.env.PORT || 8080);

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.resolve('../front/build')));

app.post('/api', (req: Request, res: Response) => {
    const json = JSON.stringify(req.body, null);
    child_process.exec(`echo '${json}' | cargo run automata `, {cwd: '..'}, (error, stdout, stderr) => {
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
