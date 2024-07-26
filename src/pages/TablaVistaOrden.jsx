import React from 'react';

const TablaVistaOrden = ({ data }) => {
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
                        <td className="border-b border-black px-4 py-2">{data.recibidas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Asignadas</td>
                        <td className="border-b border-black px-4 py-2">{data.asignadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Diagnosticadas</td>
                        <td className="border-b border-black px-4 py-2">{data.diagnosticadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Completadas</td>
                        <td className="border-b border-black px-4 py-2">{data.completadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Desclinadas</td>
                        <td className="border-b border-black px-4 py-2">{data.declinadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Total</td>
                        <td className="border-b border-black px-4 py-2">{data.total}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TablaVistaOrden;
