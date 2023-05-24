import express, { NextFunction, Response, Request } from "express";

const router = express.Router();
import { auth } from "../middlewares/auth";
import { v4 as uuidv4 } from "uuid";
import Patient, { IPatientModel} from "../model/patientMongo";
import { createPatientSchema, errorOptions } from "../utils/utils";
import  Doctor, {IDoctorModel}  from "../model/doctorMongo";
import { updatePatient } from "../controller/mongoPatientController";
import { updateDoctor } from "../controller/mongoDoctorController";

//pages
/**
 * all ejs pages are a GET request
 */

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("Home");
});

router.get("/register", (req: Request, res: Response, next: NextFunction) => {
  res.render("register");
});

router.get("/login", (req: Request, res: Response, next: NextFunction) => {
  res.render("login");
});

//display page
router.get(
  "/dashboard",
  auth,
  async (req: Request | any, res: Response, next: NextFunction) => {
    // res.render("profile");
    try {
      
      const { doctorId } = req.user;


    const doctor = await Doctor.find();
      //console.log(`doctor is ${doctor}`);
      const totalPatient = await Patient.find();

    const patient = await Patient.find({doctorId});
      
      //console.log(`number of patient is ${patient.length}`);

      // const doctor = (await Doctor.findById({
      //   _id: doctorId,
      // })) as unknown as any;

      // const patient = (await Patient.find({
      //   doctorId: doctor._id,
      // })) as unknown as { [key: string]: string };;

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
        let attended = 0
        let waiting = 0
        for (let index = 0; index < patient.length; index++) {
          const element = patient[index];

          if (element.status) {
            attended++;
          } else {
            waiting++;
          }
          
        }


        return res.render("profile", {
          doctor: res.locals.user,
          patients: patient,
          patientCount: patient.length,
          doctorCount: doctor.length,
          count: getDoctorAndPatients,
          attended,
          waiting,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

// router.get("/dashboard", auth, async (req: Request | any, res: Response, next: NextFunction) => {
//   try {
      
//       const { doctorId } = req.user;
      
//       const { patientRecord } = (await DoctorInstance.findOne({
//         where: { doctorId },
        
//         include: [{ model: PatientInstance, as: "patientRecord" }],

//       })) as unknown as any;

      
//       res.render("patients", { patients: patientRecord });

//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

//endpoint to get all doctors
router.get("/doctor/getdoctors", auth, async (req: Request, res: Response) => {
  try {
    const getAllDoctor = await Doctor.find();

    console.log(`All the doctors are ${getAllDoctor}`);
    // console.log(getAllDoctor)

    return res.render("doctors", {
      //msg: "you have successfully gotten all the Doctors",
      count: getAllDoctor.length,
      Doctors: getAllDoctor
    });
  } catch (error) {
    console.error(error);
  }
});


//endpoint to get all patients
router.get("/patient/getpatients", auth, async (req: Request, res: Response, next: NextFunction) => {

  const patients = await Patient.find()
  console.log(`patients => ${patients}`);

  if (patients) {
    return res.render("patients", {
      patients,
    });
  }
  
  
});

router.get(
  "/edit-profile",
  (req: Request, res: Response, next: NextFunction) => {
    res.render("edit-doctor");
  }
);

router.get("/add-doctor", (req: Request, res: Response, next: NextFunction) => {
  res.render("add-doctor");
});

router.get(
  "/patient/registerpatient",
  (req: Request, res: Response, next: NextFunction) => {
    res.render("add-patient");
  }
);
router.post("/update/:doctorId", updateDoctor);

router.get(
  "/edit-doctor/:doctorId",
  async(req: Request, res: Response, next: NextFunction) => {
    const doctorId = req.params.doctorId;
    const doctor = await Doctor.findById(doctorId);
    
    res.render("edit-doctor", {
      doctor
   
    });
  }
);

//update patients
router.post("/edit/:patientId", auth, updatePatient);
router.get(
  "/edit-patient/:patientId",
 async (req: Request, res: Response, next: NextFunction) => {
    const patientId = req.params.patientId
    const patient = await Patient.findById(patientId);
   res.render("edit-patient", {
     patient
   });
  }
);

// router.get('/patients/add-patients', auth, (req: Request | any, res: Response) => {
//   res.render('add-patient')
//  })

//create patient
// router.post("/add-patient", auth, async (req: Request | any, res: Response) => {
//   try {
//     const verified = req.doctor;
//     //console.log(verified);
//     /**
//      * verified returns a doctorID from the auth which inturn comes from the database comparison
//      */
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
//       return res.render("/add-patient", {
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
//       });
//     }

//     const newPatient = await PatientInstance.create({
//       patientId: id,
//       ...req.body,
//       doctorId: verified.doctorId,
//     });

//     //validate patients

//     if (newPatient) {
//       return res.redirect("/dashboard");
//     }

//     // if (newPatient) {
//     //   return res.status(201).json({
//     //     msg: "You have successfully created a patient",
//     //     newPatient,
//     //   });
//     // }
//   } catch (error) {
//     console.error(error);
//   }
// });

export default router;
