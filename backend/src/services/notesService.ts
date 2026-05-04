import { Prisma } from "@prisma/client";
import { AppError } from "../middlewares/AppError";
import { prisma } from "../prisma/client";

type CreateNoteInput = {
  title?: string;
  content?: string;
};

type UpdateNoteInput = {
  title?: string;
  content?: string;
};

function normalizeNoteInput(input: CreateNoteInput) {
  const title = input.title?.trim() || "Untitled note";
  const content = input.content ?? "";

  if (title.length > 120) {
    throw new AppError("Title must be 120 characters or less.");
  }

  return { title, content };
}

async function ensureNoteExists(id: string) {
  const note = await prisma.note.findUnique({ where: { id } });

  if (!note) {
    throw new AppError("Note not found.", 404);
  }

  return note;
}

export const notesService = {
  async list(search?: string) {
    const where: Prisma.NoteWhereInput | undefined = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } }
          ]
        }
      : undefined;

    return prisma.note.findMany({
      where,
      orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }]
    });
  },

  async create(input: CreateNoteInput) {
    const data = normalizeNoteInput(input);

    return prisma.note.create({ data });
  },

  async update(id: string, input: UpdateNoteInput) {
    await ensureNoteExists(id);

    const data: UpdateNoteInput = {};

    if (input.title !== undefined) {
      const title = input.title.trim() || "Untitled note";

      if (title.length > 120) {
        throw new AppError("Title must be 120 characters or less.");
      }

      data.title = title;
    }

    if (input.content !== undefined) {
      data.content = input.content;
    }

    if (Object.keys(data).length === 0) {
      throw new AppError("At least one field must be provided.");
    }

    return prisma.note.update({
      where: { id },
      data
    });
  },

  async toggleFavorite(id: string) {
    const note = await ensureNoteExists(id);

    return prisma.note.update({
      where: { id },
      data: { isFavorite: !note.isFavorite }
    });
  },

  async delete(id: string) {
    await ensureNoteExists(id);

    await prisma.note.delete({ where: { id } });
  }
};
