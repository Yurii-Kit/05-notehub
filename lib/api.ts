import axios, { type AxiosResponse } from "axios";
import type { Note, NoteFormValues, FetchNoteResponse } from "@/types/note";

const apiToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = "https://notehub-public.goit.study/api/";
if (apiToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${apiToken}`;
}

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

export const fetchNoteById = async (id: number | string): Promise<Note> => {
  const response: AxiosResponse<Note> = await axios.get(`notes/${id}`);
  return response.data;
};
