import mongoose, {Model} from "mongoose";
import { connectDB, dropDB, dropCollections } from "./setuptestdb";
import Patient, { IPatient, IPatientModel } from "./model/patientMongo";


beforeAll(async () => {
  await connectDB();
});
afterAll(async () => {
  await dropDB();
});
afterEach(async () => {
  await dropCollections();
});

describe("Patient Model", () => {
  it("should create a patient successfully", async () => {
    let validPatient = {
      patientName: "patientDummy",
      age: 50,
      hospitalName: "hospital",
      weight: "weight",
      height: "dummyheight",
      bloodGroup: "dummy",
      genotype: "dummy genotype",
      bloodPressure: "dummy genotype",
      HIV_status: "dummy genotype",
      hepatitis: "dummy genotype",
      status: true,
      doctorId: new mongoose.Types.ObjectId(),
    };
    const newpatient = new Patient(validPatient);
    await newpatient.save();
    expect(newpatient._id).toBeDefined();
    expect(newpatient.age).toBe(validPatient.age);
    expect(newpatient.hospitalName).toBe(validPatient.hospitalName);
    expect(newpatient.weight).toBe(validPatient.weight);
    expect(newpatient.height).toBe(validPatient.height);
    expect(newpatient.bloodGroup).toBe(validPatient.bloodGroup);
    expect(newpatient.bloodPressure).toBe(validPatient.bloodPressure);
    expect(newpatient.HIV_status).toBe(validPatient.HIV_status);
    expect(newpatient.hepatitis).toBe(validPatient.hepatitis);
    expect(newpatient.status).toBe(validPatient.status);
    expect(newpatient.doctorId).toBe(validPatient.doctorId);
  });
    
    
    
 it("should fail for patients without required fields", async () => {
   let invalidPatient = {
     patientName: "patientDummy",
     age: 50,
     hospitalName: "hospital",
     weight: "weight",
     height: "dummyheight",
     bloodGroup: "dummy",
     genotype: "dummy genotype",
     bloodPressure: "dummy genotype",
     HIV_status: "dummy genotype",
     hepatitis: "dummy genotype",
   };
   try {
     const newPatient = new Patient(invalidPatient);
     await newPatient.save();
   } catch (error:any) {
     expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
       expect(error).toBeDefined();
       
   }
 });
    
    
 it("should fail for patients with fields of wrong type", async () => {
      let invalidPatient = {
        patientName: "patientDummy",
        age: "50",
        hospitalName: "hospital",
        weight: "weight",
        height: "dummyheight",
        bloodGroup: "dummy",
        genotype: "dummy genotype",
        bloodPressure: "dummy genotype",
        HIV_status: "dummy genotype",
        hepatitis: "dummy genotype",
        status: "true",
        doctorId: new mongoose.Types.ObjectId(),
      };
      try {
        const newPatient = new Patient(invalidPatient);
        await newPatient.save();
      } catch (error:any) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(error.errors.status).toBeDefined();
          expect(error.errors.age).toBeDefined();
      }
    });
});


