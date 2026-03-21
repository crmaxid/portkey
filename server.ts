import express from 'express';
import router from './routes/routers';
import { errorMiddleware, responseMiddleware } from './middleware';
import { ENV } from './config/config';

const app = express();
const port = ENV.PORT;

app.use(express.json());
app.use(responseMiddleware);
app.use(router);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
