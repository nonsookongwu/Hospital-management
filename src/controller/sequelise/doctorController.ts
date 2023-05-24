import { Request, Response } from "express";
import { DoctorInstance } from "../model/doctorModel";
import { v4 as uuidv4 } from "uuid";
import {
  registerDoctorSchema,
  errorOptions,
  loginDoctorSchema,
} from "../utils/utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PatientInstance } from "../model/patientModel";

const jwtsecret = process.env.JWT_SECRET as string;

//import { options } from "joi";

//endpoint to create a doctor================== for normal doctor APIs===========================
export const RegisterDoctor = async (req: Request, res: Response) => {
  //return res.status(200).json("respond with a hello");

  try {
    //req.body is like a form
    const {
      doctorName,
      email,
      specialization,
      gender,
      phone,
      password,
      confirm_password,
    } = req.body;
    const idFromUuid = uuidv4();
    //validate with joi
    const validateDoctor = registerDoctorSchema.validate(
      req.body,
      errorOptions
    );
    // console.log(validateDoctor);

    if (validateDoctor.error) {
      return res
        .status(400)
        .json({ Error: validateDoctor.error.details[0].message });
    }
    //Hash Password with bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);
    //generate salt: because you need to verify or identify the user with salt
    //create user: check if user is existing in the database and you check by email
    const userEmail = await DoctorInstance.findOne({
      where: { email: email },
    });
    const userPhone = await DoctorInstance.findOne({
      where: {phone:phone}
    })

    if (!userEmail && !userPhone) {
      let newDoctor = await DoctorInstance.create({
        doctorId: idFromUuid,
        doctorName,
        email,
        specialization,
        gender,
        phone,
        password: hashedPassword,
      });

      /** generate Token for the user
       *  find user
       * extract id
       * use ID to generate token
       */
      const doctor = (await DoctorInstance.findOne({
        where: { email: email },
      })) as unknown as { [key: string]: string };

      const { doctorId } = doctor;

      const userToken = jwt.sign({ doctorId }, jwtsecret, {
        expiresIn: "30mins",
      });

      /**
       * if we want to use cookies
       */
       //res.cookie('userToken', userToken, {httpOnly: true, maxAge:30 * 60 * 1000})
      /**jwt Expiry
       * d = day
       * mins = minutes
       *
       */

      //the goal of userToken
      //otp

      //email token
      return res.status(201).json({
        msg: "User created successfully",
        newDoctor,
        userToken,
      });
    }
    if (userEmail) {
        return res.status(409).json({
          error: "This doctor's email already exists in the database",

        });
    }

    if (userPhone) {
      return res.status(409).json({
        error: "This doctor's phone number already exists in the database",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// //endpoint for the doctors to login
// export const LoginDoctor = async (req: Request, res: Response) => {
//   try {
//     //req.body is like a form
//     const { email, password } = req.body;

//     //validate with joi
//     const validateDoctor = loginDoctorSchema.validate(req.body, errorOptions);
//     // console.log(validateDoctor);

//     //handle error from validation
//     if (validateDoctor.error) {
//       return res
//         .status(400)
//         .json({ Error: validateDoctor.error.details[0].message });
//     }

//     /** generate Token for the user
//      *  find user
//      * extract id
//      * use ID to generate token
//      */

//     //look at the database to confirm the passwords
//     const doctor = (await DoctorInstance.findOne({
//       where: { email: email },
//     })) as unknown as { [key: string]: string }; //turns the value to string so as to use in jwtsecret(stringify)

//     //object destructuring to equal assign the doctor.doctorID to the doctorId from req.body
//     const { doctorId } = doctor;

//     //use doctorID to generate token using jwt
//     const userToken = jwt.sign({ doctorId }, jwtsecret, {
//       expiresIn: "30mins",
//     });

//    // res.cookie('userToken', userToken, {httpOnly: true, maxAge:30 * 60 * 1000})

//     //compare the passwords from the req.body and from the database(doctor.password)
//     const validDoctor = await bcrypt.compare(password, doctor.password);

//     //if the passwords are valid and invalid(error handling)
//     if (validDoctor) {
//       let name = doctor.doctorName.split(" ");
//       return res.status(201).json({
//         msg: `Welcome Dr ${name[name.length - 1]}`,
//         doctor,
//         userToken,
//       });
//     }

//     return res.status(400).json({
//       Error: "invalid Email or password",
//     });
//   }
//    catch (error) {
//       console.error(error);
//       res.status(500).json({Error: "Internal server error"})
//   }
// };

// //endpoint to get the doctors and the patients they created
// export const getDoctorAndPatient = async(req:Request, res:Response) => {

//   try {

//     const getAllDoctor = await DoctorInstance.findAndCountAll({
//       include: [
//         {
//           model: PatientInstance,
//           as: "patientRecord",
//         },
//       ],
//     });

//     return res.status(200).json({
//       msg: "you have successfully gotten all the Doctors",
//       count: getAllDoctor.count,
//       Doctors: getAllDoctor.rows,
//     });

//   } catch (error) {
//     console.error(error);
//   }
// }

/**==================for EJS stuff================================== */

export const RegisterDoctor2 = async (req: Request, res: Response) => {
  //return res.status(200).json("respond with a hello");

  try {
    //req.body is like a form
    const {
      doctorName,
      email,
      specialization,
      gender,
      phone,
      password,
      confirm_password,
    } = req.body;
    const idFromUuid = uuidv4();
    //validate with joi
    const validateDoctor = registerDoctorSchema.validate(
      req.body,
      errorOptions
    );
    // console.log(validateDoctor);

    if (validateDoctor.error) {
      return res.render("register", {
        error: validateDoctor.error.details[0].message,
        doctorName,
        email,
        specialization,
        gender,
        phone,
        password,
        confirm_password,
      });
    }
    //Hash Password with bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);
    //generate salt: because you need to verify or identify the user with salt
    //create user: check if user is existing in the database and you check by email
    const userEmail = await DoctorInstance.findOne({
      where: { email: email },
    });
    const userPhone = await DoctorInstance.findOne({
      where: { phone: phone },
    });

    if (!userEmail && !userPhone) {
      let newDoctor = await DoctorInstance.create({
        doctorId: idFromUuid,
        doctorName,
        email,
        specialization,
        gender,
        phone,
        password: hashedPassword,
      });

      /** generate Token for the user
       *  find user
       * extract id
       * use ID to generate token
       */
      const doctor = (await DoctorInstance.findOne({
        where: { email: email },
      })) as unknown as { [key: string]: string };

      const { doctorId } = doctor;

      const userToken = jwt.sign({ doctorId }, jwtsecret, {
        expiresIn: "30mins",
      });

      /**
       * if we want to use cookies
       */
      // return res.cookie('userToken', userToken, {httpOnly: true, maxAge:30 * 60 * 1000})
      /**jwt Expiry
       * d = day
       * mins = minutes
       *
       */

      //the goal of userToken
      //otp

      return res.redirect("/login");
    }
    if (userEmail) {
      return res.render("register", {
        error: "This doctor's email already exists in the database",
        doctorName,
        email,
        specialization,
        gender,
        phone,
        password,
        confirm_password,
      });
    }

    if (userPhone) {
      return res.render("register", {
        Error: "This doctor's phone number already exists in the database",
        doctorName,
        email,
        specialization,
        gender,
        phone,
        password,
        confirm_password,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//endpoint for the doctors to login
export const LoginDoctor = async (req: Request, res: Response) => {
  try {
    //req.body is like a form
    const { email, password } = req.body;

    //validate with joi
    const validateDoctor = loginDoctorSchema.validate(req.body, errorOptions);
    // console.log(validateDoctor);

    //handle error from validation
    if (validateDoctor.error) {
      return res.render("login", {
        error: validateDoctor.error.details[0].message,
        email,
        password,
      });
    }

    /** generate Token for the user
     *  find user
     * extract id
     * use ID to generate token
     */

    //look at the database to confirm the passwords
    const doctor = (await DoctorInstance.findOne({
      where: { email: email },
    })) as unknown as { [key: string]: string }; //turns the value to string so as to use in jwtsecret(stringify)

    if (!doctor) {
      return res.render("login", {
        Error: "invalid Email or password",
        email,
        password,
      });
    }

    //object destructuring to equal assign the doctor.doctorID to the doctorId from req.body
    const { doctorId } = doctor;

    //use doctorID to generate token using jwt
    const userToken = jwt.sign({ doctorId }, jwtsecret, {
      expiresIn: "30mins",
    });

    res.cookie("userToken", userToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    //compare the passwords from the req.body and from the database(doctor.password)
    const validDoctor = await bcrypt.compare(password, doctor.password);

    //if the passwords are valid and invalid(error handling)
    if (validDoctor) {
      // let name = doctor.doctorName.split(" ");
      return res.redirect("/dashboard");
    }

    return res.render("login", {
      error: "invalid Email or password",
      email,
      password,
    });
  } catch (error) {
    console.error(error);
    //return res.render("/login");
    res.status(500).json({ Error: "Internal server error" });
  }
};

//endpoint to get the doctors and the patients they created
// export const getDoctorAndPatient = async (req: Request, res: Response) => {
//   try {
//     const getAllDoctor = await DoctorInstance.findAndCountAll({
//       include: [
//         {
//           model: PatientInstance,
//           as: "patientRecord",
//         },
//       ],
//     });

//     return res.status(200).json({
//       msg: "you have successfully gotten all the Doctors",
//       count: getAllDoctor.count,
//       Doctors: getAllDoctor.rows,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

export const logOut = async (req: Request, res: Response) => {
  
  res.clearCookie("userToken");
  res.redirect("/login");
};
