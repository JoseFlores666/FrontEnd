import React, { useRef, useState } from 'react';
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import SubiendoImagenes from '../components/ui/SubiendoImagenes'; // Asegúrate de ajustar la ruta de importación

export const AsignarTecnico = ({ historialOrden, recentSuggestions, setRecentSuggestions, errors, setValue }) => {
    const [observaciones, setObservaciones] = useState('');
    const subiendoImagenesRef = useRef(null);
    const refs = useRef([]); // Para almacenar referencias a los inputs si es necesario

    return (
        <div className="mx-auto max-w-5xl p-4 text-black">
            <div className="bg-white p-6 rounded-md shadow-md">
                <h1 className="text-2xl font-bold text-center mb-5">Asignar Técnico</h1>

                <div className="flex items-center justify-center">
                    <SubiendoImagenes ref={subiendoImagenesRef} />
                </div>


                <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label
                            className="text-sm mb-1 font-medium leading-none"
                        >
                            Descripción
                        </label>
                        <AutocompleteInput
                            value={observaciones}
                            onChange={(newValue) => setObservaciones(newValue)}
                            data={historialOrden}
                            recentSuggestions={recentSuggestions}
                            setRecentSuggestions={setRecentSuggestions}
                            inputRefs={refs}
                            placeholder="Ingrese sus Observaciones"
                            fieldsToCheck={['Observacionestecnicas', 'descripcionDelServicio', 'soliInsumosDescripcion']}
                            inputProps={{
                                type: "text",
                                maxLength: 200,
                                className: "w-full resize-none text-black p-3 border border-gray-400 bg-gray-50 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                                onBlur: () => setValue("observaciones", observaciones, { shouldValidate: true })
                            }}
                        />
                    </div>

                    <select name="" id="">
                        <option value="">Selecciona un Tecnico</option>
                        <option value="">Tu papá</option>
                        <option value="">Fernando Palomo</option>
                        <option value="">Donald Trump</option>
                    </select>

                </div>
            </div>
        </div>
    );
};
