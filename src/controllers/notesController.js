import { Note } from "../models/note.js";
import createHttpError from "http-errors";

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const skip = (page - 1) * perPage;
    const userId = req.user._id;

    const filter = { userId };

    if (tag) filter.tag = tag;
    if (search) filter.$text = { $search: search };

    const [notes, totalNotes] = await Promise.all([
      Note.find(filter)
        .skip(skip)
        .limit(Number(perPage))
        .sort({ createdAt: -1 }),
      Note.countDocuments(filter),
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

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const newNote = await Note.create({ ...req.body, userId });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const updated = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const deleted = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!deleted) {
      throw createHttpError(404, "Note not found");
    }


    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
};
