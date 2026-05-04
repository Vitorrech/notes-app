import { api } from "./api";

export type Note = {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotePayload = {
  title?: string;
  content?: string;
};

export async function listNotes(search?: string) {
  const response = await api.get<Note[]>("/notes", {
    params: search ? { search } : undefined
  });

  return response.data;
}

export async function createNote(payload: NotePayload) {
  const response = await api.post<Note>("/notes", payload);

  return response.data;
}

export async function updateNote(id: string, payload: NotePayload) {
  const response = await api.put<Note>(`/notes/${id}`, payload);

  return response.data;
}

export async function toggleFavorite(id: string) {
  const response = await api.patch<Note>(`/notes/${id}/favorite`);

  return response.data;
}

export async function deleteNote(id: string) {
  await api.delete(`/notes/${id}`);
}
