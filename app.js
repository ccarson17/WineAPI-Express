import {} from 'dotenv/config';
import express from 'express';
import chalk from 'chalk'; // change color of text in logs
import Debug from 'debug'; // provides ability to show/suppress logging
import morgan from 'morgan'; // logs what is served by the application (for debugging)
import mongoose from 'mongoose'; // model based MongoDB framework
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import bottleRouter from './routes/bottleRouter.js';
import rackRouter from './routes/rackRouter.js';
import userRouter from './routes/userRouter.js';

const swaggerDocument = JSON.parse(
  await readFile(
    new URL('./swagger.json', import.meta.url)
  )
);
const app = express();
const PORT = process.env.PORT || 3000;
const debug = Debug('wineapi-express');

if (process.env.ENV === 'Test') {
  debug('This is the test db');
  const db = mongoose.connect(process.env.MONGO_DB_TEST_CONNECTION);
} else {
  debug('This is the real db');
  const db = mongoose.connect(process.env.MONGO_DB_CONNECTION);
}

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/bottle/', bottleRouter);
app.use('/api/v1/rack/', rackRouter);
app.use('/api/v1/user/', userRouter);
app.use('/help', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.server = app.listen(PORT, () => {
  debug(`listening on port ${chalk.green(PORT)}`);
});

export default app;
