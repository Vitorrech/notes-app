import { Router } from "express";
import { notesController } from "../controllers/notesController";

export const notesRoutes = Router();

notesRoutes.get("/", notesController.list);
notesRoutes.post("/", notesController.create);
notesRoutes.put("/:id", notesController.update);
notesRoutes.patch("/:id/favorite", notesController.toggleFavorite);
notesRoutes.delete("/:id", notesController.delete);
