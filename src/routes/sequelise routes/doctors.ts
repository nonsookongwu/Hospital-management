import express, { Request, Response } from "express";
const router = express.Router();
import {
  RegisterDoctor,
  LoginDoctor,
  //getDoctorAndPatient,
  logOut,
} from "../controller/doctorController";

/* GET users listing. */ 
//router.get("/get-doctors", getDoctorAndPatient);

router.get("/logout", logOut);

router.post('/create-doctor', RegisterDoctor);

router.post("/login", LoginDoctor);

export default router;
