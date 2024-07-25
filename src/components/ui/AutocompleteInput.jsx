import React, { useState, useEffect, useRef } from "react";
import '../../css/Animaciones.css';

export const AutocompleteInput = ({
  index,
  value,
  onChange,
  data,
  recentSuggestions,
  setRecentSuggestions,
  inputRefs,
  inputProps,
  placeholder = "Ingrese un valor",
  fieldsToCheck = [],
  ConvertirAInput
}) => {
  const [showHistorial, setShowHistorial] = useState(false);
  const [filteredWords, setFilteredWords] = useState([]);
  const [displaySuggestions, setDisplaySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSelectedConcept, setLastSelectedConcept] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [arrowKeyPressed, setArrowKeyPressed] = useState(false);
  const [lastAutocompleteType, setLastAutocompleteType] = useState(null);

  const containerRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowHistorial(false);
        setSelectedSuggestionIndex(-1);
        setArrowKeyPressed(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectWord = (selected) => {
    const { type, suggestion } = selected;

    const currentValue = Array.isArray(value) ? value.join(' ') : value;
    const trimmedValue = currentValue.trim();
    let newValue;

    if (type === 'phrase') {
      newValue = `${trimmedValue}${suggestion}`.trim();
    } else if (type === 'word') {
      const words = trimmedValue.split(/\s+/);
      const lastWord = words[words.length - 1] || '';
      newValue = words.slice(0, -1).join(' ') + (lastWord ? ' ' : '') + suggestion;
    }

    if (newValue.startsWith(' ')) {
      newValue = newValue.slice(1);
    }

    onChange(newValue);

    if (Array.isArray(newValue)) {
      setWordCount(newValue.reduce((count, val) => count + val.split(/\s+/).length, 0));
    } else {
      setWordCount(newValue.split(/\s+/).length);
    }

    setShowHistorial(false);
    setLastSelectedConcept(null);

    if (!recentSuggestions.includes(suggestion)) {
      if (recentSuggestions.length >= 5) {
        setRecentSuggestions([...recentSuggestions.slice(1), suggestion]);
      } else {
        setRecentSuggestions([...recentSuggestions, suggestion]);
      }
    }

    inputRefs.current[index].dispatchEvent(new Event('keepFocus'));
    setDisplaySuggestions([]);
    setSelectedSuggestionIndex(-1);
    setArrowKeyPressed(false);
    setLastAutocompleteType(type);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Tab") {
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < displaySuggestions.length) {
        event.preventDefault();
        handleSelectWord(displaySuggestions[selectedSuggestionIndex]);
      }
      setShowHistorial(false);
      setArrowKeyPressed(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setArrowKeyPressed(true);
      setSelectedSuggestionIndex(prevIndex =>
        Math.min(prevIndex + 1, displaySuggestions.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setArrowKeyPressed(true);
      setSelectedSuggestionIndex(prevIndex =>
        Math.max(prevIndex - 1, 0)
      );
    }
  };

  const extractWordsFromData = () => {
    const allWords = data.flatMap(item => {
      return fieldsToCheck.reduce((words, field) => {
        const fieldValue = item[field];
        if (Array.isArray(fieldValue)) {
          fieldValue.forEach(val => {
            if (val) {
              words.push(...val.toLowerCase().split(/\s+/));
            }
          });
        } else if (fieldValue) {
          const fieldWords = fieldValue.toLowerCase().split(/\s+/);
          words.push(...fieldWords);
        }
        return words;
      }, []);
    });

    return [...new Set(allWords)];
  };

  const extractPhrasesFromData = () => {
    const allPhrases = data.flatMap(item => {
      return fieldsToCheck.reduce((phrases, field) => {
        const fieldValue = item[field];
        if (Array.isArray(fieldValue)) {
          fieldValue.forEach(val => {
            if (val) {
              phrases.push(val.toLowerCase());
            }
          });
        } else if (fieldValue) {
          phrases.push(fieldValue.toLowerCase());
        }
        return phrases;
      }, []);
    });

    return [...new Set(allPhrases)];
  };

  const handleValueChange = async (value) => {
    onChange(value);

    const trimmedValue = Array.isArray(value) ? value.map(val => val.trim()) : value.trim();
    const lastChar = value.slice(-1);

    if (trimmedValue === "" || (Array.isArray(trimmedValue) && trimmedValue.every(val => val === "")) || lastChar === " ") {
      setFilteredWords([]);
      setDisplaySuggestions([]);
      setShowHistorial(false);
      setWordCount(0);
      setSelectedSuggestionIndex(-1);
      setArrowKeyPressed(false);
    } else {
      setLoading(true);

      const lines = trimmedValue.split('\n');
      const lastLine = lines[lines.length - 1] || '';
      const words = lastLine.split(/\s+/);

      const lastWords = words.slice(-3).join(' ');
      const lastWord = words[words.length - 1];

      const allPhrases = extractPhrasesFromData();
      const phraseSuggestions = allPhrases
        .filter(phrase => phrase.startsWith(lastWords) && phrase.length > lastWords.length)
        .map(phrase => phrase.slice(lastWords.length).trim());

      const allWords = extractWordsFromData();
      const wordSuggestions = allWords
        .filter(word => word.startsWith(lastWord))
        .slice(0, 5);

      const filteredSuggestions = [
        ...phraseSuggestions.map(suggestion => ({ type: 'phrase', suggestion })),
        ...wordSuggestions.map(suggestion => ({ type: 'word', suggestion }))
      ];

      setFilteredWords(filteredSuggestions);
      setDisplaySuggestions(filteredSuggestions);
      setShowHistorial(true);
      setLoading(false);
      setSelectedSuggestionIndex(0);
    }
  };

  const InputComponent = ConvertirAInput ? 'input' : 'textarea';

  return (
    <div ref={containerRef} className="relative">
      <InputComponent
        className={`p-3 text-black w-full rounded-md resize-none border border-gray-400 ${ConvertirAInput ? 'text-sm' : ''}`}
        placeholder={placeholder}
        value={value}
        ref={(el) => (inputRefs.current[index] = el)}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        {...inputProps}
      />
      {loading && <div className="text-sm text-gray-500 mt-1">Cargando...</div>}
      {showHistorial && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 bg-white p-3 rounded-md border border-gray-300 shadow-lg"
          style={{
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {displaySuggestions.length > 0 ? (
            displaySuggestions.map((suggestion, wordIndex) => (
              <div
                key={wordIndex}
                className={`mb-2 ${selectedSuggestionIndex === wordIndex ? 'border-2 border-gray-500 rounded bg-gray-200' : ''}`}
              >
                <span
                  className={`text-sm cursor-pointer hover:text-blue-500 ${selectedSuggestionIndex === wordIndex ? 'suggestion-expanded font-bold' : 'suggestion-truncated'}`}
                  onClick={() => handleSelectWord(suggestion)}
                >
                  {suggestion.suggestion}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No hay sugerencias</div>
          )}
        </div>
      )}
    </div>
  );
};
