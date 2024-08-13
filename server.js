import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import logger from 'morgan';
import { connectDb } from './config/index.js';
import router from './routes/index.js';
import { ERROR_MESSAGES } from './constants.js';

const PORT = process.env.PORT || 8080;
const corsOptions = { credentials: false };
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
const server = createServer(app);

connectDb().then(async () => {
	const URL_PREFIX = '/api/v1';
	app.use(`${URL_PREFIX}`, router); 
	app.use('*', (req, res) => {
		console.log('in not found route',res.statusCode);
		return res.status(404).send({
			success: false,
			message: ERROR_MESSAGES.ENDPOINT_NOT_FOUND
		});
	});

	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});

