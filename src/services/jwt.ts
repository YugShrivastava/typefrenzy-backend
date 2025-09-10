import jwt from "jsonwebtoken";
import config from "../config/config.js"

const secret: string = config.JWT_SECRET;

const createToken = (user: any) => {
    delete user.password;
    delete user.salt;

    const payload = { ...user };

    console.log(payload);

    return jwt.sign(payload, secret);
}

const validateToken = (token: string) => {
    return jwt.verify(token, secret, (err, user) => {
        if (err) return {user: false};
        return user;
    });
}

export {
    createToken,
    validateToken
}