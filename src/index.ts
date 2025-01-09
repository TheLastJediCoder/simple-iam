import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

process.on('SIGTERM', async () => {
  process.exit(0);
});

process.on('SIGINT', async () => {
  process.exit(0);
});

app.listen(PORT, async () => {
  console.log(`Simple IAM running on port ${PORT}`);
});
