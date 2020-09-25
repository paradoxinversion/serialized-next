/**
 * This file contains various helper functions for interacting with the database
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Genre } from "../models";

const connection = {};

/**
 * Creates a connection to the database
 * @returns The mongoose database connection
 */
export async function connectToDatabase() {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    connection.isConnected = db.connections[0].readyState;
    // Get or Create the default Administrator
    // Role 9 is the special default admin role
    let [admin] = await User.find({ role: 9 });
    if (!admin) {
      // NOTE: The default admin isn't meant to be used for browsing or posting serials
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        parseInt(process.env.SALT)
      );
      admin = new User({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
        birthDate: 1 / 1 / 1900,
        role: 9,
      });

      const tg = new Genre({
        name: "Test Genre",
        description: "A test genre.",
      });
      await tg.save();
      await admin.save();
    }

    // We'll return the db if it's successful.
    return db;
  } catch (e) {
    switch (e.name) {
      // Some very simple error handling-- Here we're just checking if the server can't be found
      case "MongooseServerSelectionError":
        console.log(
          "DB Connection to the DB failed-- double check DATABASE_URI and ensure remote or local database is reachable"
        );
        throw e;

      default:
        console.log(
          "Something went wrong while trying to connect to the database."
        );
        throw e;
    }
  }
}
