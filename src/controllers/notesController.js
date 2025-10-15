import { Note } from "../models/note.js";
import createHttpError from "http-errors";
//

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;


    const filter = {};
    if (tag) filter.tag = tag;
    if (search) filter.$text = { $search: search };

    const totalNotes = await Note.countDocuments(filter);
    const totalPages = Math.ceil(totalNotes / perPage);

    const notes = await Note.find(filter)
      .skip((page - 1) * perPage)
      .limit(Number(perPage))
      .sort({ createdAt: -1 });

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
    const note = await Note.findById(noteId);

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
    const newNote = await Note.create(req.body);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};


export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deleted = await Note.findByIdAndDelete(noteId);

    if (!deleted) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json({ message: "Note deleted", note: deleted });
  } catch (error) {
    next(error);
  }
};


export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const updated = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
    });

    if (!updated) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
