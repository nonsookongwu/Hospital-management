/** model
 *
 * model is how we want the incoming data to be saved inside of our database
 */

import { DataTypes, Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import db from "../databaseConfig/database.config";
import { PatientInstance } from "./patientModel";

export interface DoctorAttributes {
  doctorId: string;
  doctorName: string;
  email: string;
  specialization: string;
  gender: string;
  phone: string;
  password: string;
}

export class DoctorInstance extends Model<DoctorAttributes> {}

DoctorInstance.init(
  {
    doctorId: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "doctor",
  }
);

DoctorInstance.hasMany(PatientInstance, {
  foreignKey: "doctorId",
  as: "patientRecord",
});
PatientInstance.belongsTo(DoctorInstance, {
  foreignKey: "doctorId",
  as: "doctor"
})
