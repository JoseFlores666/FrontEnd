import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from '../../context/SolicitudContext';
import { ImFileEmpty } from "react-icons/im";
import Swal from "sweetalert2";
import { Card, Message, Button, Input, Label, Title } from "../../components/ui";


export const ProjectAndActManager = () => {
    const [newProject, setNewProject] = useState('');
    const [newActivities, setNewActivities] = useState([{ nombre: '', descripcion: '' }]);

    const [newActivity, setNewActivity] = useState({ nombre: '', descripcion: '' });
    const [editingActivity, setEditingActivity] = useState({ index: null, nombre: '', descripcion: '' });
    const [idActivity, setIdActivity] = useState({ index: null, nombre: '', descripcion: '' });
    const [editingProject, setEditingProject] = useState({ index: null, nombre: '', actividades: [], id: "" });
    const [expandedProjectIndex, setExpandedProjectIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [projectId, setProjectId] = useState("");

    const [selectedActivities, setSelectedActivities] = useState([]);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
    const [modalView, setModalView] = useState('create');

    const [mostrarModalProyecto, setMostrarModalProyecto] = useState(false);
    const [vistaModal, setVistaModal] = useState('editarProyecto');
    const [editarProyect, setEditarProyect] = useState('');



    const { traerActividades, traerProyectos, crearProyecto, eliminarProyecto, proyectAsignarActividades,
        errors: ProyectActErr, misProyectos = [], crearActYasignarProyect, editarMyProyect,
        traeMyProyecActividades, miProyectoAct, desasignarActProyect,
        misActividades = [], crearActividad, eliminarActividad, actualizarAct, traerActSinAsignar,
        actSinAsignar, } = useSoli();

    const [datosCargados, setDatosCargados] = useState(false);
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        const iniciarDatos = async () => {
            try {
                await traerActividades();
                await traerProyectos();
                await traerActSinAsignar();
                setLoading(true)
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al cargar los datos", error);
                Swal.fire("Error del servidor ", "Error al intentar consultar en el servidor ", "info");
            }
        }
        if (!datosCargados) {
            iniciarDatos();
        }
    }, [traerActividades, traerProyectos, datosCargados]);

    // Funciones para manejar Actividades
    const CrearNuevaActividad = async () => {
        if (newActivity.nombre.trim() && newActivity.descripcion.trim()) {
            try {

                const res = await crearActividad(newActivity);
                if (res && res.data?.mensaje) {
                    Swal.fire("Datos guardados", res.data?.mensaje, "success");
                    setDatosCargados(false);
                } else {
                    Swal.fire("Error", res?.error || "Error desconocido", "error");
                }
            } catch (error) {
                Swal.fire("Error de servidor", "Error al crear su actividad ", "info");
            }
            setNewActivity({ nombre: '', descripcion: '' });
        } else {
            Swal.fire("Informativo", "Llena el campo", "info");
        }
    };
    const updateActivity = async () => {
        try {
            console.log()
            const res = await actualizarAct(idActivity, editingActivity);
            if (res && res.data?.mensaje) {
                Swal.fire("Datos actualizados", res.data?.mensaje, "success");
                setEditingActivity(null);
                setIsModalOpen(false);
                setDatosCargados(false);
            } else {
                Swal.fire("Error", res.data?.error || "Error desconocido", "error");
            }
        } catch (error) {
            console.error("Error al actualizar la actividad", error);
            Swal.fire("Error de servidor", "Error al actualizar su actividad", "info");
        }
    };
    const deleteActivity = (index, id) => {
        console.log(id)
        if (index !== null) {
            eliminarActividad(id)
            setEditingActivity({ index: null, nombre: '', descripcion: '' });
            setDatosCargados(false);
        }
    };
    const openEditModal = (activity, id) => {
        setEditingActivity(activity);
        setIdActivity(id)
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingActivity(null);
        setIsModalOpen(false);
    };

    // Funciones para manejar Proyectos
    const addProject = async () => {
        if (newProject.trim()) {
            try {
                console.log(newProject)
                const res = await crearProyecto(newProject)
                if (res && res.data?.mensaje) {
                    Swal.fire("Proyecto creado con exito", res.data?.mensaje, "success")
                    setDatosCargados(false);
                } else {
                    Swal.fire("Ups, Ocurrio un error", res.data?.error || "Error desconocido", "error")
                }
            } catch (error) {
                console.error("Error al crear su proyecto", error);
                Swal.fire("Error de servidor", "Error al crear su proyecto", "error");
            }
            setNewProject('');
        }
        else {
            Swal.fire("Informativo", "proyecto no ingresado favor de intentar de nuevo", "info");
        }
    };

    const deleteProject = async (index, id) => {
        if (index !== null && id !== null) {
            try {
                const res = await eliminarProyecto(id)
                console.log(res)
                if (res && res.data?.mensaje) {
                    Swal.fire("Proyecto eliminado con exito", res.data?.mensaje, "success")
                    setDatosCargados(false);
                } else {
                    Swal.fire("Ups, Ocurrio un error", res.data?.error || "Error desconocido", "error")
                }
            } catch (error) {
                Swal.fire("Error de servidor", "Error al eliminar su proyecto", "info");
            }

        } else {
            Swal.fire("Informativo", "proyecto no selecionado favor de intentar de nuevo", "info");
        }
    };

    const toggleProjectActivities = (index) => {
        setExpandedProjectIndex(expandedProjectIndex === index ? null : index);
    };

    const addActivityField = () => {
        setNewActivities([...newActivities, { nombre: '', descripcion: '' }]);
    };

    const handleActivityChange = (index, field, value) => {
        const updatedActivities = [...newActivities];
        updatedActivities[index][field] = value;
        setNewActivities(updatedActivities);
    };

    const removeActivityField = (index) => {
        if (newActivities.length > 1) {
            const updatedActivities = newActivities.filter((_, i) => i !== index);
            setNewActivities(updatedActivities);
        }
        setNewActivities([{ nombre: '', descripcion: '' }]);
    };

    const CrearNuevasActividades = async () => {
        if (newActivities.length > 0) {
            console.log('Creating new activities:', newActivities);
            try {
                const res = await crearActYasignarProyect(projectId, newActivities);
                if (res && res.data?.mensaje) {
                    Swal.fire("Actividades creadas y asignadas con exito", res.data?.mensaje, "success")
                    setDatosCargados(false);
                } else {
                    Swal.fire("Ups, Ocurrio un error", res.data?.error || "Error desconocido", "error")
                }
            } catch (error) {
                Swal.fire("Error de servidor", "Error al  crear y/o asignarla a su proyecto", "info");
            }

            setNewActivities([{ nombre: '', descripcion: '' }]);
        } else {
            Swal.fire("Informativo", "Llenar el campo", "info");
        }
    }

    const assignAcvitiesToProject = async () => {
        if (selectedActivities.length > 0) {
            try {

                const res = await proyectAsignarActividades(projectId, selectedActivities)
                if (res && res.data?.mensaje) {
                    Swal.fire("Actividades asignadas", res.data?.mensaje, "success");
                    setDatosCargados(false);
                    setSelectedActivities([])
                    closeActivityModal()
                } else {
                    Swal.fire("Error", res.data?.error || "Error desconocido", "error");
                }
            } catch (error) {
                console.error("Error al asignar las actividades", error);
                Swal.fire("Error de servidor", "Error al asignar las actividades", "error");
            }
        } else {
            Swal.fire("Informativo", "Por favor seleccione algún proyecto", "info");
        }
    };


    const toggleActivitySelection = (activityId) => {
        const isSelected = selectedActivities.includes(activityId);
        if (isSelected) {
            // Si la actividad ya está seleccionada, desmarcarla
            setSelectedActivities(selectedActivities.filter(id => id !== activityId));
        } else {
            // Si la actividad no está seleccionada, marcarla
            setSelectedActivities([...selectedActivities, activityId]);
        }
    };

    const openActivityModal = (index) => {
        setSelectedProjectIndex(index);
        setShowActivityModal(true);
        setModalView('create'); // Por defecto, mostrar la vista para crear nueva actividad
    };

    const closeActivityModal = () => {
        setShowActivityModal(false);
        setModalView('create'); // Restablecer vista al cerrar el modal
    };

    // Función para abrir el modal
    const abrirModalProyecto = async (projectId) => {
        try {
            await traeMyProyecActividades(projectId)

        } catch (error) {
            Swal.fire("Error de servidor", "Error al  actualizar su proyecto", "info");
        } finally {
            setEditarProyect(false); // Cambia el estado de carga a falso después de la carga
            setMostrarModalProyecto(true);
        }
    };
    const desasignarActividadDelProyecto = async (actividadId, projectId) => {
        try {
            console.log(actividadId)
            const res = await desasignarActProyect(projectId, actividadId);
            if (res && res.data?.mensaje) {
                Swal.fire("Actividades desasignada", res.data?.mensaje, "success");
                await traeMyProyecActividades(projectId)
                setDatosCargados(false);
                await traerActSinAsignar();
            } else {
                Swal.fire("Error", res.data?.error || "Error desconocido", "error");
            }
        } catch (error) {
            console.error("Error al desasignar la actividad", error);
            Swal.fire("Error de servidor", "Error al desasignar la actividad", "error");
        }

    };

    // Función para asignar una actividad al proyecto
    const asignarActividadAlProyecto = async (actividadId) => {
        if (actividadId.length > 0) {
            try {
                console.log(projectId)
                const res = await proyectAsignarActividades(projectId, actividadId)
                if (res && res.data?.mensaje) {
                    Swal.fire("Actividad asignadad", res.data?.mensaje, "success");
                    await traeMyProyecActividades(projectId)
                    setDatosCargados(false);
                    await traerActSinAsignar();
                } else {
                    Swal.fire("Error", res.data?.error || "Error desconocido", "error");
                }
            } catch (error) {
                console.error("Error al asignar la actividad", error);
                Swal.fire("Error de servidor", "Error al asignar la actividad", "error");
            }
        } else {
            Swal.fire("Informativo", "Por favor seleccione alguna actividad", "info");
        }
    }

    // Función para cerrar el modal
    const cerrarModalProyecto = () => {
        setMostrarModalProyecto(false);

        setVistaModal('editarProyecto'); // Resetear la vista al cerrar
    };

    // Función para manejar el cambio en el nombre del proyecto
    const manejarCambioNombreProyecto = (e) => {
        setEditingProject(prevState => ({
            ...prevState,
            nombre: e.target.value
        }));
    };

    // Función para manejar la actualización del proyecto
    const manejarActualizacionProyecto = async (projectId) => {
        if (editingProject.nombre.trim()) {
            try {

                const res = await editarMyProyect(projectId, editingProject.nombre);// Asegúrate de enviar un objeto
                if (res && res.data?.mensaje) {
                    Swal.fire("Proyecto Actualizado", res.data?.mensaje, "success");
                    setDatosCargados(false);
                } else {
                    Swal.fire("Error", res.data?.error || "Error desconocido", "error");
                }
            } catch (error) {
                Swal.fire("Error de servidor", "Error al actualizar su proyecto", "error");
            }
            cerrarModalProyecto();
        } else {
            Swal.fire("Informativo", "El nombre del proyecto no puede estar vacío", "info");
        }
    };



    if (!loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center mt-50 text-cool-gray-50 font-bold">
                    <div className="mb-4">Cargando...</div>
                    <ImFileEmpty className="animate-spin text-purple-50-500 text-6xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl p-4 text-black">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <Title showBackButton={true}>Gestión De Proyectos y Actividades</Title>
                <div>
                    <h2 className="text-xl font-bold mb-4">Ver Proyectos con Actividades</h2>
                    <table className="w-full caption-bottom text-sm border">
                        <thead className="[&_tr]:border border-gray-400">
                            <tr className="border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                <th className="h-12 text-center px-4 align-middle font-medium text-black border-gray-400">Nombre del Proyecto</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-black border-gray-400">Mostrar/Ocultar Actividades</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 border-b border-r border-l border-gray-400">
                            {misProyectos.map((project, index) => (
                                <React.Fragment key={index}>
                                    <tr
                                        className={`border-b transition-colors ${expandedProjectIndex === index ? 'bg-verde-palido' : 'hover:bg-muted/50'
                                            } border-gray-400`}
                                    >
                                        <td className="align-middle border border-gray-400 px-4 text-center">
                                            {project.nombre}
                                        </td>
                                        <td className="align-middle border border-gray-400 px-4 text-center">
                                            <button
                                                onClick={() => toggleProjectActivities(index)}
                                                className="bg-blue-600 text-white py-1 px-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                            >
                                                {expandedProjectIndex === index ? 'Ocultar Actividades' : 'Mostrar Actividades'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedProjectIndex === index && project.actividades && (
                                        <tr>
                                            <td colSpan={2} className="border border-gray-400">
                                                <table
                                                    className="w-full text-sm border-t border-gray-400"
                                                >
                                                    <thead>
                                                        <tr className="bg-gray-200 border">
                                                            <th className="px-4 py-2 text-center">Actividades asignadas</th>
                                                            <th className="px-4 py-2 text-center">Descripción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {project.actividades.map((activity, i) => (
                                                            <tr
                                                                key={i}
                                                                className={`border-b transition-colors ${expandedProjectIndex === index ? 'bg-verde-clarito border border-white' : 'hover:bg-muted/50'
                                                                    }`}
                                                            >
                                                                <td className="text-center text-black px-4 py-2">
                                                                    {activity.nombre}
                                                                </td>
                                                                <td className="text-center px-4 py-2">
                                                                    {activity.descripcion}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tabla de Proyectos */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Proyectos</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Nombre del proyecto"
                            value={newProject}
                            onChange={(e) => setNewProject(e.target.value)}
                            className="border p-2 rounded-lg mr-2"
                        />
                        <button
                            onClick={addProject}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Agregar Proyecto
                        </button>
                    </div>
                    <table className="w-full caption-bottom text-sm border">
                        <thead className="[&_tr]:border border-gray-400">
                            <tr className="border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                <th className="h-12 text-center px-4 align-middle font-medium text-black border-gray-400">Nombre del Proyecto</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-black border-gray-400">Actividades No Asignadas</th>
                                <th className="h-12 px-4 align-middle font-medium text-black border-gray-400">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 border-b border-r border-l border-gray-400">
                            {misProyectos.map((project, index) => (
                                <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                    <td className="align-middle border border-gray-400 px-4 text-center">{project.nombre}</td>
                                    <td className="align-middle border border-gray-400 px-4 text-center">

                                        <button
                                            onClick={() => {
                                                openActivityModal(index)
                                                    , setProjectId(project._id)
                                            }}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Asignar Actividades
                                        </button>

                                    </td>
                                    <td className="align-middle border border-gray-400">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingProject({ index, nombre: project.nombre, actividades: project.actividades, id: project._id })
                                                        , setProjectId(project._id),
                                                        abrirModalProyecto(project._id)
                                                }}
                                                className="text-blue-500 hover:text-blue-700 p-2 rounded-lg"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                onClick={() => deleteProject(index, project._id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-lg"
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {showActivityModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                            <div className="mb-4 flex border-b border-gray-200">
                                <button
                                    onClick={() => setModalView('create')}
                                    className={`flex-1 py-2 px-4 rounded-l-lg font-semibold ${modalView === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    Crear Nueva Actividad
                                </button>
                                <button
                                    onClick={() => setModalView('assign')}
                                    className={`flex-1 py-2 px-4 rounded-r-lg font-semibold ${modalView === 'assign' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    Asignar Actividades
                                </button>
                            </div>
                            <div className="mt-4">
                                {modalView === 'create' ? (
                                    <div className="h-96 overflow-y-auto p-4 border border-gray-300 rounded-lg">

                                        <h3 className="text-lg font-bold mb-4">Agregar Nuevas Actividades</h3>
                                        {newActivities.map((activity, index) => (
                                            <div key={index} className="mb-4 border p-4 rounded-lg shadow-sm">
                                                <h4 className="text-md font-semibold mb-2">Actividad {index + 1}</h4>
                                                <input
                                                    type="text"
                                                    placeholder="Nombre de la nueva actividad"
                                                    value={activity.nombre}
                                                    onChange={(e) => handleActivityChange(index, 'nombre', e.target.value)}
                                                    className="border p-2 rounded-lg mb-2 w-full"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Descripción de la nueva actividad"
                                                    value={activity.descripcion}
                                                    onChange={(e) => handleActivityChange(index, 'descripcion', e.target.value)}
                                                    className="border p-2 rounded-lg mb-2 w-full"
                                                />
                                                <button
                                                    onClick={() => removeActivityField(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={addActivityField}
                                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 mb-2"
                                        >
                                            Agregar Otro Campo
                                        </button>
                                        <div>
                                            <button
                                                onClick={closeActivityModal}
                                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                                            >
                                                Cerrar
                                            </button>
                                            <button
                                                onClick={CrearNuevasActividades}
                                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                            >
                                                Crear Actividades
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">Asignar Actividades al Proyecto</h3>
                                        <div className="max-h-60 overflow-y-auto mb-4">
                                            {Array.isArray(actSinAsignar) && actSinAsignar.map((activity, index) => (
                                                <div key={activity._id} className="flex items-center mb-2 border p-2 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300">
                                                    <input
                                                        type="checkbox"
                                                        id={`activity-${index}`}
                                                        checked={selectedActivities.includes(activity._id)}
                                                        onChange={() => toggleActivitySelection(activity._id)}
                                                        className="mr-3"
                                                    />
                                                    <label htmlFor={`activity-${index}`} className="text-gray-700 font-medium">{activity.nombre}</label>
                                                    <span className="text-gray-500 text-sm ml-2">- {activity.descripcion}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={closeActivityModal}
                                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                                            >
                                                Cerrar
                                            </button>
                                            <button
                                                onClick={() => assignAcvitiesToProject()}
                                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                            >
                                                Asignar Actividades
                                            </button>
                                        </div>
                                    </div>

                                )}
                                <button
                                    onClick={closeActivityModal}
                                    className="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
                                >
                                    <FontAwesomeIcon icon={faTimes} size="xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {mostrarModalProyecto && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div
                            className={`bg-white p-6 rounded-lg shadow-lg w-full relative transition-all duration-300 ${vistaModal === 'editarProyecto' ? 'max-w-md' : 'max-w-4xl'
                                }`}
                        >
                            <div className="mb-4 flex border-b border-gray-200">
                                <button
                                    onClick={() => setVistaModal('editarProyecto')}
                                    className={`flex-1 py-2 px-4 rounded-l-lg font-semibold ${vistaModal === 'editarProyecto' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    Editar Proyecto
                                </button>
                                <button
                                    onClick={() => setVistaModal('editarProyectoYActividad')}
                                    className={`flex-1 py-2 px-4 rounded-r-lg font-semibold ${vistaModal === 'editarProyectoYActividad' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    Reasignar actividades
                                </button>
                            </div>
                            <div className="mt-4">
                                {vistaModal === 'editarProyecto' ? (
                                    editingProject ? (
                                        <div>

                                            <h3 className="text-lg font-bold mb-4">Editar Proyecto</h3>
                                            <input
                                                type="text"
                                                placeholder="Nombre del proyecto"
                                                value={editingProject.nombre}
                                                onChange={manejarCambioNombreProyecto}
                                                className="border p-2 rounded-lg mb-4 w-full"
                                            />
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={cerrarModalProyecto}
                                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                                                >
                                                    Cerrar
                                                </button>
                                                <button
                                                    onClick={() => manejarActualizacionProyecto(miProyectoAct._id)}
                                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                                >
                                                    Guardar Cambios
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-red-500">No hay datos del proyecto.</p>
                                    )
                                ) : (
                                    <div className="flex justify-between space-x-4">
                                        {/* Columna de Actividades Asignadas */}
                                        <div className="w-1/2">
                                            <h3 className="text-lg font-bold mb-4">Actividades Asignadas</h3>
                                            <div className="max-h-96 overflow-y-auto border p-4 rounded-lg shadow-sm">
                                                {Array.isArray(miProyectoAct.actividades) && miProyectoAct.actividades.length > 0 ? (
                                                    miProyectoAct.actividades.map((actividad, index) => (
                                                        <div key={actividad._id} className="mb-4 p-2 rounded-lg flex justify-between items-center">
                                                            <div>
                                                                <p className="font-semibold">{actividad.nombre}</p>
                                                                <p className="text-gray-600">{actividad.descripcion}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => desasignarActividadDelProyecto(actividad._id, miProyectoAct._id)
                                                                } className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300"
                                                            >
                                                                Desasignar
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-red-500">No hay actividades asignadas.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Columna de Actividades Sin Asignar */}
                                        <div className="w-1/2">
                                            <h3 className="text-lg font-bold mb-4">Actividades Sin Asignar</h3>
                                            <div className="max-h-96 overflow-y-auto border p-4 rounded-lg shadow-sm">
                                                {Array.isArray(actSinAsignar) && actSinAsignar.length > 0 ? (
                                                    actSinAsignar.map((actividad, index) => (
                                                        <div key={actividad._id} className="mb-4 p-2 rounded-lg flex justify-between items-center">
                                                            <div>
                                                                <p className="font-semibold">{actividad.nombre}</p>
                                                                <p className="text-gray-600">{actividad.descripcion}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => asignarActividadAlProyecto(actividad._id)}
                                                                className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition duration-300"
                                                            >
                                                                Asignar
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-red-500">No hay actividades sin asignar.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={cerrarModalProyecto}
                                    className="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
                                >
                                    <FontAwesomeIcon icon={faTimes} size="xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Tabla de Actividades */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Actividades</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Nombre de la actividad"
                            value={newActivity.nombre}
                            onChange={(e) => setNewActivity({ ...newActivity, nombre: e.target.value })}
                            className="border p-2 rounded-lg mr-2"
                        />
                        <input
                            type="text"
                            placeholder="Descripción de la actividad"
                            value={newActivity.descripcion}
                            onChange={(e) => setNewActivity({ ...newActivity, descripcion: e.target.value })}
                            className="border p-2 rounded-lg mr-2"
                        />
                        <button
                            onClick={CrearNuevaActividad}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Agregar Actividad
                        </button>
                    </div>
                    <table className="w-full caption-bottom text-sm border">
                        <thead className="[&_tr]:border border-gray-400">
                            <tr className="border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                <th className="h-12 text-center px-4 align-middle font-medium text-black border-gray-400">Nombre</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-black border-gray-400">Descripción</th>
                                <th className="h-12 px-4 align-middle font-medium text-black border-gray-400">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 border-b border-r border-l border-gray-400">
                            {Array.isArray(misActividades) && misActividades.map((activity, index) => (
                                <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                    <td className="align-middle border border-gray-400 px-4 text-center">{activity.nombre}</td>
                                    <td className="align-middle border border-gray-400 px-4 text-center">{activity.descripcion}</td>
                                    <td className="align-middle border border-gray-400">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => openEditModal({ index, nombre: activity.nombre, descripcion: activity.descripcion, }, activity._id)}
                                                className="text-blue-500 hover:text-blue-700 p-2 rounded-lg"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                onClick={() => deleteActivity(index, activity._id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-lg"
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Modal de Edición */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h2 className="text-xl font-bold mb-4">Editar Actividad</h2>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={editingActivity?.nombre || ''}
                                onChange={(e) => setEditingActivity({ ...editingActivity, nombre: e.target.value })}
                                className="border p-2 rounded-lg mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Descripción"
                                value={editingActivity?.descripcion || ''}
                                onChange={(e) => setEditingActivity({ ...editingActivity, descripcion: e.target.value })}
                                className="border p-2 rounded-lg mb-4 w-full"
                            />
                            <div className="flex justify-between">
                                <button
                                    onClick={updateActivity}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={closeEditModal}
                                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {Array.isArray(ProyectActErr) && ProyectActErr.map((error, i) => (
                    <Message message={error} key={i} />
                ))}
            </div>
        </div>
    );
};
