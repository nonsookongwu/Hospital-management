import express from "express";
import {
  registerPatient,
  getPatient,
  //getAllPatients,
  updatePatient,
  deletePatient,
} from "../controller/mongoPatientController";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.post("/registerpatient", auth, registerPatient);
router.get("/get/:patientId", auth, getPatient);
// router.get("/getpatients", auth, getAllPatients);

router.get("/delete/:patientId", auth, deletePatient);


export default router;

// router.patch("/update/:patientId", auth, updatePatient);
// router.delete("/delete/:patientId", auth, deletePatient);
