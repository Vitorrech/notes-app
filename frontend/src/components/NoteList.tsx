import { FileText, LoaderCircle, Star } from "lucide-react";
import { Note } from "../services/notes";

type NoteListProps = {
  notes: Note[];
  selectedNoteId?: string;
  isLoading: boolean;
  onSelect: (note: Note) => void;
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

function getDisplayTitle(title: string) {
  return title === "Untitled note" ? "Nota sem título" : title;
}

export function NoteList({ notes, selectedNoteId, isLoading, onSelect }: NoteListProps) {
  if (isLoading) {
    return (
      <div className="notes-state">
        <LoaderCircle className="state-icon is-spinning" size={26} />
        <strong>Carregando notas</strong>
        <span>Organizando seu espaço de trabalho...</span>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="notes-state">
        <FileText className="state-icon" size={28} />
        <strong>Nenhuma nota encontrada</strong>
        <span>Crie uma nova nota ou ajuste sua busca.</span>
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <button
          className={`note-list-item ${selectedNoteId === note.id ? "is-selected" : ""}`}
          key={note.id}
          onClick={() => onSelect(note)}
          type="button"
        >
          <div className="note-list-title-row">
            <strong>{getDisplayTitle(note.title)}</strong>
            {note.isFavorite && (
              <Star aria-label="Nota favorita" className="favorite-marker" size={16} />
            )}
          </div>
          <p>{note.content || "Sem conteúdo ainda."}</p>
          <div className="note-meta">
            <FileText size={14} />
            <time>{formatUpdatedAt(note.updatedAt)}</time>
          </div>
        </button>
      ))}
    </div>
  );
}
