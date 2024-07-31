import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

export const ProjectAndActManager = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState('');
    const [activeProject, setActiveProject] = useState(null);
    const [activities, setActivities] = useState({});
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [newActivity, setNewActivity] = useState('');
    const [editingActivity, setEditingActivity] = useState({ project: null, index: null, text: '' });

    const openProjectModal = () => setIsProjectModalOpen(true);
    const closeProjectModal = () => setIsProjectModalOpen(false);
    const openActivityModal = (project) => {
        setSelectedProject(project);
        setIsActivityModalOpen(true);
    };
    const closeActivityModal = () => setIsActivityModalOpen(false);

    const addProject = () => {
        if (newProject.trim() && !projects.includes(newProject)) {
            setProjects([...projects, newProject]);
            setActivities({ ...activities, [newProject]: [] });
            setNewProject('');
            closeProjectModal();
        }
    };

    const addActivityToProject = () => {
        if (newActivity.trim() && selectedProject) {
            setActivities({
                ...activities,
                [selectedProject]: [...(activities[selectedProject] || []), newActivity]
            });
            setNewActivity('');
            closeActivityModal();
        }
    };

    const editActivityInProject = () => {
        const { project, index, text } = editingActivity;
        if (text.trim() && project != null && index != null) {
            const updatedActivities = [...(activities[project] || [])];
            updatedActivities[index] = text;
            setActivities({ ...activities, [project]: updatedActivities });
            setEditingActivity({ project: null, index: null, text: '' });
        }
    };

    const handleDeleteProject = (projectToDelete) => {
        setProjects(projects.filter(project => project !== projectToDelete));
        const newActivities = { ...activities };
        delete newActivities[projectToDelete];
        setActivities(newActivities);
        if (activeProject === projectToDelete) {
            setActiveProject(null);
        }
    };

    const handleDeleteActivity = (project, activityIndex) => {
        const updatedActivities = activities[project].filter((_, index) => index !== activityIndex);
        setActivities({ ...activities, [project]: updatedActivities });
    };

    const handleEditActivity = (project, activityIndex) => {
        setEditingActivity({ project, index: activityIndex, text: activities[project][activityIndex] });
        setIsActivityModalOpen(true);
    };

    return (
        <div className="mx-auto max-w-7xl p-4 text-black">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-center text-black">Gestión De Proyectos y Actividades</h2>
                </div>
                <div className='flex items-center justify-center'>
                    <button
                        onClick={openProjectModal}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Agregar Proyecto
                    </button>
                </div>
                <ul className="">
                    {projects.map((project, index) => (
                        <li key={index} className="rounded-lg p-4 bg-gray-50">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setActiveProject(project === activeProject ? null : project)}
                            >
                                <div className="flex-1 border border-gray-500 text-black bg-white-500 p-2 rounded-lg hover:bg-white-600">
                                    {project}
                                </div>
                                <div className="flex-shrink-0 ml-2 flex space-x-1">
                                    <button
                                        onClick={() => openActivityModal(project)}
                                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                                    >
                                        Asignar Actividades
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProject(project)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-lg"
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteActivity(project, idx)}
                                        className="text-blue-500 hover:text-blue-700 p-2 rounded-lg"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </div>
                            </div>
                            {activeProject === project && (
                                <div className="bg-gray-200 p-2">
                                    <h3 className="text-lg font-semibold">Actividades:</h3>
                                    <ul>
                                        {activities[project] && activities[project].map((activity, idx) => (
                                            <li key={idx} className="flex items-center hover:bg-gray-300 p-1 rounded-lg transition duration-300">
                                                <span className="flex-1">{activity}</span>
                                                <div className="space-x-2">
                                                    <button
                                                        onClick={() => handleEditActivity(project, idx)}
                                                        className="text-blue-500 hover:text-blue-700 p-2 rounded-lg transition duration-300"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteActivity(project, idx)}
                                                        className="text-red-500 hover:text-red-700 p-2 rounded-lg transition duration-300"
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {isProjectModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Agregar Proyecto</h3>
                        <input
                            type="text"
                            value={newProject}
                            onChange={(e) => setNewProject(e.target.value)}
                            placeholder="Nombre del nuevo proyecto"
                            className="border p-2 rounded-lg mb-4 w-full"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={closeProjectModal}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={addProject}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isActivityModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">{editingActivity.project != null ? `Editar Actividad en ${selectedProject}` : `${selectedProject}`}</h3>
                        <input
                            type="text"
                            value={editingActivity.text || newActivity}
                            onChange={(e) => {
                                if (editingActivity.project != null) {
                                    setEditingActivity({ ...editingActivity, text: e.target.value });
                                } else {
                                    setNewActivity(e.target.value);
                                }
                            }}
                            placeholder="Nueva actividad"
                            className="border p-2 rounded-lg mb-4 w-full"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={closeActivityModal}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
                            >
                                Cancelar
                            </button>
                            {editingActivity.project != null ? (
                                <button
                                    onClick={editActivityInProject}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Editar Actividad
                                </button>
                            ) : (
                                <button
                                    onClick={addActivityToProject}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Añadir Actividad
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
