
import { findbyEmail } from "../Repository/UserRepo.js";
import { verifyToken } from "../Utils/jwt.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];

        if(!token){
            return res.status(401).json({
                message: "No token provided"
            });
        }
        // Verify token

        const response = verifyToken(token);

        if(!response){
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const doesUserExist = await findbyEmail(response.email);

        if(!doesUserExist){
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        req.user = response;
        next();

    } catch (error) {
        console.error("authMiddleware Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}