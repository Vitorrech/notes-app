import {
  CheckCircle2,
  Clock3,
  FileText,
  LoaderCircle,
  Sparkles,
  Star,
  Trash2,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Note } from "../services/notes";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type NoteEditorProps = {
  note?: Note;
  draftTitle: string;
  draftContent: string;
  saveStatus: SaveStatus;
  isCreating: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onFavorite: () => void;
  onDelete: () => Promise<void> | void;
  onCreate: () => Promise<void> | void;
};

const saveStatusLabel: Record<SaveStatus, string> = {
  idle: "Pronto",
  saving: "Salvando...",
  saved: "Salvo",
  error: "Falha ao salvar"
};

const saveStatusIcon = {
  idle: Clock3,
  saving: LoaderCircle,
  saved: CheckCircle2,
  error: XCircle
};

export function NoteEditor({
  note,
  draftTitle,
  draftContent,
  saveStatus,
  isCreating,
  onTitleChange,
  onContentChange,
  onFavorite,
  onDelete,
  onCreate
}: NoteEditorProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsConfirmingDelete(false);
    setIsDeleting(false);
  }, [note?.id]);

  if (!note) {
    return (
      <main className="editor-empty">
        <div className="empty-panel">
          <div className="empty-icon">
            <Sparkles size={30} />
          </div>
          <span>Seu caderno digital</span>
          <h1>Nenhuma nota selecionada</h1>
          <p>Crie uma nova nota para começar a escrever.</p>
          <button
            className="empty-create-button"
            disabled={isCreating}
            onClick={onCreate}
            type="button"
          >
            <FileText size={18} />
            Criar nova nota
          </button>
        </div>
      </main>
    );
  }

  const SaveIcon = saveStatusIcon[saveStatus];

  async function handleConfirmDelete() {
    setIsDeleting(true);

    try {
      await onDelete();
      setIsConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="editor">
      <header className="editor-toolbar">
        <span className={`save-status ${saveStatus}`}>
          <SaveIcon className={saveStatus === "saving" ? "is-spinning" : ""} size={16} />
          {saveStatusLabel[saveStatus]}
        </span>
        <div className="editor-actions">
          <button
            className={`icon-button ${note.isFavorite ? "is-favorite" : ""}`}
            onClick={onFavorite}
            title="Favoritar"
            type="button"
          >
            <Star fill={note.isFavorite ? "currentColor" : "none"} size={19} />
          </button>
          <button
            className="danger-button"
            onClick={() => setIsConfirmingDelete(true)}
            type="button"
          >
            <Trash2 size={17} />
            Excluir nota
          </button>
        </div>
      </header>

      {isConfirmingDelete && (
        <div className="delete-confirmation" role="dialog" aria-modal="false">
          <div>
            <strong>Excluir nota?</strong>
            <p>Essa ação não pode ser desfeita.</p>
          </div>
          <div className="delete-confirmation-actions">
            <button
              className="secondary-action-button"
              disabled={isDeleting}
              onClick={() => setIsConfirmingDelete(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="confirm-delete-button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              type="button"
            >
              <Trash2 size={16} />
              Excluir
            </button>
          </div>
        </div>
      )}

      <div className="editor-paper" key={note.id}>
        <div className="document-label">
          <FileText size={16} />
          Nota
        </div>

        <input
          aria-label="Título da nota"
          className="title-input"
          maxLength={120}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Nota sem título"
          value={draftTitle}
        />

        <textarea
          aria-label="Conteúdo da nota"
          className="content-input"
          onChange={(event) => onContentChange(event.target.value)}
          placeholder="Comece a escrever..."
          value={draftContent}
        />
      </div>
    </main>
  );
}
