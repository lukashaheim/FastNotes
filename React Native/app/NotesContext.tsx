import React, { createContext, useContext, useState } from "react";
import { Note } from "./models/Note";

type NotesContextType = {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes må brukes inne i NotesProvider");
  }
  return context;
}