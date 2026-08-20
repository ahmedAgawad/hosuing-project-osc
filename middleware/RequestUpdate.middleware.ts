import { Request, Response, NextFunction } from 'express';
export const validateRequestUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  if (!status)
  {
    res.status(400).json({ message: "status is required" });
    return;
  }
  if (typeof status !== "string")
  {
    res.status(400).json({ message: "status must be a string" });
    return;
  }
  if (status !== 'accepted' && status !== 'declined')
  {
    res.status(400).json({ message: "status must be either accepted or declined" });
    return;
  }

  next();
};
