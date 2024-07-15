import React, { useState, useEffect, useRef } from "react";

export const AutocompleteTextArea = ({
    value,
    onChange,
    data,
    recentSuggestions,
    setRecentSuggestions,
    inputRef,
    inputProps,
    placeholder = "Ingrese un valor",
}) => {
    const [showHistorial, setShowHistorial] = useState(false);
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
                setShowHistorial(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleHistorial = () => {
        setShowHistorial(!showHistorial);
    };

    const handleSelectWord = (selectedWord) => {
        const newValue = value.replace(/\S+$/, selectedWord);
        onChange(newValue);
        setShowHistorial(false);

        if (!recentSuggestions.includes(selectedWord)) {
            if (recentSuggestions.length >= 5) {
                setRecentSuggestions([...recentSuggestions.slice(1), selectedWord]);
            } else {
                setRecentSuggestions([...recentSuggestions, selectedWord]);
            }
        }

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Tab") {
            if (filteredWords.length > 0) {
                event.preventDefault();
                handleSelectWord(filteredWords[0]);
            }
            setShowHistorial(false);
        }
    };

    const handleValueChange = (value) => {
        onChange(value);

        if (value.trim() === "") {
            const allWords = data.flatMap(dataItem =>
                dataItem.toLowerCase().split(' ')
            );
            const uniqueWords = [...new Set(allWords)];
            const suggestions = uniqueWords.slice(0, 5);
            setFilteredWords(suggestions);
            setShowHistorial(false);
        } else {
            const words = value.toLowerCase().split(' ');
            const lastWord = words[words.length - 1];
            const allWords = data.flatMap(dataItem =>
                dataItem.toLowerCase().split(' ')
            );
            const uniqueWords = [...new Set(allWords)];
            const suggestions = uniqueWords.filter(word => word.startsWith(lastWord));
            setFilteredWords(suggestions.slice(0, 5));
            setShowHistorial(true);
        }
    };

    return (
        <div ref={containerRef}>
            <textarea
                className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
                placeholder={placeholder}
                value={value}
                ref={inputRef}
                onClick={toggleHistorial}
                onChange={(e) => handleValueChange(e.target.value)}
                onKeyDown={handleKeyDown}
                {...inputProps}
            />
            {showHistorial && (
                <div
                    className="absolute z-10 bg-white p-3 rounded-md border border-gray-300 shadow-lg mt-2 max-h-40 overflow-y-auto"
                    style={{ width: inputRef.current?.offsetWidth }}
                >
                    {value.trim() === "" ? (
                        <div className="text-sm text-gray-500 mt-1">Comienza a escribir para ver sugerencias.</div>
                    ) : filteredWords.length > 0 ? (
                        filteredWords.map((word, wordIndex) => (
                            <div key={wordIndex} className="mb-2">
                                <span
                                    className="text-sm cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSelectWord(word);
                                    }}
                                >
                                    {word}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 mt-1">No hay sugerencias disponibles.</div>
                    )}
                </div>
            )}
        </div>
    );
};