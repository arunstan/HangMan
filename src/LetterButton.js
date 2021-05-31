import "./styles.css";

export default function LetterButton({ letter, handleClick }) {
  return (
    <button
      className="letter-button"
      onClick={handleClick}
      data-letter={letter}
    >
      {letter}
    </button>
  );
}
