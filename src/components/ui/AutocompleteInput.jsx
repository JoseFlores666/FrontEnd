import React, { useState, useEffect, useRef } from "react";

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
  fieldsToCheck = [], // Array de campos a consultar
  ConvertirAInput // Bandera para alternar entre input y textarea
}) => {
  const [showHistorial, setShowHistorial] = useState(false);
  const [filteredWords, setFilteredWords] = useState([]);
  const [displaySuggestions, setDisplaySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSelectedConcept, setLastSelectedConcept] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [arrowKeyPressed, setArrowKeyPressed] = useState(false);

  const containerRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
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

  const handleSelectWord = (selectedWord) => {
    let newValue;
    if (Array.isArray(value)) {
      newValue = value.map(val => val.replace(/\S+$/, selectedWord));
    } else {
      newValue = value.replace(/\S+$/, selectedWord);
    }

    onChange(newValue);
    setShowHistorial(false);
    setLastSelectedConcept(null);

    if (Array.isArray(newValue)) {
      setWordCount(newValue.reduce((count, val) => count + val.split(/\s+/).length, 0));
    } else {
      setWordCount(newValue.split(/\s+/).length);
    }

    if (!recentSuggestions.includes(selectedWord)) {
      if (recentSuggestions.length >= 5) {
        setRecentSuggestions([...recentSuggestions.slice(1), selectedWord]);
      } else {
        setRecentSuggestions([...recentSuggestions, selectedWord]);
      }
    }

    inputRefs.current[index].dispatchEvent(new Event('keepFocus'));
    setDisplaySuggestions([]);
    setSelectedSuggestionIndex(-1);
    setArrowKeyPressed(false);
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
    if (trimmedValue === "" || (Array.isArray(trimmedValue) && trimmedValue.every(val => val === ""))) {
      setFilteredWords([]);
      setDisplaySuggestions([]);
      setShowHistorial(false);
      setWordCount(0);
      setSelectedSuggestionIndex(-1);
      setArrowKeyPressed(false);
    } else {
      setLoading(true);

      const words = Array.isArray(trimmedValue) ? trimmedValue.flatMap(val => val.toLowerCase().split(/\s+/)) : trimmedValue.toLowerCase().split(/\s+/);
      const lastWord = words[words.length - 1];

      let suggestions = [];

      if (!lastSelectedConcept) {
        const allPhrases = extractPhrasesFromData();
        suggestions = allPhrases.filter(phrase => phrase.startsWith(lastWord));
      }

      if (suggestions.length === 0 || lastSelectedConcept) {
        const allWords = extractWordsFromData();
        suggestions = allWords.filter(word => word.startsWith(lastWord));
      }

      const filteredSuggestions = suggestions.filter(suggestion => suggestion !== lastWord).slice(0, 5);
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
          }}
        >
          {displaySuggestions.length > 0 ? (
            displaySuggestions.map((suggestion, wordIndex) => (
              <div key={wordIndex} className={`mb-2 ${selectedSuggestionIndex === wordIndex ? 'border-2 border-gray-500 rounded bg-gray-200' : ''}`}>
                <span
                  className={`text-sm cursor-pointer hover:text-blue-500 ${selectedSuggestionIndex === wordIndex ? 'font-bold' : ''}`}
                  onClick={() => handleSelectWord(suggestion)}
                >
                  {suggestion}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 mt-1">
              No hay sugerencias disponibles.
            </div>
          )}
        </div>
      )}
    </div>
  );
};