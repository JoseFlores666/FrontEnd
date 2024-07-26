import React from 'react';

const TablaVistaSolicitud = ({ data }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-black">Solicitudes</h2>
            <table className="text-black w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border-b border-black px-4 py-2">Estado</th>
                        <th className="border-b border-black px-4 py-2">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Nuevas</td>
                        <td className="border-b border-black px-4 py-2">{data.nuevas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Asignadas</td>
                        <td className="border-b border-black px-4 py-2">{data.asignadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Pendientes</td>
                        <td className="border-b border-black px-4 py-2">{data.pendientes}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Completadas</td>
                        <td className="border-b border-black px-4 py-2">{data.completadas}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-black px-4 py-2">Rechazadas</td>
                        <td className="border-b border-black px-4 py-2">{data.rechazadas}</td>
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

export default TablaVistaSolicitud;
