import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import Modal from "../Modal/Modal";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchNotes } from "../../services/noteService";
import type { FetchNoteResponse } from "../../types/note";
import css from "./App.module.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [query, setQuery] = useState<string>("");
  const debouncedSetQuery = useDebouncedCallback((newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  }, 800);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, isError, error } = useQuery<
    FetchNoteResponse,
    Error
  >({
    queryKey: ["notes", query, currentPage],
    queryFn: () => fetchNotes(query, currentPage),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox text={query} onSearch={debouncedSetQuery} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage error={error} />}
      {data && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
