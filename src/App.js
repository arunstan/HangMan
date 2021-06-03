import LetterButton from "./LetterButton";
import CurrentWord from "./CurrentWord";
import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const WORD_JAR_SIZE_INIT = 1;
  const WORD_JAR_SIZE_REFRESH = 3;
  const WORD_FETCH_BUFFER = 3;
  const WORD_POST_REVEAL_DURATION = 2000;

  const [word, setWord] = useState("");
  const [filledLetters, setFilledLetters] = useState([]);
  const [wordDefinition, setWordDefinition] = useState("");
  const [isDisabledNext, setIsDisabledNext] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [wordJar, updateWordJar] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isWordSolved, setIsWordSolved] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    setIsDisabledNext(true);
    if (isDataLoaded) {
      pickWord();
      setIsDisabledNext(false);
    }
  }, [isDataLoaded]);

  useEffect(() => {
    if (wordJar.length > 0) {
      fetchWords(WORD_JAR_SIZE_REFRESH);
    }
  }, [wordJar]);

  useEffect(() => {
    determineFilledLetters();
  }, [word]);

  useEffect(() => {
    if (checkIsWordSolved()) {
      setIsWordSolved(true);
      setSolvedCount((solvedCount) => solvedCount + 1);
      setTimeout(pickWord, WORD_POST_REVEAL_DURATION);
    }
  }, [filledLetters]);

  const initGame = async () => {
    await fetchWords(WORD_JAR_SIZE_INIT);
    setIsDataLoaded(true);
  };

  const pickWord = () => {
    setIsWordSolved(false);
    const [nextWord, ...restWords] = wordJar;
    setFilledLetters([]);
    updateWordJar(restWords);
    setWord(nextWord.word);
    setWordDefinition(nextWord.wordDefinition);
    setTotalCount((totalCount) => totalCount + 1);
  };

  const fetchWords = async (wordJarSize) => {
    const fetchedWords = [];
    const wordsInJar = wordJar.length;
    let wordsRequired =
      wordsInJar < wordJarSize
        ? wordJarSize - wordsInJar + WORD_FETCH_BUFFER
        : 0;
    if (wordsRequired) {
      while (wordsRequired) {
        const word = await fetchWord();
        const wordDefinition = await fetchWordDefinition(word);
        if (word && wordDefinition) {
          fetchedWords.push({
            word: word.toUpperCase(),
            wordDefinition
          });
          wordsRequired--;
        }
      }
      updateWordJar((wordJar) => [...wordJar, ...fetchedWords]);
    }
  };

  const fetchWordDefinition = async (word) => {
    try {
      if (word) {
        const { data: wordDefnData } = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`
        );
        if (wordDefnData.length) {
          const [wordDefn] = wordDefnData;
          const { meanings } = wordDefn;
          const [meaningData] = meanings;
          const { definitions } = meaningData;
          const [definitionData] = definitions;
          const { definition } = definitionData;
          return definition;
        }
      }
    } catch (e) {
      console.error("Error while fetching word definition data ", e);
      return "";
    }
  };

  const fetchWord = async () => {
    try {
      const { data: wordData } = await axios.get(
        "https://random-word-api.herokuapp.com/word?swear=0"
      );
      const [word] = wordData;
      return word || "";
    } catch (e) {
      console.error("Error while fetching word data ", e);
      return "";
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

  const checkIsWordSolved = () =>
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
    pickWord();
  };

  const renderCurrentWord = () => {
    return word ? (
      <CurrentWord
        word={word}
        filledLetters={filledLetters}
        isWordSolved={isWordSolved}
      />
    ) : (
      "Loading..."
    );
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

  const renderDetails = () => (
    <div className="details-block">
      <div className="stats">
        <p>
          <span className="label">Solved:</span>
          <span className="value">{solvedCount}</span>
        </p>
        <p>
          <span className="label">Attempted:</span>
          <span className="value">{totalCount}</span>
        </p>
      </div>
      {renderNextButton()}
    </div>
  );

  return (
    <div id="container">
      <div className="app">
        {renderCurrentWord()}
        {renderWordDefiniton()}
        {renderLetterButtons(getLetters())}
        {renderDetails()}
      </div>
    </div>
  );
}
