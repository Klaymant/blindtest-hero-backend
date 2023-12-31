import express, { Router } from 'express';
import fetch from 'node-fetch';
import { CONFIG } from '../config.js';
import dotenv from 'dotenv';
import { rateLimitMiddleware } from './middlewares/RateLimiterMiddleware.js';

dotenv.config();

const app = express();
const router = Router();
const AUTHORIZED_ORIGIN = process.env.ENV === 'dev' ? 'http://localhost:3000' : 'https://blindtest-hero.vercel.app';

router.use((_, res, next) => {
  res.append('Access-Control-Allow-Origin', AUTHORIZED_ORIGIN);
  next();
});

router.get('/chart/track/:index', getChartTrackByIndex);
router.get('/chart/tracks/:limit', getChartTracks);

app.use(rateLimitMiddleware);
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

  if (data.error)
    res.status(500).send(data.error.message);
  else if (!data?.tracks?.data?.[0])
    res.status(404).send('No data found');
  else
    res.send(data.tracks.data[0]);
}

async function getChartTracks(req, res) {
  const searchParams = new URLSearchParams({
    limit: String(+req.params.limit + 1),
  });

  const response = await fetch(CONFIG.deezerApiUri + '/chart/0/tracks' + '?' + searchParams.toString());
  const data = await response.json();

  if (data.error)
    res.status(500).send(data.error.message);
  else if (!data?.data)
    res.status(404).send('No data found');
  else
    res.send(data.data);
}
