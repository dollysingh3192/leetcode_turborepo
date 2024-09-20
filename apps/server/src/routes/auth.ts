import express, { json } from "express";
import prisma from '../prisma';  // Import the Prisma singleton instance
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../types/types";
import { secret } from "../constants";

const auth = express.Router();

auth.post("/signin", async (req, res) => {
    const { password, email } = req.body;

    //Find the user in the database
    const data = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!data) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: data.id }, secret);

    res.status(200).json({ token, user: { username: data.username, email: data.email } });
});

auth.post("/signup", async (req, res) => {
    const { email, password, username } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Create a new user in the database
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username
            }
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default auth;