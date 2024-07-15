import React, { useState, useEffect, useRef } from "react";

export const AutocompleteInput = ({
    index,
    value,
    onChange,
    data,
    recentSuggestions,
    setRecentSuggestions,
    descripcionRefs,
    inputProps,
    placeholder = "Ingrese un valor",
    CamposABuscar
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
            descripcionRefs.current[index].focus();
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
        console.log("Data:", data);
        if (value.trim() === "") {
            setFilteredWords([]);
            setShowHistorial(false);
        } else {
            const words = value.toLowerCase().split(' ');
            const lastWord = words[words.length - 1];

            // Verificamos que data sea un string antes de operar con él
            const uniqueWords = [
                ...(data[0]?.informe?.descripcionDelServicio ? data[0].informe.descripcionDelServicio.toLowerCase().split(' ') : []),
                ...(data[0]?.solicitud?.Observacionestecnicas ? data[0].solicitud.Observacionestecnicas.toLowerCase().split(' ') : [])
            ];
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
                ref={(el) => (descripcionRefs.current[index] = el)}
                onChange={(e) => handleValueChange(e.target.value)}
                onKeyDown={handleKeyDown}
                {...inputProps}
            />
            {showHistorial && (
                <div
                    className="absolute z-10 bg-white p-3 rounded-md border border-gray-300 shadow-lg mt-2 max-h-40 overflow-y-auto"
                    style={{ width: descripcionRefs.current[index]?.offsetWidth }}
                >
                    {filteredWords.length > 0 ? (
                        filteredWords.map((word, wordIndex) => (
                            <div key={wordIndex} className="mb-2">
                                <span
                                    className="text-sm cursor-pointer hover:text-blue-500"
                                    onClick={() => handleSelectWord(word)}
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
