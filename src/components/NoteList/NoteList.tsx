import css from "../NoteList/NoteList.module.css";
import type { Note } from "../../types/note";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";

interface NoteListProps {
  notes: Note[];
  queryKey: (string | number)[];
}

export default function NoteList({ notes, queryKey }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate: handleDeleteNote } = useMutation({
    mutationFn: deleteNote,
    onSuccess: (deletedNote) => {
      console.log("Deleted:", deletedNote);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error("Failed to delete note:", error);
    },
  });

  if (!notes.length) return null;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDeleteNote(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
