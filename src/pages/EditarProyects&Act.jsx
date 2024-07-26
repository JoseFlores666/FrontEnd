import React, { useState } from 'react';

export const ProjectAndActManager = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState('');
    const [activeProject, setActiveProject] = useState(null);
    const [activities, setActivities] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addProject = () => {
        if (newProject.trim() && !projects.includes(newProject)) {
            setProjects([...projects, newProject]);
            setActivities({ ...activities, [newProject]: [] });
            setNewProject('');
            closeModal();
        }
    };

    const handleAssignActivities = (project) => {
        setActiveProject(project === activeProject ? null : project);
    };

    const addActivityToProject = (activity) => {
        if (activeProject) {
            setActivities({
                ...activities,
                [activeProject]: [...(activities[activeProject] || []), activity]
            });
        }
    };

    return (
        <div className="mx-auto max-w-5xl p-4 text-black">
            <div className="bg-white p-6 rounded-md shadow-md">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-center text-black">Gestión De Proyectos</h2>
                </div>
                <div className='flex items-center justify-center mb-4'>
                    <button
                        onClick={openModal}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Agregar Proyecto
                    </button>
                </div>
                <ul>
                    {projects.map((project, index) => (
                        <li key={index} className="mb-2">
                            <h2 className="block text-sm font-medium mb-1">Proyecto:</h2>
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleAssignActivities(project)}
                                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 text-left flex-1"
                                >
                                    {project}
                                </button>
                                <button className='bg-green-500 hover:bg-green-600 text-left p-2 border border-black rounded'>Asignar Actividades</button>
                                {activeProject === project && (
                                    <div className="ml-4 bg-gray-100 p-2 rounded-md shadow-md w-64">
                                        <ul>
                                            {activities[project] && activities[project].map((activity, idx) => (
                                                <li key={idx} className="py-1 px-2 hover:bg-gray-200">
                                                    {activity}
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    onClick={() => addActivityToProject('Nueva Actividad')}
                                                    className="bg-blue-500 text-white p-1 rounded-md mt-2"
                                                >
                                                    Añadir Actividad
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal para agregar proyecto */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h3 className="text-lg font-bold mb-4">Agregar Proyecto</h3>
                        <input
                            type="text"
                            value={newProject}
                            onChange={(e) => setNewProject(e.target.value)}
                            placeholder="Nombre del nuevo proyecto"
                            className="border p-2 rounded-md mb-4 w-full"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={addProject}
                                className="bg-blue-500 text-white p-2 rounded-md"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
