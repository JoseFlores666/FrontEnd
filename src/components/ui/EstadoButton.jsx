import { forwardRef } from "react";

// Define el estilo para los estados
const estadoBotonStyles = {
    "1": "text-gray-500 border-gray-500",
    "2": "text-blue-500 border-blue-500",
    "3": "text-purple-500 border-purple-500",
    "4": "text-green-500 border-green-500",
    "5": "text-red-500 border-red-500",
};

export const EstadoButton = forwardRef(({ IdEstado, nombreEstado, ...props }, ref) => {
    // Usa el IdEstado para obtener el estilo correspondiente
    const style = estadoBotonStyles[IdEstado] || "text-gray-500 border-gray-500";

    return (
        <button
            {...props}
            ref={ref}
            className={`border font-semibold px-2 py-1 rounded-lg ${style} text-center`}
        >
            {nombreEstado}
        </button>
    );
});
