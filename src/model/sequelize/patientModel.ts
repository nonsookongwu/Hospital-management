import { DataTypes, Model } from "sequelize";
import db from "../databaseConfig/database.config";
import { v4 as uuidv4 } from "uuid";

export interface PatientAtrributes {
  patientId: string;
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
  doctorId: string;
}

export class PatientInstance extends Model<PatientAtrributes> {}

PatientInstance.init(
  {
    patientId: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    hospitalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genotype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bloodPressure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    HIV_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hepatitis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "patientRecord",
  }
);

