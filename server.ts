import express from 'express';
import router from './routes/routers';
import { errorMiddleware, responseMiddleware } from './middleware';

const app = express();
const port = 8080;

app.use(express.json());
app.use(responseMiddleware);
app.use(router);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
