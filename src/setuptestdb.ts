import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";


let mongo: MongoMemoryServer | null = null;
export const connectDB = async (): Promise<void> => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  });
};

export const dropDB = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

export const dropCollections = async (): Promise<void> => {
  if (mongo) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
};