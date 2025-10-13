import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  setQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
}

export default function SearchBox({
  setQuery,
  setCurrentPage,
}: SearchBoxProps) {
  const [localQuery, setLocalQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(localQuery, 800);

  useEffect(() => {
    setQuery(debouncedQuery);
    setCurrentPage(1);
  }, [debouncedQuery, setQuery, setCurrentPage]);

  return (
    <input
      className={css.input}
      value={localQuery}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        setLocalQuery(event.target.value)
      }
      placeholder="Search notes"
    />
  );
}
