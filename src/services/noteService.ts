import axios from "axios";
import type { Note } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const myToken = import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.headers.common["Authorization"] = `Bearer ${myToken}`;

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];        
  totalPages: number;
}

export interface NewNote {
  title: string;
  content: string;
  tag: string;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const trimmedSearch = search.trim();
  const params: Record<string, string | number> = { page, perPage };
  if (trimmedSearch) params.search = trimmedSearch;

  const response = await axios.get<FetchNotesResponse>("/notes", { params });
  return response.data;
};


export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await axios.post<Note>("/notes", newNote);
  return response.data;
};

export const deleteNote = async (noteId: number): Promise<Note> => {
  const response = await axios.delete(`/notes/${noteId}`);
  return response.data;
};
