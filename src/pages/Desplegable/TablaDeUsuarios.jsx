import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Title } from '../../components/ui'
import '../../css/Animaciones.css'
export const TablaDeUsuarios = () => {

    const [datosCargados, setDatosCargados] = useState(false);

    const { traerUsuarios, usuarios, user } = useAuth();

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                await traerUsuarios();
                setDatosCargados(true);
            } catch (error) {
                console.error('Error fetching usuarios:', error);
            }
        };
        if (!datosCargados) {
            cargarUsuarios();
        }
    }, [traerUsuarios, datosCargados]);

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            <div className="slide-down">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <Title showBackButton={true} >Lista de Usuarios</Title>
                    <div className="  p-6 text-black rounded-md shadow-md overflow-x-auto">
                        {usuarios.length > 0 ? (
                            <table className="w-full caption-bottom text-sm border">
                                <thead className="[&_tr]:border border-gray-400">
                                    <tr className="border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                        <th className="h-12 text-center px-3 align-middle font-medium text-black border-gray-400">
                                            id
                                        </th>
                                        <th className="h-12 text-center px-3 align-middle font-medium text-black border-gray-400">
                                            Username
                                        </th>
                                        <th className="h-12 text-center px-3 align-middle font-medium text-black border-gray-400">
                                            Email
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 border-b border-r border-l border-gray-400">
                                    {usuarios.map((usuario, index) => {
                                        const isCurrentUser = usuario.username === user.username && usuario.email === user.email;
                                        return (
                                            <tr key={index} className={`hover:bg-gray-100  border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400 ${isCurrentUser ? 'bg-green-100' : ''}`}>
                                            <td className="p-2 align-middle border text-center border-gray-400">
                                                    {index + 1}
                                                </td>
                                                <td className="p-2 align-middle border text-center border-gray-400">
                                                    {usuario.username}
                                                </td>
                                                <td className="p-2 align-middle border text-center border-gray-400">
                                                    {usuario.email}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-600 py-4">No se encontraron usuarios.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
