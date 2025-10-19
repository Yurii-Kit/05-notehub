"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { fetchNotes } from "@/lib/api";
import type { FetchNoteResponse } from "@/src/types/note";
import css from "./NotesPage.module.css";

export default function NotesClient({
  initialQuery,
  initialPage,
}: {
  initialQuery: string;
  initialPage: number;
}) {
  const [query, setQuery] = useState<string>(initialQuery);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, isLoading, isError, error } = useQuery<FetchNoteResponse, Error>({
    queryKey: ["notes", query, currentPage],
    queryFn: () => fetchNotes(query, currentPage),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox setQuery={setQuery} setCurrentPage={setCurrentPage} />
        {data && data.totalPages > 1 && (
          <Pagination totalPages={data.totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />)
        }
        <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage error={error} />}
      {data && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
