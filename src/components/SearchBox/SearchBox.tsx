import css from "./SearchBox.module.css";

interface SearchBoxProps {
  searchQuery: string;
  onChange: (newQuery: string) => void;
}

export default function SearchBox({ searchQuery, onChange }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes"
        value={searchQuery}
        onChange={handleChange}
      />
    </>
  );
}
