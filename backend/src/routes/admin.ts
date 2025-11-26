import express from 'express';
import User from '../models/User';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

// GET /users - list users (admin only)
router.get('/users', requireAdmin, async (req: any, res) => {
  try {
    const { page = '1', limit = '50', q = '' } = req.query as any;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(200, parseInt(limit, 10) || 50);

    const filter: any = {};
    if (q && typeof q === 'string') {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .lean();

    return res.json({ users, total, page: p, limit: l });
  } catch (err) {
    console.error('admin/users error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /users/:id/role - update a user's role (admin only)
router.post('/users/:id/role', requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body as { role?: string };
    if (!role || !['USER', 'ADMIN'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role as any;
    await user.save();

    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('admin/set-role error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
