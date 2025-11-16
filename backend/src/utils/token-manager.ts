import jwt from 'jsonwebtoken'

//I'm facing a typescript issue it is saying 3rd parameter should be a type callback but sign expect first 
// value as payload, second string, third as object therefore when setting the expireIn type as string is 
//throwing error therefore to skip that typescript issue i have given any type for now
//it's just a typescript issue no relation with the jwt.sign
export const createToken=(id: string, email: string, expiresIn: any)=>{
    const payload={id, email};
    const token=jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn,
    });
    return token;
}