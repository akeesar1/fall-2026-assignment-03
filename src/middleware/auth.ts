import { Request, Response, NextFunction } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // TODO: Student implementation - Part 1: Authentication Middleware
  // Store the authenticated userId on res.locals.userId
  const userIdHeader = req.header('X-User-Id');
  const userId = Number(userIdHeader);

  if (!userIdHeader || !Number.isInteger(userId) || userId <= 0) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.locals.userId = userId;
  next();
}

export default authMiddleware;
