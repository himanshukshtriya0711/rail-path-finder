import express from 'express';
import { HARD_TRAINS, HardTrain } from '../data/generateTrains';
import { z } from 'zod';

const router = express.Router();

// Simple search schema
const searchSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  date: z.string().optional(),
});

// Flexible matching: supports partial names (e.g. 'delhi' matches 'New Delhi')
const normalizeNoSpace = (s: string) => s.replace(/\s+/g, '');
const matchIndex = (routeLower: string[], q: string) => {
  const qClean = q.toLowerCase();
  const qNoSpace = normalizeNoSpace(qClean);
  return routeLower.findIndex(r => {
    // r is already lowercased by caller
    const rNoSpace = normalizeNoSpace(r);
    // match if the route token (without spaces) includes the query (without spaces)
    if (rNoSpace.includes(qNoSpace)) return true;
    // or if the route includes the query as-is (partial word match)
    if (r.includes(qClean)) return true;
    // or if any token inside the route contains the query (helps with short queries)
    const parts = r.split(' ');
    if (parts.some(p => p.includes(qClean))) return true;
    return false;
  });
};

// GET /search - returns matches from the in-memory HARD_TRAINS dataset
router.get('/search', (req: express.Request, res: express.Response) => {
  try {
    const q = searchSchema.parse(req.query);
    const fromQ = q.from.toLowerCase();
    const toQ = q.to.toLowerCase();

    const matches: HardTrain[] = HARD_TRAINS.filter(t => {
      const routeLower = t.route.map(r => r.toLowerCase());
      const fi = matchIndex(routeLower, fromQ);
      const ti = matchIndex(routeLower, toQ);
      return fi >= 0 && ti >= 0 && fi < ti;
    });

    // If no deterministic matches are found, provide a lightweight synthetic result
    // so the frontend always has something to display during development.
    let results = matches.map(t => ({
      train: { id: t.id, number: t.number, name: t.name },
      departure: t.departure,
      arrival: t.arrival,
      duration: t.duration,
      availableSeats: t.availableSeats,
      fare: t.fare,
      status: t.availableSeats > 20 ? 'available' : t.availableSeats > 0 ? 'rac' : 'waiting',
      route: t.route,
    }));

    if (results.length === 0) {
      // create a simple fallback train using the requested from/to
      const synthId = `synth-${Date.now()}`;
      const fare = 600 + Math.floor(Math.random() * 800);
      const seats = 30 + Math.floor(Math.random() * 70);
      const synth = {
        train: { id: synthId, number: (90000 + Math.floor(Math.random()*1000)).toString(), name: `Demo Express (${q.from} - ${q.to})` },
        departure: '09:00',
        arrival: '13:00',
        duration: '4h 00m',
        availableSeats: seats,
        fare,
        status: seats > 20 ? 'available' : seats > 0 ? 'rac' : 'waiting',
        route: [q.from, q.to],
      };
      results = [synth];
    }

    return res.json({ trains: results });
  } catch (err: any) {
    if (err?.name === 'ZodError') return res.status(400).json({ message: 'Invalid query', errors: err.errors });
    console.error('trains/search error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Optional: return full hard dataset for debugging
router.get('/all', (_req: express.Request, res: express.Response) => {
  const brief = HARD_TRAINS.map(t => ({ id: t.id, number: t.number, name: t.name, route: t.route }));
  return res.json({ count: brief.length, trains: brief });
});

// POST / - add a new train to the in-memory dataset (admin/dev only)
const createSchema = z.object({
  number: z.string().min(1),
  name: z.string().min(1),
  fare: z.number().optional(),
  route: z.array(z.string()).min(2),
  departure: z.string().optional(),
  arrival: z.string().optional(),
  duration: z.string().optional(),
  availableSeats: z.number().optional(),
});

router.post('/', (req: express.Request, res: express.Response) => {
  try {
    const body = createSchema.parse(req.body);
    const id = `ht-${HARD_TRAINS.length + 1}`;
    const newTrain: HardTrain = {
      id,
      number: body.number,
      name: body.name,
      route: body.route,
      fare: body.fare || 500,
      departure: body.departure || '00:00',
      arrival: body.arrival || '00:00',
      duration: body.duration || '0h 00m',
      availableSeats: body.availableSeats ?? 50,
    };
    HARD_TRAINS.push(newTrain);
    return res.status(201).json({ train: newTrain });
  } catch (err: any) {
    if (err?.name === 'ZodError') return res.status(400).json({ message: 'Invalid payload', errors: err.errors });
    console.error('trains/create error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
