import express,{Request, Response} from 'express';
import {
     RegisterPatient,
    getPatient, updatePatient, deletePatient
} from '../controller/patientController';
import { auth } from '../middlewares/auth';
const router = express.Router();


/**========================for ejs==================== */
router.get("/get-patients", auth, getPatient);

  router.post("/create-patient", auth, RegisterPatient);
router.patch("/update-patient/:patientId", auth, updatePatient);
router.delete("/delete-patient/:patientId", auth, deletePatient);

export default router;



/* POST create a patient. */
// router.get("/get-patients", auth, getPatient);
// router.post('/create-patient', auth, RegisterPatient);
// router.patch("/update-patient/:patientId", auth, updatePatient);
// router.delete("/delete-patient/:patientId", auth, deletePatient);

// export default router;


