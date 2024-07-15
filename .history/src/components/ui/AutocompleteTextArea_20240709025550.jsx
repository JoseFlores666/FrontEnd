import React, { useState, useEffect, useRef } from "react";

export const AutocompleteTextArea = ({
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
            const suggestions = uniqueWords.slice(0, 3);
            setFilteredWords(suggestions);
            setShowHistorial(null);
        } else {
            const words = value.toLowerCase().split(' ');
            const lastWord = words[words.length - 1];
            const allWords = data.flatMap(item =>
                item.informe.descripcionDelServicio.toLowerCase().split(' ')
            );
            const uniqueWords = [...new Set(allWords)];
            const suggestions = uniqueWords.filter(word => word.startsWith(lastWord));
            setFilteredWords(suggestions.slice(0, 5));
            setShowHistorial(index);
        }
    };

    return (
        <div ref={containerRef}>
            <input
                className="p-3 text-black w-full rounded-md border border-gray-400"
                placeholder={placeholder}
                required
                value={value}
                ref={(el) => (refs.current[index] = el)}
                onClick={toggleHistorial}
                onChange={(e) => handleValueChange(e.target.value)}
                onKeyDown={handleKeyDown}
                {...inputProps}
            />
            {showHistorial === index && (
                <div
                    className="absolute z-10 bg-white p-3 rounded-md border border-gray-300 shadow-lg mt-2 max-h-40 overflow-y-auto"
                    style={{ width: refs.current[index]?.offsetWidth }}
                >
                    {value.trim() === "" ? (
                        <div>
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
                        </div>
                    ) : filteredWords.length > 0 ? (
                        filteredWords.map((word, suggestionIndex) => (
                            <p
                                key={suggestionIndex}
                                className="text-sm cursor-pointer hover:text-blue-500"
                                onClick={() => handleSelectWord(word)}
                            >
                                {word}
                            </p>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No se encontraron sugerencias.</p>
                    )}
                </div>
            )}
        </div>
    );
};
