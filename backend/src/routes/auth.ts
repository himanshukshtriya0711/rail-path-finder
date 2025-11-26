import express from 'express';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/hash';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt';
import RefreshToken from '../models/RefreshToken';
import { z } from 'zod';

const router = express.Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/signup', async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    const existing = await User.findOne({ email: data.email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await hashPassword(data.password);
    const created = await User.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashed,
    });
    const user = { id: created._id, name: created.name, email: created.email, role: created.role };

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  // persist refresh token
  await RefreshToken.create({ token: refreshToken, user: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

  return res.status(201).json({ user, accessToken, refreshToken });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid input', errors: err.errors });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
  const user = await User.findOne({ email: data.email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await comparePassword(data.password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

  const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
  return res.json({ user: safeUser, accessToken, refreshToken });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid input', errors: err.errors });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });
  try {
  const payload: any = verifyToken(refreshToken);
  // ensure token exists in DB
  const stored = await RefreshToken.findOne({ token: refreshToken, user: payload.userId });
  if (!stored) return res.status(401).json({ message: 'Invalid refresh token' });

  const accessToken = signAccessToken({ userId: payload.userId });
  const newRefresh = signRefreshToken({ userId: payload.userId });

  // replace token in DB
  stored.token = newRefresh;
  stored.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await stored.save();

  return res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.get('/me', async (req: any, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing authorization header' });
  const parts = (authHeader as string).split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid authorization header' });
  try {
    const payload: any = verifyToken(parts[1]);
    const user = await User.findById(payload.userId).select('name email role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Logout (invalidate refresh token)
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });
  try {
    await RefreshToken.deleteOne({ token: refreshToken });
    return res.json({ loggedOut: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
