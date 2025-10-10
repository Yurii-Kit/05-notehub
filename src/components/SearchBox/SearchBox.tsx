import { useDebouncedCallback } from "use-debounce";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  searchQuery: string;
  onChange: (newQuery: string) => void;
}

export default function SearchBox({ searchQuery, onChange }: SearchBoxProps) {
  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    1000
  );

  return (
    <>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes"
        defaultValue={searchQuery}
        onChange={handleChange}
      />
    </>
  );
}
