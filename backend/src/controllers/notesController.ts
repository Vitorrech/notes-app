import { Request, Response } from "express";
import { AppError } from "../middlewares/AppError";
import { notesService } from "../services/notesService";

function readId(request: Request) {
  const { id } = request.params;

  if (typeof id !== "string" || !id) {
    throw new AppError("Note id is required.");
  }

  return id;
}

export const notesController = {
  async list(request: Request, response: Response) {
    const search = typeof request.query.search === "string" ? request.query.search : undefined;
    const notes = await notesService.list(search);

    return response.json(notes);
  },

  async create(request: Request, response: Response) {
    const note = await notesService.create(request.body);

    return response.status(201).json(note);
  },

  async update(request: Request, response: Response) {
    const note = await notesService.update(readId(request), request.body);

    return response.json(note);
  },

  async toggleFavorite(request: Request, response: Response) {
    const note = await notesService.toggleFavorite(readId(request));

    return response.json(note);
  },

  async delete(request: Request, response: Response) {
    await notesService.delete(readId(request));

    return response.status(204).send();
  }
};
