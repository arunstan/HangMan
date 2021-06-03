import "./styles.css";

export default function CurrentWord({ word, filledLetters, isWordSolved }) {
  const getWordWithBlanks = () => {
    const wordWithBlanks = word.split("").map((char) => {
      return filledLetters.includes(char) ? char : "";
    });
    return wordWithBlanks;
  };
  return (
    <div className={`current-word ${isWordSolved ? "is-word-solved" : ""}`}>
      {getWordWithBlanks().map((char, idx) => {
        return (
          <span key={idx} className="current-word-letter">
            {char}
          </span>
        );
      })}
    </div>
  );
}
