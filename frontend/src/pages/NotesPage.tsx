import { Menu, PanelLeftClose, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NoteEditor } from "../components/NoteEditor";
import { NoteList } from "../components/NoteList";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  Note,
  createNote,
  deleteNote,
  listNotes,
  toggleFavorite,
  updateNote
} from "../services/notes";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function getDisplayTitle(title: string) {
  return title === "Untitled note" ? "Nota sem título" : title;
}

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>();
  const [search, setSearch] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const debouncedSearch = useDebouncedValue(search);
  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId),
    [notes, selectedNoteId]
  );

  async function loadNotes(searchTerm = debouncedSearch) {
    setIsLoading(true);

    try {
      const data = await listNotes(searchTerm.trim());
      setNotes(data);

      if (data.length > 0 && !data.some((note) => note.id === selectedNoteId)) {
        setSelectedNoteId(data[0].id);
      }

      if (data.length === 0) {
        setSelectedNoteId(undefined);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, [debouncedSearch]);

  useEffect(() => {
    if (!selectedNote) {
      setDraftTitle("");
      setDraftContent("");
      return;
    }

    setDraftTitle(getDisplayTitle(selectedNote.title));
    setDraftContent(selectedNote.content);
    setSaveStatus("idle");
  }, [selectedNote?.id]);

  useEffect(() => {
    if (!selectedNote) {
      return;
    }

    const hasChanges =
      draftTitle !== selectedNote.title || draftContent !== selectedNote.content;

    if (!hasChanges) {
      return;
    }

    setSaveStatus("saving");

    const timeoutId = window.setTimeout(async () => {
      try {
        const updatedNote = await updateNote(selectedNote.id, {
          title: draftTitle,
          content: draftContent
        });

        setNotes((currentNotes) =>
          currentNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
        );
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [draftTitle, draftContent, selectedNote]);

  async function handleCreateNote() {
    setIsCreating(true);

    try {
      const note = await createNote({
        title: "Nota sem título",
        content: ""
      });

      setNotes((currentNotes) => [note, ...currentNotes]);
      setSelectedNoteId(note.id);
      setSearch("");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleFavorite() {
    if (!selectedNote) {
      return;
    }

    const updatedNote = await toggleFavorite(selectedNote.id);

    setNotes((currentNotes) =>
      currentNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  }

  async function handleDeleteNote() {
    if (!selectedNote) {
      return;
    }

    await deleteNote(selectedNote.id);

    const remainingNotes = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(remainingNotes);
    setSelectedNoteId(remainingNotes[0]?.id);
  }

  return (
    <div className={`app-shell ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <button
        className="mobile-sidebar-button"
        onClick={() => setIsSidebarOpen((currentValue) => !currentValue)}
        title={isSidebarOpen ? "Ocultar lista de notas" : "Mostrar lista de notas"}
        type="button"
      >
        <Menu size={20} />
      </button>

      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-title">
            <span className="eyebrow">Área de trabalho</span>
            <h1>Notas</h1>
          </div>
          <button
            className="new-note-button"
            disabled={isCreating}
            onClick={handleCreateNote}
            title="Criar nota"
            type="button"
          >
            <Plus size={21} />
          </button>
        </div>

        <div className="sidebar-summary">
          <strong>{notes.length}</strong>
          <span>{notes.length === 1 ? "nota no caderno" : "notas no caderno"}</span>
        </div>

        <label className="search-box">
          <span>Buscar</span>
          <Search size={17} />
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar notas"
            value={search}
          />
        </label>

        <button
          className="collapse-sidebar-button"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        >
          <PanelLeftClose size={17} />
          Recolher lista
        </button>

        <NoteList
          isLoading={isLoading}
          notes={notes}
          onSelect={(note) => setSelectedNoteId(note.id)}
          selectedNoteId={selectedNoteId}
        />
      </aside>

      <NoteEditor
        draftContent={draftContent}
        draftTitle={draftTitle}
        isCreating={isCreating}
        note={selectedNote}
        onContentChange={setDraftContent}
        onCreate={handleCreateNote}
        onDelete={handleDeleteNote}
        onFavorite={handleToggleFavorite}
        onTitleChange={setDraftTitle}
        saveStatus={saveStatus}
      />
    </div>
  );
}
