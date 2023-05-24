import mongoose, {Document, Schema} from 'mongoose'

export interface IDoctor {
 // _id: mongoose.Types.ObjectId,
  doctorName: string;
  email: string;
  specialization: string;
  gender: string;
  phone: string;
  password: string;
}

export interface IDoctorModel extends IDoctor, Document { }

const DoctorSchema: Schema = new Schema(
  {
    doctorName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    
  },
  {
    timestamps: true,
    versionKey: false,
    strictPopulate: false,
  }
);

export default mongoose.model<IDoctorModel>('Doctor', DoctorSchema)
