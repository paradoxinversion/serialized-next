import { Genre } from "../models";
import { connectToDatabase } from "../utils/mongodb";

export const getGenres = async (authorUsername, serialSlug) => {
  try {
    await connectToDatabase();
    const genres = await Genre.find({});
    return genres;
  } catch (e) {
    throw e;
  }
};
