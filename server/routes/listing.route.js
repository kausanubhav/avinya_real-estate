
import express from "express"
import { createListing, deleteListing,getListings, getListing, updateListing } from "../controllers/Listing.js"
import { verifyUser } from "../libs/verifyUser.js"

const router=express.Router()
router.post("/create",verifyUser,createListing)
router.delete("/delete/:id",verifyUser,deleteListing)
router.post("/update/:id",verifyUser,updateListing)
router.get("/get/:id",getListing)
router.get('/get',getListings)
export default router