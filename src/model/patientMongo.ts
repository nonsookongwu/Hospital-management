import mongoose, { Document, Schema } from "mongoose";

export interface IPatient{

  patientName: string;
  age: number;
  hospitalName: string;
  weight: string;
  height: string;
  bloodGroup: string;
  genotype: string;
  bloodPressure: string;
  HIV_status: string;
  hepatitis: string;
  status:Boolean,
  doctorId: string;
}

export interface IPatientModel extends IPatient, Document {}

const PatientSchema: Schema = new Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    genotype: {
      type: String,
      required: true,
    },
    bloodPressure: {
      type: String,
      required: true,
    },
    HIV_status: {
      type: String,
      required: true,
    },
    hepatitis: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strictPopulate: false,
  }
);

export default mongoose.model<IPatientModel>('Patient', PatientSchema);