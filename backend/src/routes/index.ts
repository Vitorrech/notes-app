import { Router } from "express";
import { notesRoutes } from "./notesRoutes";

export const routes = Router();

routes.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

routes.use("/notes", notesRoutes);
