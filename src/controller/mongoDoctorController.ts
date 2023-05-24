import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import Doctor, { IDoctor, IDoctorModel } from "../model/doctorMongo";
import Patient, { IPatientModel } from "../model/patientMongo";
import { errorOptions, loginDoctorSchema, registerDoctorSchema } from "../utils/utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import patientMongo from "../model/patientMongo";

const jwtsecret = process.env.JWT_SECRET as string;

export const registerDoctor = async (req: Request, res: Response) => {
  try {
    const {
      doctorName,
      email,
      specialization,
      gender,
      phone,
      password,
      confirm_password,
    } = req.body;

    const validateDoctor = registerDoctorSchema.validate(
      req.body,
      errorOptions
    );

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const userEmail = await Doctor.find({
      email: email,
    });

    const userPhone = await Doctor.find({
      phone: phone,
    });

    if (!userEmail && !userPhone) {
      const doctor = new Doctor({
        _id: new mongoose.Types.ObjectId(),
        doctorName,
        email,
        specialization,
        gender,
        phone,
        password: hashedPassword,
      });

      return doctor
        .save()
        .then((doctor) => res.redirect("/login"))
        .catch((error) =>
          res.render("register", {
            error: "Internal Server Error",
            doctorName,
            email,
            specialization,
            gender,
            phone,
            password,
            confirm_password,
          })
        );
    }

    if (userEmail) {
      return res.render("register", {
        error: "Doctor exists in the database",
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
    console.error(error);
    return res.render("register", {
      error: "internal server error",
    });
    //return res.status(500).json({ error: error });
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
      // return res.status(400).json({
      //   error: validateDoctor.error.details[0].message,
      // });
    }

    /** generate Token for the user
     *  find user
     * extract id
     * use ID to generate token
     */

    //look at the database to confirm the passwords
    const doctor = (await Doctor.findOne({
      email: email
    })) as unknown as { [key: string]: string }; //turns the value to string so as to use in jwtsecret(stringify)

    if (!doctor) {
      return res.render("login", {
        error: "invalid Email or password",
        email,
        password,
      });
      // return res.status(400).json({
      //   error: "email does not exist",
      // });
    }

    //console.log(doctor);
    //object destructuring to equal assign the doctor.doctorID to the doctorId from req.body
    const { _id } = doctor;

    //use doctorID to generate token using jwt
    const userToken = jwt.sign({ doctorId:_id}, jwtsecret, {
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
      //let name = doctor.doctorName.split(" ");
      return res.redirect("/dashboard");
      // return res.status(200).json({
      //   msg: 'login successful',
      //   doctor,
      //   userToken
      // })
    }
    // return res.status(400).json({
    //   error: "login unsuccessful",
    // });

    return res.render("login", {
      error: "invalid Email or password",
      email,
      password,
    });
  } catch (error) {
    console.error(error);
    return res.render("/login");
    // res.status(500).json({ Error: "Internal server error" });
  }
};







// export const getDoctor = (req: Request, res: Response) => {
//   try {
//     const doctorId = req.params.doctorId;

//     return Doctor.findById(doctorId)
//       .then((doctor) =>
//         doctor
//           ? res.status(200).json({ msg: doctor })
//           : res.status(404).json({ error: "not found" })
//       )
//       .catch((error) => res.status(500).json({ error: error }));
//   } catch (error) {
//     console.error(error);
//   }
// };


export const getAllDoctors = (req: Request, res: Response) => {
  try {
    return Doctor.find()
      .then((doctors) => res.status(200).json({ msg: doctors }))
      .catch((error) => res.status(500).json({ error: error }));
  } catch (error) {
    console.error(error);
  }
};


export const updateDoctor = (req: Request, res: Response) => {
  try {
    const doctorId = req.params.doctorId;

    return Doctor.findById(doctorId).then((doctor) => {
      if (doctor) {
        doctor.set(req.body);

        return doctor
          .save()
          .then((doctor) => res.redirect("/dashboard"))
          .catch((error) => res.status(500).json({ error: error }));
      } else {
        res.status(404).json({ error: "not found" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
export const deleteDoctor = (req: Request, res: Response) => {
  try {
    const doctorId = req.params.doctorId;

    return Doctor.findByIdAndDelete(doctorId)
      .then((doctor) =>
        doctor
          ? res.status(200).json({ msg: "deleted", deleted: doctor })
          : res.status(404).json({ error: "not found" })
      )
      .catch((error) => res.status(500).json({ error: error }));
  } catch (error) {
    console.error(error);
  }
};

export const getDoctorAndPatient = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.find();

    const patient = await Patient.find();
    //const { doctorId } = req.user;


    console.log(doctor);

    // const doctor  = await Doctor.findOne({ doctorId })
    if (doctor) {
      const getDoctorAndPatients = await Promise.all(
        doctor.map(async (doctor: IDoctorModel) => {
          const patients = await Patient.find({ doctorId: doctor._id });
          return {
            doctor: {
              id: doctor._id,
              doctorName: doctor.doctorName,
              email: doctor.email,
              specialization: doctor.specialization,
              gender: doctor.gender,
              phone: doctor.phone,
            },
            Patient: patients.map((patient: IPatientModel) => ({
              patientName: patient.patientName,
              age: patient.age,
              hospitalName: patient.hospitalName,
              weight: patient.weight,
              height: patient.height,
              bloodGroup: patient.bloodGroup,
              genotype: patient.genotype,
              bloodPressure: patient.bloodPressure,
              HIV_status: patient.HIV_status,
              hepatitis: patient.hepatitis,
              patientId: patient._id,
              doctorId: patient.doctorId,
            })),
          };
        })
      );
      return res.status(200).json({
        msg: `Successfully got the patient's and doctor's record`,
        patientCount: patient.length,
        doctorsAndPatients: getDoctorAndPatients,
        doctornum: doctor.length,
        patientnum: patient.length,
      });
    }

    if (!doctor) {
      return res.status(404).json({
        error: "Cannot find doctor",
      });
    }
  
  } catch (error) {
    console.error(error);
  }
};

export const logOut = async (req: Request, res: Response) => {
  res.clearCookie("userToken");
  res.redirect("/login");
};










/**
 * ============for api=============
 * export const registerDoctor = async (req: Request, res: Response) => {
  try {
    const {
      doctorName,
      email,
      specialization,
      gender,
      phone,
      password,
      confirm_password,
    } = req.body;

    const validateDoctor = registerDoctorSchema.validate(
      req.body,
      errorOptions
    );

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const userEmail = await Doctor.findOne({
      email: email,
    });

    const userPhone = await Doctor.findOne({
      phone: phone,
    });

    if (!userEmail && !userPhone) {
      const doctor = new Doctor({
        _id: new mongoose.Types.ObjectId(),
        doctorName,
        email,
        specialization,
        gender,
        phone,
        password: hashedPassword,
      });

      return doctor
        .save()
        .then((doctor) => res.status(201).json({ msg: doctor }))
        .catch((error) => res.status(500).json({ error: error }));
    }

    if (userEmail) {
      return res.status(400).json({
        error: "Doctor exists in the database",
        // doctorName,
        // email,
        // specialization,
        // gender,
        // phone,
        // password,
        // confirm_password,
      });
    }

    if (userPhone) {
      // return res.render("register", {
      //   Error: "This doctor's phone number already exists in the database",
      //   // doctorName,
      //   // email,
      //   // specialization,
      //   // gender,
      //   // phone,
      //   // password,
      //   // confirm_password,
      // });
      return res.status(400).json({
        error: 'phone number is taken'
      })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
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
      // return res.render("login", {
      //   error: validateDoctor.error.details[0].message,
      //   email,
      //   password,
      // });
      return res.status(400).json({
        error: validateDoctor.error.details[0].message,
      });
    }

    /** generate Token for the user
     *  find user
     * extract id
     * use ID to generate token
     */

    //look at the database to confirm the passwords
    // const doctor = (await Doctor.findOne({
    //   email: email
    // })) as unknown as { [key: string]: string }; //turns the value to string so as to use in jwtsecret(stringify)

    // if (!doctor) {
    //   // return res.render("login", {
    //   //   Error: "invalid Email or password",
    //   //   email,
    //   //   password,
    //   // });
    //   return res.status(400).json({
    //     error: "email does not exist",
    //   });
    // }

    // console.log(doctor);
    // //object destructuring to equal assign the doctor.doctorID to the doctorId from req.body
    // const { _id } = doctor;

    // //use doctorID to generate token using jwt
    // const userToken = jwt.sign({ doctorId:_id}, jwtsecret, {
    //   expiresIn: "30mins",
    // });

    // res.cookie("userToken", userToken, {
    //   httpOnly: true,
    //   maxAge: 30 * 60 * 1000,
    // });

    //compare the passwords from the req.body and from the database(doctor.password)
    // const validDoctor = await bcrypt.compare(password, doctor.password);

    //if the passwords are valid and invalid(error handling)
    // if (validDoctor) {
    //   // let name = doctor.doctorName.split(" ");
    //   //return res.redirect("/dashboard");
    //   return res.status(200).json({
    //     msg: 'login successful',
    //     doctor,
    //     userToken
    //   })
    // }
    // return res.status(400).json({
    //   error: "login unsuccessful",
    // });

    // return res.render("login", {
    //   error: "invalid Email or password",
    //   email,
    //   password,
    // });
//   } catch (error) {
//     console.error(error);
//     //return res.render("/login");
//     res.status(500).json({ Error: "Internal server error" });
//   }
// };







// export const getDoctor = (req: Request, res: Response) => {
//   try {
//     const doctorId = req.params.doctorId;

//     return Doctor.findById(doctorId)
//       .then((doctor) =>
//         doctor
//           ? res.status(200).json({ msg: doctor })
//           : res.status(404).json({ error: "not found" })
//       )
//       .catch((error) => res.status(500).json({ error: error }));
//   } catch (error) {
//     console.error(error);
//   }
// };


// export const getAllDoctors = (req: Request, res: Response) => {
//   try {
//     return Doctor.find()
//       .then((doctors) => res.status(200).json({ msg: doctors }))
//       .catch((error) => res.status(500).json({ error: error }));
//   } catch (error) {
//     console.error(error);
//   }
// };


// export const updateDoctor = (req: Request, res: Response) => {
//   try {
//     const doctorId = req.params.doctorId;

//     return Doctor.findById(doctorId).then((doctor) => {
//       if (doctor) {
//         doctor.set(req.body);

//         return doctor
//           .save()
//           .then((doctor) => res.status(201).json({ msg: doctor }))
//           .catch((error) => res.status(500).json({ error: error }));
//       } else {
//         res.status(404).json({ error: "not found" });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// export const deleteDoctor = (req: Request, res: Response) => {
//   try {
//     const doctorId = req.params.doctorId;

//     return Doctor.findByIdAndDelete(doctorId)
//       .then((doctor) =>
//         doctor
//           ? res.status(200).json({ msg: "deleted", deleted: doctor })
//           : res.status(404).json({ error: "not found" })
//       )
//       .catch((error) => res.status(500).json({ error: error }));
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getDoctorAndPatient = async (req: Request, res: Response) => {
//   try {
//     const { doctorId } = req.params;

//     const doctor = await Doctor.find();

//     const patient = await Patient.find();

//     console.log(doctor);

//     // const doctor  = await Doctor.findOne({ doctorId })
//     if (doctor) {
//       const getDoctorAndPatients = await Promise.all(
//         doctor.map(async (doctor: IDoctorModel) => {
//           const patients = await Patient.find({ doctorId: doctor._id });
//           return {
//             doctor: {
//               id: doctor._id,
//               doctorName: doctor.doctorName,
//               email: doctor.email,
//               specialization: doctor.specialization,
//               gender: doctor.gender,
//               phone: doctor.phone,
//             },
//             Patient: patients.map((patient: IPatientModel) => ({
//               patientName: patient.patientName,
//               age: patient.age,
//               hospitalName: patient.hospitalName,
//               weight: patient.weight,
//               height: patient.height,
//               bloodGroup: patient.bloodGroup,
//               genotype: patient.genotype,
//               bloodPressure: patient.bloodPressure,
//               HIV_status: patient.HIV_status,
//               hepatitis: patient.hepatitis,
//               patientId: patient._id,
//               doctorId: patient.doctorId,
//             })),
//           };
//         })
//       );
//       return res.status(200).json({
//         msg: `Successfully got the patient's and doctor's record`,
//         //patientRecord,
//         doctorsAndPatients: getDoctorAndPatients,
//         doctornum: doctor.length,
//         patientnum: patient.length
//       });
//     }

//     if (!doctor) {
//       return res.status(404).json({
//         error: 'Cannot find doctor'
//       })
//     }
//     //const getAllDoctor = await Doctor.find().populate("Patient").exec();

    
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const logOut = async (req: Request, res: Response) => {
//   res.clearCookie("userToken");
//   res.redirect("/login");
// };
//  */

