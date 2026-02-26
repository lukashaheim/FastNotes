export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export function createNote(title: string, content: string): Note {
  return {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };
}
