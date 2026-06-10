import cors from 'cors';
import express from 'express';
import generatePageRouter from './routes/generatePage.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'plantplanet-page-generator',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', generatePageRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  response.status(500).json({ message });
});

app.listen(port, () => {
  console.log(`PlantPlanet backend listening on http://localhost:${port}`);
});
