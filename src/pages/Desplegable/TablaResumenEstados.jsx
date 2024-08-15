import React, { useMemo, useEffect, useState } from 'react';

export const TablaResumenEstados = ({ data, estados }) => {
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [estadoCounts, setEstadoCounts] = useState({});

    useEffect(() => {
        // Actualiza los conteos de estados a partir de la prop `estados`
        if (estados && estados.length > 0) {
            const estadoMap = {};
            estados.forEach(estado => {
                estadoMap[estado.nombre] = estado.cantidadTotal;
            });
            setEstadoCounts(estadoMap);
        }
    }, [estados]);

    useEffect(() => {
        let yearFilteredData = data;

        if (selectedYear) {
            yearFilteredData = data.filter(solicitud => {
                const solicitudYear = new Date(solicitud.fecha || solicitud.informe.fecha).getFullYear();
                return solicitudYear === parseInt(selectedYear, 10);
            });
        }

        setFilteredData(yearFilteredData);
    }, [selectedYear, data]);

    const rows = useMemo(() => {
        if (!filteredData) return [];
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        return meses.map(mes => {
            const solicitudesMes = filteredData.filter(solicitud => {
                const solicitudMes = new Date(solicitud.fecha || solicitud.informe.fecha).toLocaleString('es-ES', { month: 'long' });
                return solicitudMes.toLowerCase() === mes;
            });

            const recibidaCounts = solicitudesMes.reduce((acc, solicitud) => {
                const estado = solicitud.estado?.nombre || solicitud.informe?.estado?.nombre;
                if (estadoCounts[estado] !== undefined) {
                    acc[estado] = (acc[estado] || 0) + 1;
                }
                return acc;
            }, {});

            const total = Object.values(recibidaCounts).reduce((sum, count) => sum + count, 0);

            return {
                mes,
                ...recibidaCounts,
                total
            };
        }).filter(row => row.total > 0); // Filtra los meses vacíos
    }, [filteredData, estadoCounts]);

    const totals = useMemo(() => {
        const totalObj = {};

        rows.forEach(row => {
            Object.keys(row).forEach(key => {
                if (key !== 'mes' && key !== 'total') {
                    totalObj[key] = (totalObj[key] || 0) + row[key];
                }
            });
        });

        totalObj['total'] = rows.reduce((sum, row) => sum + row.total, 0);

        return totalObj;
    }, [rows]);

    return (
        <div className="overflow-x-auto p-4 bg-gray-100">
            <div className="mb-4 flex items-center gap-4">
                <label htmlFor="yearFilter" className="block text-gray-700 font-medium">Filtrar por año:</label>
                <input
                    type="number"
                    id="yearFilter"
                    min={2000}
                    className="w-full text-black p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ingrese el año"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                />
            </div>
            <table className="w-full min-w-full divide-y divide-white-200 text-sm text-black rounded-lg overflow-hidden">
                <thead className="bg-black text-white">
                    <tr>
                        <th className="px-4 py-2 border-b text-left text-white">Mes</th>
                        {Object.keys(estadoCounts).map(estado => (
                            <th key={estado} className="px-4 py-2 border-b text-left text-white">{estado}</th>
                        ))}
                        <th className="px-4 py-2 border-b text-left text-white">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-2 border-b text-gray-700">{row.mes}</td>
                            {Object.keys(estadoCounts).map(estado => (
                                <td key={estado} className="px-4 py-2 border-b text-center text-gray-700">{row[estado] || 0}</td>
                            ))}
                            <td className="px-4 py-2 border-b text-center font-bold text-gray-700">{row.total}</td>
                        </tr>
                    ))}
                    <tr className="bg-gray-200 font-bold">
                        <td className="px-4 py-2 border-b text-gray-800">Totales</td>
                        {Object.keys(estadoCounts).map(estado => (
                            <td key={estado} className="px-4 py-2 border-b text-center text-gray-800">{totals[estado] || 0}</td>
                        ))}
                        <td className="px-4 py-2 border-b text-center font-bold text-gray-800">{totals['total']}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
