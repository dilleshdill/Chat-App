import jwt from "jsonwebtoken"

// genereate user token
export const generateUserToken = (userId) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET_KEY);
    return token;
}