import express, { Router } from 'express';
import fetch from 'node-fetch';
import { CONFIG } from '../config.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const router = Router();
const AUTHORIZED_ORIGIN = process.env.ENV === 'dev' ? 'http://localhost:3000' : 'https://blindtest-hero.vercel.app';

router.use((_, res, next) => {
  res.append('Access-Control-Allow-Origin', AUTHORIZED_ORIGIN);
  next();
});

router.get('/chart/track/:index', getChartTrackByIndex);

app.use('/', router); 

app.listen(CONFIG.port, () => {
  console.log(`Example app listening on port ${CONFIG.port}`);
});

async function getChartTrackByIndex(req, res) {
  const searchParams = new URLSearchParams({
    limit: '2', // 2 for API returns one less track than the given limit
    index: req.params.index.toString(),
  });

  const response = await fetch(CONFIG.deezerApiUri + '/chart' + '?' + searchParams.toString());
  const data = await response.json();

  res.send(data.tracks.data[0]);
}
