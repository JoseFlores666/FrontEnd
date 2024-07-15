import React, { useState, useEffect, useRef } from "react";

export const AutocompleteInput = ({
    index,
    value,
    onChange,
    data,
    recentSuggestions,
    setRecentSuggestions,
    refs,
    inputProps,
    placeholder = "Ingrese un valor",
}) => {
    const [showHistorial, setShowHistorial] = useState(null);
    const [filteredWords, setFilteredWords] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                !event.target.classList.contains('text-sm') &&
                !event.target.classList.contains('cursor-pointer') &&
                !event.target.classList.contains('hover:text-blue-500')
            ) {
                setShowHistorial(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleHistorial = () => {
        setShowHistorial(showHistorial === index ? null : index);
    };

    const handleSelectWord = (selectedWord) => {
        const newValue = value.replace(/\S+$/, selectedWord);
        onChange(newValue);
        setShowHistorial(null);

        if (!recentSuggestions.includes(selectedWord)) {
            if (recentSuggestions.length >= 5) {
                setRecentSuggestions([...recentSuggestions.slice(1), selectedWord]);
            } else {
                setRecentSuggestions([...recentSuggestions, selectedWord]);
            }
        }

        setTimeout(() => {
            refs.current[index].focus();
        }, 0);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Tab") {
            if (filteredWords.length > 0) {
                event.preventDefault();
                handleSelectWord(filteredWords[0]);
            }
            setShowHistorial(null);
        }
    };

    const handleValueChange = (value) => {
        onChange(value);

        if (value.trim() === "") {
            const allWords = data.flatMap(item =>
                item.informe.descripcionDelServicio.toLowerCase().split(' ')
            );
            const uniqueWords = [...new Set(allWords)];
            const suggestions = uniqueWords.filter(word =>
                word.toLowerCase().startsWith(value.toLowerCase())
            ).slice(0, 5);
            setFilteredWords(suggestions);
            setShowHistorial(index);
        } else {
            setFilteredWords([]);
            setShowHistorial(null);
        }
    };

    return (
        <div ref={containerRef}>
            <input
                {...inputProps}
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => handleValueChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={toggleHistorial}
            />
            {showHistorial === index && (
                <div className="bg-white p-2 shadow-md mt-1 max-h-36 overflow-y-auto rounded-md z-10 absolute w-full">
                    <p className="font-bold mb-2">Sugerencias recientes:</p>
                    {recentSuggestions.map((word, suggestionIndex) => (
                        <p
                            key={suggestionIndex}
                            className="text-sm cursor-pointer hover:text-blue-500"
                            onClick={() => handleSelectWord(word)}
                        >
                            {word}
                        </p>
                    ))}
                    {filteredWords.map((word, suggestionIndex) => (
                          <div key={suggestionIndex}>
                            <p
                                key={suggestionIndex}
                                className="text-sm cursor-pointer hover:text-blue-500"
                                onClick={() => handleSelectWord(word)}
                            >
                                <p>{word}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};