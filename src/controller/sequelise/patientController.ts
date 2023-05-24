import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PatientInstance } from "../model/patientModel";
import {createPatientSchema, errorOptions, updatePatientSchema} from "../utils/utils"


//this endpoint creates patients
export const RegisterPatient = async (req: Request|any, res: Response) => {
    try {
      const verified = req.user;
      console.log(`req.doctor is ${req.user}`);
      /**
       * verified returns a doctorID from the auth which inturn comes from the database comparison
       */
      console.log(`verified is ${verified}`);
      // if (!verified) {
      //   res.redirect('/dashboard')
      // }

      const id = uuidv4();
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
      } = req.body;

      //validate with joi
      const validatePatient = createPatientSchema.validate(
        req.body,
        errorOptions
      );
      // console.log(validateDoctor);
console.log(`validatePatient is ${validatePatient}`)
      //handle error from validation
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
        });
      }
      console.log("about to create new patient");
      const newPatient = await PatientInstance.create({
        patientId: id,
        ...req.body,
        doctorId: verified.doctorId,
      });
      console.log(newPatient);
      //validate patients

      if (newPatient) {
        return res.redirect("/dashboard");
      }

      // if (newPatient) {
      //   return res.status(201).json({
      //     msg: "You have successfully created a patient",
      //     newPatient,
      //   });
      // }
    } catch (error) {
      console.log(error);
    }
};


//this endpoint gets all patients
export const getPatient = async (req: Request, res: Response) => {
  
  
    /**
     * sequelize, find all or find and count all
  mongoose, find

   const getAllPatients = await PatientInstance.findAll();
   return res.status(200).json({
       msg: "you have successfully gotten all the patients",
       getAllPatients
  })
     * 
     * 
     * in sequelise, you can pass limit and offset to any get request we do and we use req.query to limit 
    the number of things we want our user to be seeing at the same time. this is why every get request comes with a limit and offset. Limit and offset only works for find or find all, not create.
    limit asks how many do you want to see?
    offset asks which number do you want to see from. it removes from the top
    limit is shown as /patients/get-patients?limit=3 showOnly is limit
    offet is shown as /patients/get-patients?offset=3 removefrom is offset
     */

  try {
    const limit = req.query?.showOnly as number | undefined;
    const offset = req.query?.removeFrom as number | undefined;

    const getAllPatients = await PatientInstance.findAndCountAll({
      limit: limit,
      offset: offset,
    });
    return res.status(200).json({
      msg: "you have successfully gotten all the patients",
      count: getAllPatients.count,
      patients: getAllPatients.rows,
    });
  } catch (error) {
    console.error(error);
  }
}

// this endpoint updates patient by id
export const updatePatient = async (req: Request, res: Response) => {
    try {

        const patientId = req.params.patientId
      const {
        age,
        weight,
        height,
        bloodPressure,
        HIV_status,
        hepatitis,
      } = req.body;
        
        /** difference between put and patch
         * the difference between put and patch is that patch is updating some part of your payload while put is 
         * updating every part of your payload. If you use patch, you want to update some part, with put, you are updating everything
         */

      //validate with joi
      //never make the update validation to be required
      const validatePatient = updatePatientSchema.validate(
        req.body,
        errorOptions
      );
      // console.log(validateDoctor);

      //handle error from validation
      if (validatePatient.error) {
        return res
          .status(400)
          .json({ Error: validatePatient.error.details[0].message });
      }
        
        //we ll be using request params which will look like /patient/updatepatient/{id}
        const updateDoctor = await PatientInstance.findOne({
            where:{patientId}
        })
        
        if (!updateDoctor) {
            return res.status(400).json({
                error: "Cannot find this Patient"
            })
        }

        const updatedRecord = await updateDoctor.update({
          age,
          weight,
          height,
          bloodPressure,
          HIV_status,
          hepatitis,
        });

        return res.status(200).json({
            msg: "Successfully updated your Patient record",
            updatedRecord
        });


    } catch (error) {
        console.error(error);
    }
};


export const deletePatient = async (req: Request, res: Response) => {
    try {

        const id = req.params.patientId

        const patientRecord = await PatientInstance.findOne({
            where:{patientId:id}
        })
        if (!patientRecord) {
            return res.status(400).json({
                 error: "cannot find patient"
             })
        }
        
        const deletedPatient = await patientRecord.destroy()
       //Question // let a = deletedPatient.patientName;

        return res.status(200).json({
          msg: `Successfully deleted patient's record`,
          deletedPatient,
        });

    } catch (error) {
        console.error(error);
    }
};





/** =========================== */



// export const RegisterPatient = async (req: Request | any, res: Response) => {
//   try {
//     const verified = req.doctor;
//     //console.log(verified);
//     /**
//      * verified returns a doctorID from the auth which inturn comes from the database comparison
//      */
//     // if (!verified){
//     //   res.status(400).json({
//     //     error:verified
//     //   })
    
//     const id = uuidv4();
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
//     } = req.body;

//     //validate with joi
//     const validatePatient = createPatientSchema.validate(
//       req.body,
//       errorOptions
//     );
//     // console.log(validateDoctor);

//     //handle error from validation
//     if (validatePatient.error) {
//       return res
//         .status(400)
//         .json({ Error: validatePatient.error.details[0].message });
//     }

//     const newPatient = await PatientInstance.create({
//       patientId: id,
//       ...req.body,
//       doctorId: verified.doctorId,
//     });

//     //validate patients

//     if (newPatient) {
//       return res.status(201).json({
//         msg: "You have successfully created a patient",
//         newPatient,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// //this endpoint gets all patients
// export const getPatient = async (req: Request, res: Response) => {
//   /**
//      * sequelize, find all or find and count all
//   mongoose, find

//    const getAllPatients = await PatientInstance.findAll();
//    return res.status(200).json({
//        msg: "you have successfully gotten all the patients",
//        getAllPatients
//   })
//      * 
//      * 
//      * in sequelise, you can pass limit and offset to any get request we do and we use req.query to limit 
//     the number of things we want our user to be seeing at the same time. this is why every get request comes with a limit and offset. Limit and offset only works for find or find all, not create.
//     limit asks how many do you want to see?
//     offset asks which number do you want to see from. it removes from the top
//     limit is shown as /patients/get-patients?limit=3 showOnly is limit
//     offet is shown as /patients/get-patients?offset=3 removefrom is offset
//      */

//   try {
//     const limit = req.query?.showOnly as number | undefined;
//     const offset = req.query?.removeFrom as number | undefined;

//     const getAllPatients = await PatientInstance.findAndCountAll({
//       limit: limit,
//       offset: offset,
//     });
//     return res.status(200).json({
//       msg: "you have successfully gotten all the patients",
//       count: getAllPatients.count,
//       patients: getAllPatients.rows,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// // this endpoint updates patient by id
// export const updatePatient = async (req: Request, res: Response) => {
//   try {
//     const patientId = req.params.patientId;
//     const { age, weight, height, bloodPressure, HIV_status, hepatitis } =
//       req.body;

//     /** difference between put and patch
//      * the difference between put and patch is that patch is updating some part of your app while put is
//      * updating every part of your payload. If you use patch, you want to update some part, with put, you are updating everything
//      */

//     //validate with joi
//     const validateDoctor = updatePatientSchema.validate(req.body, errorOptions);
//     // console.log(validateDoctor);

//     //handle error from validation
//     if (validateDoctor.error) {
//       return res
//         .status(400)
//         .json({ Error: validateDoctor.error.details[0].message });
//     }

//     //we ll be using request params which will look like /patient/updatepatient/{id}
//     const updateDoctor = await PatientInstance.findOne({
//       where: { patientId },
//     });

//     if (!updateDoctor) {
//       return res.status(400).json({
//         error: "Cannot find this Patient",
//       });
//     }

//     const updatedRecord = await updateDoctor.update({
//       age,
//       weight,
//       height,
//       bloodPressure,
//       HIV_status,
//       hepatitis,
//     });

//     return res.status(200).json({
//       msg: "Successfully updated your Patient record",
//       updatedRecord,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const deletePatient = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.patientId;

//     const patientRecord = await PatientInstance.findOne({
//       where: { patientId: id },
//     });
//     if (!patientRecord) {
//       return res.status(400).json({
//         error: "cannot find patient",
//       });
//     }

//     const deletedPatient = await patientRecord.destroy();
//     //Question // let a = deletedPatient.patientName;

//     return res.status(200).json({
//       msg: `Successfully deleted patient's record`,
//       deletedPatient,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };