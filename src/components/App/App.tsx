import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Toaster } from "react-hot-toast";
import NoteList from "../NoteList/NoteList";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import type { NoteFormValues, FetchNoteResponse } from "../../types/note";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";

function App() {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const queryClient = useQueryClient();
  const [debouncedQuery] = useDebounce(query, 800);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalOpen = () => {
    setIsModalOpen(true);
  };
  const modalClose = () => {
    setIsModalOpen(false);
  };

  const { data, isSuccess, error, isError, isLoading } = useQuery<
    FetchNoteResponse,
    Error
  >({
    queryKey: ["notes", debouncedQuery, currentPage],
    queryFn: () => fetchNotes(debouncedQuery, currentPage),
    // enabled: query !== "",
    retry: 0,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const createMutation = useMutation({
    mutationFn: (newNote: NoteFormValues) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      modalClose();
    },
  });

  const handleAddNote = (noteData: NoteFormValues) => {
    createMutation.mutate(noteData);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleChange = (newQuery: string) => {
    const searchQuary = newQuery.trim().toLowerCase();
    setQuery(searchQuary);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <header className={css.toolbar}>
        <SearchBox searchQuery={query} onChange={handleChange} />

        {isSuccess && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={modalOpen}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage error={error} />}

      {isSuccess && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDeleteNote} />
      )}
      {isSuccess && data.notes.length === 0 && <p>Нотаток не знайдено.</p>}

      {isModalOpen && (
        <Modal onClose={modalClose}>
          <NoteForm onClose={modalClose} onSubmit={handleAddNote} />
        </Modal>
      )}
    </div>
  );
}

export default App;
