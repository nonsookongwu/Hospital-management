import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Patient from "../model/patientMongo";
import { createPatientSchema, errorOptions, updatePatientSchema } from "../utils/utils";

export const registerPatient = (req: Request | any, res: Response) => {
  try {
    const {doctorId} = req.user;
    const {
      patientName,
      age,
      hospitalName,
      weight,
      height,
      bloodGroup,
      genotype,
      bloodPressure,
      HIV_status,
      hepatitis,
      status
    } = req.body;

    const validatePatient = createPatientSchema.validate(
      req.body,
      errorOptions
    );

      if (validatePatient.error) {
        return res.render("add-patient", {
          error: validatePatient.error.details[0].message,
          patientName,
          age,
          hospitalName,
          weight,
          height,
          bloodGroup,
          genotype,
          bloodPressure,
          HIV_status,
          hepatitis,
          status
        });
      }

    const patient = new Patient({
      _id: new mongoose.Types.ObjectId(),
      patientName,
      age,
      hospitalName,
      weight,
      height,
      bloodGroup,
      genotype,
      bloodPressure,
      HIV_status,
      hepatitis,
      status,
      doctorId: doctorId
    });

    return patient
      .save()
      .then((patient) => res.redirect("/dashboard"))
      .catch((error) =>
        res.render("add-patient", {
          patientName,
          age,
          hospitalName,
          weight,
          height,
          bloodGroup,
          genotype,
          bloodPressure,
          HIV_status,
          hepatitis,
          status,
        })
      );
  } catch (error) {
    console.error(error)
    res.render("add-patient");
  }
};




export const getPatient = (req: Request, res: Response) => {
  try {
    
    const patientId = req.params.patientId;

    return Patient.findById({_id:patientId})
      .then((patient) =>
        patient
          ? res.status(200).json({ msg: patient })
          : res.status(404).json({ error: "not found" })
      )
      .catch((error) => res.status(500).json({ error: error }));
  } catch (error) {
    console.error(error);
  }
};




// export const getAllPatients = (req: Request, res: Response) => {
//   try {
//     // const limit = req.query?.showOnly as number | undefined;

//     return Patient.find().limit(5)
//       .then((patients) => res.status(200).json({ msg: patients }))
//       .catch((error) => res.status(500).json({ error: error }));
//   } catch (error) {
//     console.error(error);
//   }
// };



export const updatePatient = async (req: Request, res: Response) => {
  try {
    
    const patientId = req.params.patientId;
    

    const {
      patientName,
      age,
      hospitalName,
      weight,
      height,
      bloodGroup,
      genotype,
      bloodPressure,
      HIV_status,
      hepatitis,
      status,
    } = req.body;
    
    const validatePatient = updatePatientSchema.validate(
      req.body,
      errorOptions
    );

    if (validatePatient.error) {
      return res.render("edit-patient", {
        error: validatePatient.error.details[0].message,
        patientName,
        age,
        hospitalName,
        weight,
        height,
        bloodGroup,
        genotype,
        bloodPressure,
        HIV_status,
        hepatitis,
        status,
      });

       
    }

    const patient = await Patient.findByIdAndUpdate(patientId, {
      patientName,
      age,
      hospitalName,
      weight,
      height,
      bloodGroup,
      genotype,
      bloodPressure,
      HIV_status,
      hepatitis,
      status,
    }); 

    if (!patient) {
      res.render("edit-patient", {
        patientName,
        age,
        hospitalName,
        weight,
        height,
        bloodGroup,
        genotype,
        bloodPressure,
        HIV_status,
        hepatitis,
        status
      });
    }

    
    return res.redirect("/dashboard");
    
     
  } catch (error) {
    res.status(500).json("internal server error")
  }
  }





export const deletePatient = async(req: Request, res: Response) => {
  try {
    const patientId = req.params.patientId;
 console.log(patientId)
    const patient = await Patient.findByIdAndDelete(patientId)
      // .then((patient) =>
      console.log(`patient is ${patient}`)
      //   patient
      //     ? res.redirect('/dashboard')
      //     : res.status(404).json({ error: "not found" })
      //)
      res.redirect("/dashboard");
      // .catch((error) => res.status(500).json({ error: error }));
  } catch (error) {
    console.error(error);
  }
};










// import { Request, Response, NextFunction } from "express";
// import mongoose from "mongoose";
// import Patient from "../model/patientMongo";
// import {
//   createPatientSchema,
//   errorOptions,
//   updatePatientSchema,
// } from "../utils/utils";

// export const registerPatient = (req: Request | any, res: Response) => {
//   try {
//     const { doctorId } = req.user;
//     const {
//       patientName,
//       age,
//       hospitalName,
//       weight,
//       height,
//       bloodGroup,
//       genotype,
//       bloodPressure,
//       HIV_status,
//       hepatitis,
//       status,
//     } = req.body;

//     const validatePatient = createPatientSchema.validate(
//       req.body,
//       errorOptions
//     );

//     if (validatePatient.error) {
//       return res.render("add-patient", {
//         error: validatePatient.error.details[0].message,
//         patientName,
//         age,
//         hospitalName,
//         weight,
//         height,
//         bloodGroup,
//         genotype,
//         bloodPressure,
//         HIV_status,
//         hepatitis,
//         status,
//       });
//     }

//     const patient = new Patient({
//       _id: new mongoose.Types.ObjectId(),
//       patientName,
//       age,
//       hospitalName,
//       weight,
//       height,
//       bloodGroup,
//       genotype,
//       bloodPressure,
//       HIV_status,
//       hepatitis,
//       status,
//       doctorId: doctorId,
//     });

//     return patient
//       .save()
//       .then((patient) => res.status(201).json({ msg: patient }))
//       .catch((error) => res.status(500).json({ error: error }));
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getPatient = (req: Request, res: Response) => {
//   try {
//     const patientId = req.params.patientId;

//     return Patient.findById({ _id: patientId })
//       .then((patient) =>
//         patient
//           ? res.status(200).json({ msg: patient })
//           : res.status(404).json({ error: "not found" })
//       )
//       .catch((error) => res.status(500).json({ error: error }));
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getAllPatients = (req: Request, res: Response) => {
//   try {
//     // const limit = req.query?.showOnly as number | undefined;

//     return Patient.find()
//       .limit(5)
//       .then((patients) => res.status(200).json({ msg: patients }))
//       .catch((error) => res.status(500).json({ error: error }));
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const updatePatient = (req: Request, res: Response) => {
//   try {
//     const patientId = req.params.patientId;

//     const {
//       patientName,
//       age,
//       hospitalName,
//       weight,
//       height,
//       bloodGroup,
//       genotype,
//       bloodPressure,
//       HIV_status,
//       hepatitis,
//       status,
//     } = req.body;

//     const validatePatient = updatePatientSchema.validate(
//       req.body,
//       errorOptions
//     );

//     if (validatePatient.error) {
//       return res
//         .status(400)
//         .json({ Error: validatePatient.error.details[0].message });
//     }

//     return Patient.findById(patientId).then((patient) => {
//       if (patient) {
//         patient.set(req.body);

//         return patient
//           .save()
//           .then((patient) => res.status(201).json({ msg: patient }))
//           .catch((error) => res.status(500).json({ error: error }));
//       } else {
//         res.status(404).json({ error: "not found" });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const deletePatient = (req: Request, res: Response) => {
//   try {
//     const doctorId = req.params.doctorId;

//     return Patient.findByIdAndDelete(doctorId)
//       .then((patient) =>
//         patient
//           ? res.status(200).json({ msg: "deleted", deleted: patient })
//           : res.status(404).json({ error: "not found" })
//       )
//       .catch((error) => res.status(500).json({ error: error }));
//   } catch (error) {
//     console.error(error);
//   }
// };
