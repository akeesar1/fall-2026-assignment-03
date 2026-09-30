import { Router, Request, Response } from 'express';
import { getAllUsers, getUserById, createUser } from '../dal/users.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// TODO: Student implementation - Part 1: User Routes
// GET /users
// GET /users/:id
// POST /users

router.get('/', async (_req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json(users);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await getUserById(id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json(user);
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    name.trim() === '' ||
    email.trim() === ''
  ) {
    res.status(400).json({ error: 'Invalid user data' });
    return;
  }

  const user = await createUser({
    name,
    email,
  });

  res.status(201).json(user);
});

export default router;
