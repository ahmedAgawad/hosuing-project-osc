import { Request,Response,NextFunction } from "express";
export const validateCreateListing = (req: Request, res: Response, next: NextFunction) => {
  const { location, price, roomsAvailable, description ,owner } = req.body;
  
  if (!location || price === undefined || roomsAvailable === undefined || !description || !owner )
  {
     res.status(400).json({ message: "location, price, roomsAvailable ,description and owner are required" });
     return;
  }

  if (typeof location !== "string" || location.trim().length < 3)
  {
     res.status(400).json({ message: "The location must be clear text and at least 3 characters long" });
     return;
  }

  if (typeof description !== "string" || description.trim().length < 10)
  {
     res.status(400).json ({ message: "The description must be a detailed text and at least 10 characters long" });
     return;
  }

  if (typeof owner !== "string") 
  {
    res.status(400).json({ message: "owner must be a string" });
    return;
  }

  if (typeof price !== "number" || price <= 0)
  {
     res.status(400).json({ message: "The price must be a positive number greater than 0 " });
     return;
  }

  if (typeof roomsAvailable !== "number" || roomsAvailable <= 0)
  {
     res.status(400).json({ message: "The number of rooms must be a positive number" });
     return;
  }

  next();
};