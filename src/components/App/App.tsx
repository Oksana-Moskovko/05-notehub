import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import css from "../App/App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchNotes } from "../../services/noteService";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
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
        <NoteList
          notes={notes}
          queryKey={["notes", searchQuery, currentPage]}
        />
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
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
