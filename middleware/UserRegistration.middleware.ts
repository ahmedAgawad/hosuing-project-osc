import { Request, Response, NextFunction } from 'express';
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password || !role)
  {
    res.status(400).json({ message:"fullName, email, password and role are required" });
    return;
  }
  if (typeof fullName !=="string")
  {
     res.status(400).json({ message:"fullName must be a string" });
     return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
     res.status(400).json({ message: "The email format is incorrect" });
     return;
  }
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
     res.status(400).json({ 
      message: "Password is weak! It should be at least 8 characters long and contain at least one letter and one number" 
    });
    return;
  }
  if (role !== 'Lister' && role !== 'Seeker') 
  {
     res.status(400).json({ message: " Role must be either Lister or Seeker only" });
     return;
  }

  next();
};
