import { Request, Response, NextFunction } from "express"
import { body, ValidationChain, validationResult } from "express-validator"

//this return's a middleware (req,res,next)=>{}
export const validation=(validations: ValidationChain[])=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        //we are running each validation check manually and the job of validate.run is to validate and
        //store any error in the res if there is any error also we are breaking the validation
        //as soon as we find any issue
        for(let validation of validations){
            const result= await validation.run(req);
            if(!result.isEmpty()){
                break
            }
        }
        //here comes the actual check validationResult collect all the errors which were added in req by
        //validation.run() if no errors are found then next is called 
        const errors=validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        return res.status(422).json({errors: errors.array()});
    }
}

export const loginValidator=[
    body('email').notEmpty().trim().isEmail().withMessage("Email is required"),
    body('password').notEmpty().trim().isLength({min: 6}).withMessage("Password must be minimun 6 charactersd"),
]

export const signUpValidator=[
    body('name').notEmpty().withMessage("Name is required"),
    ...loginValidator,
]

export const verifyEmailValidator=[
    body('otp').notEmpty().trim().isLength({min: 6}).withMessage("OTP Invalid"),
    body('email').notEmpty().trim().isEmail().withMessage("Email is required"),
]

//there is one more another way rightnow we are manually running each validation check (treat these 
// validation checks middleware func body() is a middleware func) we are doing it by validation.run
//and the acutal method is defined like this ('signup', validation(), userSignUp)
//but if you want it to be run automatically then you can directly pass the signupValidator chain
//in the post method middleware chain like this ('/signup', signUpValidator, validate, userSignUp)
//this runs the signUpValidator as middleware and runs all the body function automallically and it
//bind the error of each run to the req and then the next middleware is called in the chain 