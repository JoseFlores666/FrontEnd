import React from 'react';

const TablaVistaOrden = () => {
    // Aquí defines los datos para la tabla
    const data = {
        Recibidas: 0,
        Asignadas: 0,
        Diagnosticadas: 0,
        Completadas: 0,
        Desclinadas: 0,
        Total: 0
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-center text-black mb-4">Solicitudes</h2>
            <table className="w-full text-black text-left border-collapse bg-white">
                <thead>
                    <tr>
                        <th className="border-b border-black px-4 py-2">Estado</th>
                        <th className="border-b border-black px-4 py-2">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Recibidas</td>
                        <td className="border-b border-black px-4 py-2">{data.Recibidas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Asignadas</td>
                        <td className="border-b border-black px-4 py-2">{data.Asignadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Diagnosticadas</td>
                        <td className="border-b border-black px-4 py-2">{data.Diagnosticadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Completadas</td>
                        <td className="border-b border-black px-4 py-2">{data.Completadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Desclinadas</td>
                        <td className="border-b border-black px-4 py-2">{data.Desclinadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Total</td>
                        <td className="border-b border-black px-4 py-2">{data.Total}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TablaVistaOrden;
