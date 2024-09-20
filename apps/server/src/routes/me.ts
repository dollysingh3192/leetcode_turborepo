import express, { json } from "express";
import auth from "../middlewares/auth";
import prisma from '../prisma';  // Import the Prisma singleton instance

const me = express.Router();

me.get("/me", auth, async (req, res) => {
    const userId = req.userId.id;

    //find the user in the database
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if(!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.send({
        username: user.username
    })
})

export default me;
