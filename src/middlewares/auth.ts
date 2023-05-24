import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import  Doctor  from "../model/doctorMongo";
const jwtsecret = process.env.JWT_SECRET as string;



export async function auth(req: Request | any,res: Response, next: NextFunction) {
  try {
    /**
     * the token is saved inside cookies or local storage. for cookies, we use req.cookies.jwt. jwt is added to check if the token is available in the cookies, so we are targetting the jwt key.
     * so, the linke of code is to ask our local storage(or cookies) if it is seeing a token
     */

    const authorization = req.cookies.userToken; //for fetching token from cookies

    if (!authorization) {
      return res.redirect("/login");
      // return res.status(400).json({error: 'invalid Token'})
    }
    //it is either a bearer is used or the token is used.
    /**
     * if the local storage is seeing the token, we want to verify that token because local storage can be edited
     * so, we remove the "bearer " and verify the exact token with jwt that we used to create the token and our jwtsecret in our .env
     */

    // const token = authorization.slice(7, authorization.length); //the authorization header adds the word "bearer" to the token, and that is what we slice off, but the cookie just gives us the token like that

    // let verified = jwt.verify(token, jwtsecret); //local storage
    let verified = jwt.verify(authorization, jwtsecret); //cookies

    //if it is not the user(doctor) that owns the token ...
    if (!verified) {
       return res.redirect("/login");
      //return res.status(400).json({ error: "invalid Token" });
    }

    /** doctorId destructuring
     * We are destructuring the id because while we are creating the token, we used doctorId, so, definintely, doctorId is present in the verified
     */
    const { doctorId} = verified as { [key: string]: string };

    /** find doctor in doctor's database
     * Here, we are finding the doctor by his doctorId.
     * In mongoose, change this or findone. you can either use find by id here(in sequelise which is an ORM) or find one in mongoose(an ODM). it ll work the same way. in mongodb, you do not need "where"
     */
    const doctor = await Doctor.findById({
        _id: doctorId
    });

    if (!doctor) {
       return res.redirect("/login");
      //return res.status(400).json({ error: "invalid Token" });
    }

     req.user = verified;
    res.locals.user = doctor
    //req.user = doctor

    next();
  } catch (error) {
    console.error(error);
     return res.redirect("/login");
    //return res.status(500).json({ error: "internal server error" });
  }
}







//========================== authorization header =============================================================
// export async function auth(req: Request | any, res: Response, next:NextFunction) {
//     try {
//       /**
//        * the token is saved inside cookies or local storage. for cookies, we use req.cookies.jwt. jwt is added to check if the token is available in the cookies, so we are targetting the jwt key.
//        * so, the linke of code is to ask our local storage(or cookies) if it is seeing a token
//        */

//         const authorization = req.headers.authorization; //for fetching token from local storage

//        //const authorization = req.cookies.userToken; //for fetching token from cookies

//       if (!authorization) {
//         return res.status(401).json({
//           error: "Doctor, kindly login as a user",
//         });
//       }
//       //it is either a bearer is used or the token is used.
//       /**
//        * if the local storage is seeing the token, we want to verify that token because local storage can be edited
//        * so, we remove the "bearer " and verify the exact token with jwt that we used to create the token and our jwtsecret in our .env
//        */

//          const token = authorization.slice(7, authorization.length); //the authorization header adds the word "bearer" to the token, and that is what we slice off, but the cookie just gives us the token like that

//         let verified = jwt.verify(token, jwtsecret); //local storage
//     //   let verified = jwt.verify(authorization, jwtsecret); //cookies

//       //if it is not the user(doctor) that owns the token ...
//       if (!verified) {
//         return res.status(401).json({
//           error: "Doctor not verified, cannot access this route",
//         });
//       }

//       /** doctorId destructuring
//        * We are destructuring the id because while we are creating the token, we used doctorId, so, definintely, doctorId is present in the verified
//        */
//       const { doctorId } = verified as { [key: string]: string };

//       /** find doctor in doctor's database
//        * Here, we are finding the doctor by his doctorId.
//        * In mongoose, change this or findone. you can either use find by id here(in sequelise which is an ORM) or find one in mongoose(an ODM). it ll work the same way. in mongodb, you do not need "where"
//        */
//       const doctor = await DoctorInstance.findOne({
//         where: { doctorId },
//       });

//       if (!doctor) {
//         res.status(401).json({
//           Error: "Kindly register as a doctor",
//         });
//       }

//       req.doctor = verified;

//       next();
//     } catch (error) {
//         res.status(401).json({
//             Error: "Doctor not logged in"
//         })
//     }
// }


//============================= cookies ==================================================

// export async function auth(req: Request | any, res: Response, next: NextFunction) {
//   try {
//     /**
//      * the token is saved inside cookies or local storage. for cookies, we use req.cookies.jwt. jwt is added to check if the token is available in the cookies, so we are targetting the jwt key.
//      * so, the linke of code is to ask our local storage(or cookies) if it is seeing a token
//      */

   

//     const authorization = req.cookies.userToken; //for fetching token from cookies

//     if (!authorization) {
//       return res.status(401).json({
//         error: "Doctor, kindly login as a user",
//       });
//     }
//     //it is either a bearer is used or the token is used.
//     /**
//      * if the local storage is seeing the token, we want to verify that token because local storage can be edited
//      * so, we remove the "bearer " and verify the exact token with jwt that we used to create the token and our jwtsecret in our .env
//      */

//     // const token = authorization.slice(7, authorization.length); //the authorization header adds the word "bearer" to the token, and that is what we slice off, but the cookie just gives us the token like that

//     // let verified = jwt.verify(token, jwtsecret); //local storage
//       let verified = jwt.verify(authorization, jwtsecret); //cookies

//     //if it is not the user(doctor) that owns the token ...
//     if (!verified) {
//       return res.status(401).json({
//         error: "Doctor not verified, cannot access this route",
//       });
//     }

//     /** doctorId destructuring
//      * We are destructuring the id because while we are creating the token, we used doctorId, so, definintely, doctorId is present in the verified
//      */
//     const { doctorId } = verified as { [key: string]: string };

//     /** find doctor in doctor's database
//      * Here, we are finding the doctor by his doctorId.
//      * In mongoose, change this or findone. you can either use find by id here(in sequelise which is an ORM) or find one in mongoose(an ODM). it ll work the same way. in mongodb, you do not need "where"
//      */
//     const doctor = await DoctorInstance.findOne({
//       where: { doctorId },
//     });

//     if (!doctor) {
//       res.status(401).json({
//         Error: "Kindly register as a doctor",
//       });
//     }

//     req.doctor = verified;

//     next();
//   } catch (error) {
//     res.status(401).json({
//       Error: "Doctor not logged in",
//     });
//   }
// }



/** authrntication for sequelize ORM====================================
 * export async function auth(req: Request | any,res: Response, next: NextFunction) {
  try {
    /**
     * the token is saved inside cookies or local storage. for cookies, we use req.cookies.jwt. jwt is added to check if the token is available in the cookies, so we are targetting the jwt key.
     * so, the linke of code is to ask our local storage(or cookies) if it is seeing a token
     */

//     const authorization = req.cookies.userToken; //for fetching token from cookies

//     if (!authorization) {
//       return res.redirect("/login");
//     }
//     //it is either a bearer is used or the token is used.
//     /**
//      * if the local storage is seeing the token, we want to verify that token because local storage can be edited
//      * so, we remove the "bearer " and verify the exact token with jwt that we used to create the token and our jwtsecret in our .env
//      */

//     // const token = authorization.slice(7, authorization.length); //the authorization header adds the word "bearer" to the token, and that is what we slice off, but the cookie just gives us the token like that

//     // let verified = jwt.verify(token, jwtsecret); //local storage
//     let verified = jwt.verify(authorization, jwtsecret); //cookies

//     //if it is not the user(doctor) that owns the token ...
//     if (!verified) {
//       return res.redirect("/login");
//     }

//     /** doctorId destructuring
//      * We are destructuring the id because while we are creating the token, we used doctorId, so, definintely, doctorId is present in the verified
//      */
//     const { doctorId } = verified as { [key: string]: string };

//     /** find doctor in doctor's database
//      * Here, we are finding the doctor by his doctorId.
//      * In mongoose, change this or findone. you can either use find by id here(in sequelise which is an ORM) or find one in mongoose(an ODM). it ll work the same way. in mongodb, you do not need "where"
//      */
//     const doctor = await DoctorInstance.findOne({
//       where: { doctorId },
//     });

//     if (!doctor) {
//       return res.redirect("/login");
//     }

//     req.user = verified;
//     res.locals.user = doctor

//     next();
//   } catch (error) {
//     console.error(error);
//     return res.redirect("/login");
//   }
// }
 //*