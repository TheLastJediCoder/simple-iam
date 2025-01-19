import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import { userRouter } from './controllers/user';
import { authRouter } from './controllers/auth';
import { scopeRouter } from './controllers/scope';
import { roleRouter } from './controllers/role';

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health-check', (req, res) => {
  res.send('Simple IAM Health Check');
});

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/scopes', scopeRouter);
app.use('/roles', roleRouter);

process.on('SIGTERM', async () => {
  process.exit(0);
});

process.on('SIGINT', async () => {
  process.exit(0);
});

app.listen(PORT, async () => {
  // await checkDatabaseConnection();
  console.log(`Simple IAM running on port ${PORT}`);
});
