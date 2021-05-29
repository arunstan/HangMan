import CharacterButton from "./CharacterButton";
import "./styles.css";

export default function App() {
  const getCharacters = () => {
    const characters = [];
    for (let i = 0; i < 26; i++) {
      characters.push(String.fromCharCode(i + 65));
    }
    return characters;
  };

  const renderCurrentWord = (word, blanks) => {};

  const renderCharacterButtons = (characters) => {
    return characters.map((char) => <CharacterButton character={char} />);
  };
  return <div className="App">{renderCharacterButtons(getCharacters())}</div>;
}
