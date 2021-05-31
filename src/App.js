import LetterButton from "./LetterButton";
import CurrentWord from "./CurrentWord";
import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [word, setWord] = useState("");
  const [filledLetters, setFilledLetters] = useState([]);
  const [wordDefinition, setWordDefinition] = useState("");
  const [isDisabledNext, setIsDisabledNext] = useState(false);

  useEffect(() => {
    setIsDisabledNext(true);
    fetchWord();
  }, []);

  useEffect(() => {
    determineFilledLetters();
    fetchWordDefinition();
  }, [word]);

  useEffect(() => {
    if (isWordFilled()) {
      setIsDisabledNext(true);
      setTimeout(resetWord, 2000);
    }
  }, [filledLetters]);

  const resetWord = () => {
    setWord("");
    setWordDefinition("");
    setFilledLetters([]);
    fetchWord();
  };

  const fetchWordDefinition = async () => {
    try {
      if (word) {
        const { data: wordDefnData } = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`
        );
        console.log(wordDefnData);
        if (wordDefnData.length) {
          const [wordDefn] = wordDefnData;
          const { meanings } = wordDefn;
          const [meaningData] = meanings;
          const { definitions } = meaningData;
          const [definitionData] = definitions;
          const { definition } = definitionData;
          console.log(definition);
          setWordDefinition(definition);
        }
      }
    } catch (e) {
      console.error("Error while fetching word definition data ", e);
      setWordDefinition("");
    }
  };

  const fetchWord = async () => {
    try {
      const { data: wordData } = await axios.get(
        "https://random-word-api.herokuapp.com/word?swear=0"
      );
      const [word] = wordData;
      if (word) {
        console.log(word);
        setWord(word.toUpperCase());
        setIsDisabledNext(false);
      }
    } catch (e) {
      console.error("Error while fetching word data ", e);
    }
  };

  const determineFilledLetters = () => {
    if (word) {
      const vowels = ["A", "E", "I", "O", "U"];
      const presentVowels = word
        .split("")
        .filter((letter) => vowels.includes(letter));
      if (presentVowels.length) {
        updateFilledLetters(presentVowels);
      } else {
        const randomNumber = Math.random() * word.length;
        updateFilledLetters([word.indexOf(randomNumber)]);
      }
    }
  };

  const isWordFilled = () =>
    word
      ? word.split("").every((letter) => filledLetters.includes(letter))
      : false;

  const getLetters = () => {
    const letters = [];
    for (let i = 0; i < 26; i++) {
      letters.push(String.fromCharCode(i + 65));
    }
    return letters;
  };

  const updateFilledLetters = (letterArr) =>
    setFilledLetters((prevFilledLetters) => [
      ...prevFilledLetters,
      ...letterArr
    ]);

  const handleLetterButtonClick = ({ target }) => {
    const { letter } = target?.dataset;
    if (letter) {
      updateFilledLetters(letter);
    }
  };

  const handleClickNext = () => {
    resetWord();
  };

  const renderCurrentWord = () => {
    return <CurrentWord word={word} filledLetters={filledLetters} />;
  };

  const renderWordDefiniton = () => {
    return (
      <p className="word-definition">
        {wordDefinition || "No definition available"}
      </p>
    );
  };

  const renderLetterButtons = (letters) => {
    return (
      <div className="letter-buttons">
        {letters.map((letter, idx) => (
          <LetterButton
            key={idx}
            letter={letter}
            handleClick={handleLetterButtonClick}
            disabled={filledLetters.includes(letter)}
          />
        ))}
      </div>
    );
  };

  const renderNextButton = () => (
    <button
      className="next-button button"
      onClick={handleClickNext}
      disabled={isDisabledNext}
    >
      Next
    </button>
  );
  return (
    <div id="container">
      <div className="app">
        {renderCurrentWord()}
        {renderWordDefiniton()}
        {renderLetterButtons(getLetters())}
        {renderNextButton()}
      </div>
    </div>
  );
}
