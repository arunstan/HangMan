import "./styles.css";
import classNames from "classnames";

export default function CurrentWord({
  word,
  filledLetters,
  isWordSolved,
  isTimeOver
}) {
  const getWordWithBlanks = () => {
    const wordWithBlanks = word.split("").map((char) => {
      return filledLetters.includes(char) ? char : "";
    });
    return wordWithBlanks;
  };

  const currentWordClassNames = classNames({
    "current-word": true,
    "is-time-over": isTimeOver && !isWordSolved,
    "is-word-solved": isWordSolved && !isTimeOver
  });
  return (
    <div className={currentWordClassNames}>
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
