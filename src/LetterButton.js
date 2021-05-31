import "./styles.css";

export default function LetterButton({ letter, handleClick, disabled }) {
  return (
    <button
      className="letter-button button"
      onClick={handleClick}
      data-letter={letter}
      disabled={disabled}
    >
      {letter}
    </button>
  );
}
