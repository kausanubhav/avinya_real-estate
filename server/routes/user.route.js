import express from "express";
import { deleteUser, getUserListings, updateUser,getUser } from "../controllers/User.js";
import {verifyUser} from "../libs/verifyUser.js"
const router=express.Router()

router.post('/update/:id',verifyUser,updateUser)
router.delete('/delete/:id',verifyUser,deleteUser)
router.get('/listings/:id',verifyUser,getUserListings)
router.get("/:id", verifyUser, getUser)

export default router