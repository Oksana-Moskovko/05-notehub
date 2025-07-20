import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  useQuery,
  useMutation,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";

import css from "../App/App.module.css";
// import type { Note } from "../../types/note";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import { fetchNotes, deleteNote } from "../../services/noteService";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () =>
      fetchNotes({ search: searchQuery, page: currentPage, perPage: 12 }),
    placeholderData: keepPreviousData,
  });
  // console.log("Fetched data:", data);

  const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    },
    300
  );

  const { mutate: handleDeleteNote } = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", searchQuery, currentPage],
      });
    },
    onError: (error) => {
      console.log("Failed to delete note:", error);
    },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={updateSearchQuery} />
          {isSuccess && totalPages > 1 && (
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>

        <NoteList notes={notes} onDelete={handleDeleteNote} />

        {isError && <p>Error: {(error as Error).message}</p>}
        {isLoading && <p>Loading...</p>}
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm
              onClose={closeModal}
              searchQuery={searchQuery}
              currentPage={currentPage}
            />
          </Modal>
        )}
      </div>
    </>
  );
}
