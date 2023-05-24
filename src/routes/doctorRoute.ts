import express from "express";
import {
  registerDoctor,
  // getDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getDoctorAndPatient,
  LoginDoctor,
  logOut,
} from "../controller/mongoDoctorController";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", LoginDoctor);
// router.get("/get/:doctorId", getDoctor);
// router.get("/getdoctors", getAllDoctors);
// router.patch("/update/:doctorId", updateDoctor);
router.get("/delete/:doctorId", deleteDoctor);
router.get('/getdoctors-patient/', getDoctorAndPatient)
router.get("/logout", logOut);

export default router

// router.post("/register", registerDoctor);
// router.post("/login", LoginDoctor);
// router.get("/get/:doctorId", getDoctor);
// // router.get("/getdoctors", getAllDoctors);
// router.patch("/update/:doctorId", updateDoctor);
// router.delete("/delete/:doctorId", deleteDoctor);
// router.get("/getdoctors-patient/", getDoctorAndPatient);
// router.get("/logout", logOut);
 