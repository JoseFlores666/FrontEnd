import React, { useMemo, useEffect, useState } from 'react';
import { Th } from '../../components/ui/Th';

export const TablaResumenEstados = ({ data, estados }) => {
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [estadoCounts, setEstadoCounts] = useState({});
    const [years, setYears] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });

    useEffect(() => {
        if (estados && estados.length > 0) {
            const estadoMap = {};
            estados.forEach(estado => {
                estadoMap[estado.nombre] = estado.cantidadTotal;
            });
            setEstadoCounts(estadoMap);
        }
    }, [estados]);

    useEffect(() => {
        const uniqueYears = new Set();
        data.forEach(solicitud => {
            const solicitudYear = new Date(solicitud.fecha || solicitud.informe.fecha).getFullYear();
            uniqueYears.add(solicitudYear);
        });
        const currentYear = new Date().getFullYear();
        setSelectedYear(currentYear);
        setYears(Array.from(uniqueYears).sort((a, b) => b - a));
    }, [data]);

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

        let rowData = meses.map(mes => {
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
                total,
                fecha: solicitudesMes.length ? new Date(Math.max(...solicitudesMes.map(s => new Date(s.fecha || s.informe.fecha)))) : null
            };
        }).filter(row => row.total > 0);

        // Ordenar según la configuración actual de sortConfig
        rowData = rowData.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return rowData;
    }, [filteredData, estadoCounts, sortConfig]);

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

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="overflow-x-auto bg-gray-100">
            <div className="mb-4 flex items-center justify-center gap-4">
                <label htmlFor="yearFilter" className="block text-gray-700 font-medium">Filtrar por año:</label>
                <select
                    id="yearFilter"
                    className="max-w-48 text-black p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                >
                    <option value="">Todos los años</option>
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <table className="w-full min-w-full divide-y divide-white-200 text-sm text-black rounded-lg text-center">
                <thead className="bg-black text-white">
                    <tr>
                        <Th onClick={() => requestSort('mes')}>Mes</Th>
                        {Object.keys(estadoCounts).map(estado => (
                            <Th key={estado} onClick={() => requestSort(estado)}>{estado}</Th>
                        ))}
                        <Th onClick={() => requestSort('total')}>Total</Th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-3 py-1 border-b text-gray-700">{row.mes}</td>
                            {Object.keys(estadoCounts).map(estado => (
                                <td key={estado} className="px-3 py-1 border-b text-center text-gray-700">{row[estado] || 0}</td>
                            ))}
                            <td className="px-3 py-1 border-b text-center font-bold text-gray-700">{row.total}</td>
                        </tr>
                    ))}
                    <tr className="bg-gray-200 font-bold">
                        <td className="px-3 py-1 border-b text-gray-800">Totales</td>
                        {Object.keys(estadoCounts).map(estado => (
                            <td key={estado} className="px-3 py-1 border-b text-center text-gray-800">{totals[estado] || 0}</td>
                        ))}
                        <td className="px-3 py-1 border-b text-center font-bold text-gray-800">{totals['total']}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
