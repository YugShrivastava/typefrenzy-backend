import type { Request, Response } from "express";
import UserModel from "../models/user.model.js";
import { createToken, validateToken } from "../services/jwt.js";

const handleRegister = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;

        await UserModel.create({ email, username, password });

        return res.status(201).json({
            message: "User created successfully...",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
};

const handleLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const result = await UserModel.matchPassword(username, password);

        if ("error" in result) {
            return res.status(400).json(result); // sends { error: true, message: ... }
        }

        const token: string = createToken(result?.user)
        // const userObj = result.user.toObject();
        // delete userObj.password;
        // delete userObj.salt;

        return res.status(200).json({
            message: "Login successful",
            token: token,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
};

const handleVerification = async (
    req: Request,
    res: Response
) => {
    try {
        const token: string = req.body;

        const user: any = validateToken(token); // make sure this returns null/false if invalid

        if (!user?._id) {
            return res
                .status(401)
                .json({ error: true, message: "Invalid Token" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
    }

};

export { handleRegister, handleLogin, handleVerification };
