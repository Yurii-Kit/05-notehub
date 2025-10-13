import axios, { type AxiosResponse } from "axios";
import { type Note } from "../types/note";
import type { NoteFormValues, FetchNoteResponse } from "../types/note";

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = "https://notehub-public.goit.study/api/";
axios.defaults.headers.common["Authorization"] = `Bearer ${myKey}`;

export const fetchNotes = async (
  keyword: string,
  page: number,
  perPage: number = 12
): Promise<FetchNoteResponse> => {
  const response: AxiosResponse<FetchNoteResponse> = await axios.get("notes", {
    params: { search: keyword, page, perPage },
  });
  return response.data;
};

export const createNote = async (newNote: NoteFormValues): Promise<Note> => {
  const response: AxiosResponse<Note> = await axios.post("notes", newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await axios.delete(`notes/${id}`);
  return response.data;
};
