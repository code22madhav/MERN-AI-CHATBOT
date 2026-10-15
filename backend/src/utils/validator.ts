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

export const OTPEmailValidator=[
    body('otp').notEmpty().trim().isLength({min: 6}).withMessage("OTP Invalid"),
    body('email').notEmpty().trim().isEmail().withMessage("Email is required"),
]
export const verifyEmail=[
    body('email').notEmpty().trim().isEmail().withMessage("Email is required"),
]

//there is one more another way rightnow we are manually running each validation check (treat these 
// validation checks middleware func body() is a middleware func) we are doing it by validation.run
//and the acutal method is defined like this ('signup', validation(), userSignUp)
//but if you want it to be run automatically then you can directly pass the signupValidator chain
//in the post method middleware chain like this ('/signup', signUpValidator, validate, userSignUp)
//this runs the signUpValidator as middleware and runs all the body function automallically and it
//bind the error of each run to the req and then the next middleware is called in the chain 


/*
In short this is how you will write express validator these all files are made to keep the structing good
const { body, validationResult } = require('express-validator');

app.post(
  '/signup',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Min 8 chars'),
    body('age').optional().isInt({ min: 18 }).toInt(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // req.body is now validated and sanitized
    res.sendStatus(201);
  }
);

my understanding:
[] just adding this validation chain automatically validates your req but to catch the error
 in the next middleware you have to do validateResult(req) this will give you error or the 
 result of validation.
 or what you can do you can write the validation body('email').isEmail().nonEmpty().run(req)
 you have to do .run in the last of the validation so that it runs and store the result
 now in this implementation it's made little fancy we have createad a wrapper function 
 which return the result and we do the validation.run in for loop manually

The flow

Validation chains: functions like body('email'), param('id'), query('page'), header(...), cookie(...) 
select a field from a specific part of the request. You chain rules onto them (.isEmail(),
.isLength({ min: 8 }), .notEmpty()). Execution: each chain is itself a middleware. 
When the request hits it, every rule runs and failures are stored on the request object.
Nothing is rejected or thrown at this point.Result collection: in your handler (or a shared middleware) 
you call validationResult(req) to read those stored errors and decide the response.

*/