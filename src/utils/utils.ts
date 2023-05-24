import Joi from "joi";

export const registerDoctorSchema = Joi.object().keys({
  doctorName: Joi.string().trim().lowercase().required(),
  email: Joi.string().trim().lowercase().required(),
  specialization: Joi.string().trim().lowercase().required(),
  gender: Joi.string().trim().lowercase().required(),
  phone: Joi.number().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{4,30}$/)
    .required(),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Password")
    .messages({ "any.only": "{{#label}} does not match with the one you set" }),
  //   confirm_password: Joi.ref("password")
});

export const errorOptions = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const loginDoctorSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{4,30}$/)
    .required(),
});

///validate patient
// export const registerPatientSchema = Joi.object().keys({
//   patientName: Joi.string().trim().lowercase().required(),
//   age:
//   hospitalName,
//   weight,
//   height,
//   bloodGroup,
//   genotype,
//   bloodPressure,
//   HIV_status,
//   hepatitis,
// });

export const createPatientSchema = Joi.object().keys({
  patientName: Joi.string().trim().lowercase().required(),
  age: Joi.number().required(),
  hospitalName: Joi.string().trim().lowercase().required(),
  weight: Joi.string().trim().lowercase().required(),
  height: Joi.string().trim().lowercase().required(),
  bloodGroup: Joi.string().trim().lowercase().required(),
  genotype: Joi.string().trim().lowercase().required(),
  bloodPressure: Joi.string().trim().lowercase().required(),
  HIV_status: Joi.string().trim().lowercase().required(),
  status: Joi.boolean().required(),
  hepatitis: Joi.string().trim().lowercase().required(),
});

export const updatePatientSchema = Joi.object().keys({
  patientName: Joi.string().trim().lowercase(),
  age: Joi.number(),
  hospitalName: Joi.string().trim().lowercase(),
  weight: Joi.string().trim().lowercase(),
  height: Joi.string().trim().lowercase(),
  bloodGroup: Joi.string().trim().lowercase(),
  bloodPressure: Joi.string().trim().lowercase(),
  genotype: Joi.string().trim().lowercase(),
  HIV_status: Joi.string().trim().lowercase(),
  status: Joi.boolean(),
  hepatitis: Joi.string().trim().lowercase(),
});

