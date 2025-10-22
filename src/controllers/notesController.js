import { Note } from "../models/note.js";
export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const skip = (page - 1) * perPage;

    
    const query = Note.find();

    if (tag) query.where("tag").equals(tag);
    if (search) query.where({ $text: { $search: search } });


    const [notes, totalNotes] = await Promise.all([
      query
        .skip(skip)
        .limit(Number(perPage))
        .sort({ createdAt: -1 }),
      Note.countDocuments(query.getFilter()),
    ]);

    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};
