import { Request, Response } from "express";
import { Listing } from "../models/listing.model";


// Create a listing
export const createListing = async (req: Request, res: Response) => {
  try {

    const { location, price, roomsAvailable ,description} = req.body
    const owner = req.user?.id

    if (!location || !price || !roomsAvailable || !owner || !description) {
      return res.status(400).json({ 
        message: "All fields are required" 
    });
    }

    if(price <= 0 ){
        return res.status(400).json({
            message : "Price must be a positive number"
        })
    }

    const listing = await Listing.create({ 
        location,
        price,
        roomsAvailable, 
        description,
        owner 
    });

    res.status(201).json(listing)

  } catch (error) {

    res.status(500).json({
        message: "Failed to create listing",
        error 
    })
  }
}

// Search and filter listings
export const getListings = async (req: Request, res: Response) => {
  try {
    const { location, minPrice, maxPrice, roomsAvailable } = req.query

    const query: any = {}

    if (location) {
      query.location = location
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (roomsAvailable) {
      query.roomsAvailable = Number(roomsAvailable)
    }

    const listings = await Listing.find(query).populate("owner", "fullName email")

    res.status(200).json(listings)

  } catch (error) {
    res.status(500).json({ 
        message: "Failed to fetch listings",
        error })
  }
}

// Search a specific listing
export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const listing = await Listing.findById(id).populate("owner", "fullName email")

    if (!listing) {
      return res.status(404).json({ 
        message: "Listing not found"
     })
    }

    res.status(200).json(listing)

  } catch (error) {
    res.status(500).json({ 
        message: "Failed to fetch listing", 
        error
    })
  }
};

// Update listing
export const updateListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)

    if (!listing) {
       return res.status(404).json({ 
        message: "Listing not found" 
    }) 
    }

    if (listing.owner.toString() !== req.user?.id) {
      return res.status(403).json({ 
        message: "You can only edit your own listings"
    })
    }

    const { location, price, roomsAvailable, description } = req.body

    if (price <= 0 && price !== undefined) {
        return res.status(400).json({
            message: "price must be a positive number" 
        })
    }

    if (location) listing.location = location
    if (price) listing.price = price
    if (roomsAvailable) listing.roomsAvailable = roomsAvailable
    if (description) listing.description = description

    await listing.save()

    res.status(200).json(listing)

  } catch (error) {

    res.status(500).json({
        message: "Failed to update listing",
         error
    })
  }
}

// Delete 
export const deleteListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ 
        message: "Listing not found"
    })
    }

    if (listing.owner.toString() !== req.user?.id){
      return res.status(403).json({
        message: "You can only delete your own listings"
    })
    }

    await listing.deleteOne();

    res.status(200).json({ 
        message: "Listing deleted successfully"
    })

  } catch (error) {
    res.status(500).json({ 
        message: "Failed to delete listing",
        error })
  }
}