import mongoose, { Model } from "mongoose";
import { connectDB, dropDB, dropCollections } from "./setuptestdb";
import Doctor from "./model/doctorMongo";

beforeAll(async () => {
  await connectDB();
});
afterAll(async () => {
  await dropDB();
});
afterEach(async () => {
  await dropCollections();
});

describe("Doctor Model", () => {
  it("should create a Doctor successfully", async () => {
    let validDoctor= {
      doctorName: "doctorDummy",
       email: "dummy@user.com",
      specialization: "doctorSpecialization",
        gender: "dummyUser",
        phone: "student",
        password: "********",
    };
    const newDoctor = new Doctor(validDoctor);
    await newDoctor.save();
    expect(newDoctor._id).toBeDefined();
    expect(newDoctor.doctorName).toBe(validDoctor.doctorName);
    expect(newDoctor.email).toBe(validDoctor.email);
    expect(newDoctor.specialization).toBe(validDoctor.specialization);
    expect(newDoctor.gender).toBe(validDoctor.gender);
    expect(newDoctor.phone).toBe(validDoctor.phone);
    expect(newDoctor.password).toBe(validDoctor.password);
    
  });

  it("should fail for doctors without required fields", async () => {
    let invalidDoctor = {
      doctorName: "doctorDummy",
      email: "dummy@user.com",
      specialization: "doctorSpecialization",
      password: "********",
    };
    try {
      const newDoctor = new Doctor(invalidDoctor);
      await newDoctor.save();
    } catch (error: any) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error).toBeDefined();
      
    }
  });

  it("should fail for patients with fields of wrong type", async () => {
    let invalidDoctor = {
      doctorName: "doctorDummy",
      email: "dummy@user.com",
      specialization: "doctorSpecialization",
      gender: "dummyUser",
      phone: 09088667766,
      password: "********",
    };
    try {
      const newDoctor = new Doctor(invalidDoctor);
      await newDoctor.save();
    } catch (error: any) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.phone).toBeDefined();
      
    }
  });
});
