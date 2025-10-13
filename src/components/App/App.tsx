import { useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError, error } = useQuery<
    FetchNoteResponse,
    Error
  >({
    queryKey: ["notes", query, currentPage],
    queryFn: () => fetchNotes(query, currentPage),
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox setQuery={setQuery} setCurrentPage={setCurrentPage} />
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
