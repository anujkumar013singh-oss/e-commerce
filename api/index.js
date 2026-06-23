import app, { connectDB } from '../server/app.js';
export default async function handler(req, res) {
  await connectDB();
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  app(req, res);
}
