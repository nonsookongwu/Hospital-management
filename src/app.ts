import createError from 'http-errors';
import express,{Request, Response, NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import db from './databaseConfig/database.config'
import mongoose from 'mongoose'
import doctorRoutes_mongo from './routes/doctorRoute'
import patientRoutes_mongo from "./routes/patientRoute"

// import patientRouter from './routes/patients';
// import doctorsRouter from './routes/doctors';
import homePage from './routes/page'
import { config } from './databaseConfig/config';
import logging from './utils/logging';



mongoose.connect(config.mongo.url, {retryWrites:true, w: 'majority' })
.then(()=>{console.log("Mongo Database connected successfully");})
  .catch(error => {
    console.log("unable to connect to MongoDb")
    console.log(error);
  })


// db.sync().then(() => {
//   console.log("Database connected successfully")
// }).catch((err) => {
//   console.log(err)
// })

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use("/patient", patientRoutes_mongo);
app.use("/doctor", doctorRoutes_mongo);

// app.use('/patient', patientRouter);
// app.use('/doctor', doctorsRouter);
app.use("/", homePage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: createError.HttpError, req:Request, res:Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
