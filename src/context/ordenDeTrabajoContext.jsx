import { createContext, useContext, useState, useEffect } from "react";
import {
    capturarDiagnostico,
    createInfome,
    deleteInfome,
    editarEstadoInforme,
    evaluacionDelInfome,
    getImagenInfome,
    getInfome,
    getTecnicos,
    getUnaInfome,
    llenadoDEPInforme,
    updateInfome,
    actualizarEstadosOrdenTrabajo,
    crearEstadosOrdenTrabajo, declinarSoliOrdenTrabajo,
    getCantidadTotalOrdenTrabajoEstados,
    getEstadosOrdenTrabajo,
    createTecnico, deleteTecnico,
    getTecnicoPorId, getTecnicosPorInforme,
    updateTecnico,
} from "../api/informe";

import { gethistorialOrdenTrabajo } from '../api/historialInput'
import { getfolioInternoInforme } from '../api/folio'

const OrdenTrabajoContext = createContext();

export const useOrden = () => {
    const contexto = useContext(OrdenTrabajoContext);
    if (!contexto) throw new Error("useOrden debe ser utilizado dentro de un OrdenTrabajoContexto");
    return contexto;
};

export const OrdenDeTrabajoProvider = ({ children }) => {
    const [errores, setErrores] = useState([]);
    const [informes, setInformes] = useState([]);
    const [filtrarInforme, setfiltrarInforme] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [unTecnicos, setUnTecnicos] = useState([]);
    const [unTecnicoinfo, setUnTecnicoinfo] = useState([]);
    const [estados, setEstados] = useState([]);
    const [unaInfo, setUnaInfo] = useState([]);
    const [imagenInfo, setImagenInfo] = useState([]);
    const [encabezado, setEncabezado] = useState([]);
    const [historialOrden, setHistorialOrden] = useState([]);
    const [miFolioInternoInfo, setMiFolioInternoInfo] = useState([]);
    const [estadosTotales, setEstadosTotales] = useState([]);

    const traerOrdenesDeTrabajo = async () => {
        try {
            const res = await getInfome();
            console.log(res)
            setInformes(res.data);
        } catch (error) {
            console.error("Error al traer informes:", error);
            setErrores(prevErrores => [...prevErrores, "Error al traer informes"]);
        }
    };
    const traerFiltrarInformesEstado = async (mesAnioIdestado) => {
        try {
            const res = await filtrarInformes(mesAnioIdestado);
            console.log(res.data);
            setfiltrarInforme(res.data);
        } catch (error) {
            console.error("Error al traer informes:", error);
            setErrores(prevErrores => [...prevErrores, "Error al traer informes"]);
        }
    };

    const crearOrdenTrabajo = async (info) => {
        try {
            const respuesta = await createInfome(info);
            setInformes([...informes, respuesta.data]);
        } catch (error) {
            console.error("Error al crear informe:", error);
            setErrores(prevErrores => [...prevErrores, "Error al crear informe"]);
        }
    };

    const eliminarOrdenTrabajo = async (id) => {
        try {
            await deleteInfome(id);
            setInformes(informes.filter(informe => informe._id !== id));
        } catch (error) {
            console.error("Error al eliminar informe:", error);
            setErrores(prevErrores => [...prevErrores, "Error al eliminar informe"]);
        }
    };

    const actualizarOrdenTrabajo = async (info) => {
        try {
            const respuesta = await updateInfome(info);
            setInformes(informes.map(informe =>
                informe._id === info._id ? respuesta.data : informe
            ));
        } catch (error) {
            console.error("Error al actualizar informe:", error);
            setErrores(prevErrores => [...prevErrores, "Error al actualizar informe"]);
        }
    };

    const crearDEPInforme = async (id, info) => {
        try {
            const res = await llenadoDEPInforme(id, info);

            return res;
        } catch (error) {
            console.error("Error al crear solicitud:", error);
            setErrores(["Error al crear solicitud"]);
        }
    };

    const evaluarInforme = async (id, formData) => {
        try {
            const res = await evaluacionDelInfome(id, formData);
            return res;
        } catch (error) {
            console.error("Error al crear solicitud:", error);
            setErrores(["Error al crear solicitud"]);
        }
    };

    const diagnosticoDelTecnico = async (id, diagnostico) => {
        try {
            const res = await capturarDiagnostico(id, diagnostico);
            return res;
        } catch (error) {
            console.error("Error al crear solicitud:", error);
            setErrores(["Error al crear solicitud"]);
        }
    };

    const traerUnaInfo = async (id) => {
        try {
            const res = await getUnaInfome(id);
            setUnaInfo(res.data);
        } catch (error) {
            console.error("Error al traer informe:", error);
            setErrores(["Error al traer informe"]);
        }
    };

    const traerImagenInfo = async (id) => {
        try {
            const res = await getImagenInfome(id);
            setImagenInfo(res.data);
        } catch (error) {
            console.error("Error al traer imagen:", error);
            setErrores(["Error al traer imagen"]);
        }
    };

    const eliminarInfo = async (id) => {
        try {
            const res = await deleteInfome(id);
            return res;
        } catch (error) {
            console.error("Error al eliminar informe:", error);
            setErrores(["Error al eliminar informe"]);
        }
    };

    const editarEstadoInfo = async (id) => {
        try {
            const res = await editarEstadoInforme(id);
            return res.data;
        } catch (error) {
            console.error("Error al actualizar informe:", error);
            setErrores(["Error al actualizar informe"]);
        }
    };

    // Funciones para manejar técnicos
    const traerTecnicos = async () => {
        try {
            const res = await getTecnicos();
            setTecnicos(res.data);
        } catch (error) {
            console.error("Error al traer técnicos:", error);
            setErrores(["Error al traer técnicos"]);
        }
    };

    // Historial
    const traerHistorialOrden = async () => {
        try {
            const res = await gethistorialOrdenTrabajo();
            setHistorialOrden(res.data);
        } catch (error) {
            console.error("Error al traer historial de órdenes de trabajo:", error);
            setErrores(["Error al traer historial de órdenes de trabajo"]);
        }
    };

    const traerFolioInternoInforme = async () => {
        try {
            const res = await getfolioInternoInforme();
            setMiFolioInternoInfo(res.data.folio);
        } catch (error) {
            console.error("Error al traer folio interno del informe:", error);
            setErrores(["Error al traer folio interno del informe"]);
        }
    };

    const actualizarEstadosOrden = async (estadosAActualizar) => {
        try {
            const res = await actualizarEstadosOrdenTrabajo(estadosAActualizar);
            return res;
        } catch (error) {
            console.error("Error al actualizar los estados de la orden de trabajo:", error);
            setErrores(prevErrores => [...prevErrores, "Error al actualizar los estados de la orden de trabajo"]);
        }
    };

    const crearEstadosOrdenTrabajo = async (nuevoEstado) => {
        try {
            const res = await crearEstadosOrdenTrabajo(nuevoEstado);
            return res;
        } catch (error) {
            console.error("Error al crear nuevo estado de la orden de trabajo:", error);
            setErrores(prevErrores => [...prevErrores, "Error al crear nuevo estado de la orden de trabajo"]);
        }
    };

    const declinarSoliOrdenTrabajo = async (id, user) => {
        try {
            const res = await declinarSoliOrdenTrabajo(id, user);
            return res;
        } catch (error) {
            console.error("Error al declinar la solicitud de orden de trabajo:", error);
            setErrores(prevErrores => [...prevErrores, "Error al declinar la solicitud de orden de trabajo"]);
        }
    };

    const getCantidadTotalOrden = async (mesAnioIdestado) => {
        try {
            const res = await getCantidadTotalOrdenTrabajoEstados(mesAnioIdestado);
        
            setEstadosTotales(res.data);
        } catch (error) {
            console.error("Error al obtener la cantidad total de estados de la orden de trabajo:", error);
            setErrores(prevErrores => [...prevErrores, "Error al obtener la cantidad total de estados de la orden de trabajo"]);
        }
    };

    const getEstadosOrdenTrabajo = async () => {
        try {
            const res = await getEstadosOrdenTrabajo();
            setEstados(res.data);
        } catch (error) {
            console.error("Error al obtener los estados de la orden de trabajo:", error);
            setErrores(prevErrores => [...prevErrores, "Error al obtener los estados de la orden de trabajo"]);
        }
    };

    //Tecnicos
    const crearTecnico = async (tecnico) => {
        try {
            const res = await createTecnico(tecnico);
            return res
        } catch (error) {
            console.error("Error al crear técnico:", error);
            setErrores(prevErrores => [...prevErrores, "Error al crear técnico"]);
        }
    };
    const eliminarTecnico = async (id) => {
        try {
            const res = await deleteTecnico(id);
            return res;
        } catch (error) {
            console.error("Error al eliminar técnico:", error);
            setErrores(prevErrores => [...prevErrores, "Error al eliminar técnico"]);
        }
    };

    const traerTecnicoPorId = async (id) => {
        try {
            const res = await getTecnicoPorId(id);
            setUnTecnicos(res.data)
        } catch (error) {
            console.error("Error al traer técnico por ID:", error);
            setErrores(prevErrores => [...prevErrores, "Error al traer técnico por ID"]);
        }
    };

    const traerTecnicosPorInforme = async (informeId) => {
        try {
            const res = await getTecnicosPorInforme(informeId);
            setUnTecnicoinfo(res.data);
        } catch (error) {
            console.error("Error al traer técnicos por informe:", error);
            setErrores(prevErrores => [...prevErrores, "Error al traer técnicos por informe"]);
        }
    };
    const actualizarTecnico = async (id, tecnico) => {
        try {
            const res = await updateTecnico(id, tecnico);
            return res;
        } catch (error) {
            console.error("Error al actualizar técnico:", error);
            setErrores(prevErrores => [...prevErrores, "Error al actualizar técnico"]);
        }
    };

    return (
        <OrdenTrabajoContext.Provider
            value={{
                errores,
                informes,
                filtrarInforme,
                tecnicos,
                estados,
                estadosTotales,
                unaInfo,
                miFolioInternoInfo,
                imagenInfo,
                encabezado,
                historialOrden,
                unTecnicos,
                unTecnicoinfo,
                //funciones
                traerOrdenesDeTrabajo,
                traerFiltrarInformesEstado,
                crearOrdenTrabajo,
                eliminarOrdenTrabajo,
                actualizarOrdenTrabajo,
                crearDEPInforme,
                evaluarInforme,
                diagnosticoDelTecnico,
                traerUnaInfo,
                traerImagenInfo,
                eliminarInfo,
                editarEstadoInfo,
                traerTecnicos,
                traerHistorialOrden,
                traerFolioInternoInforme,
                // Otras funciones y estados...

                actualizarEstadosOrden,
                crearEstadosOrdenTrabajo,
                declinarSoliOrdenTrabajo,
                getCantidadTotalOrden,
                getEstadosOrdenTrabajo,
                crearTecnico,
                eliminarTecnico,
                traerTecnicoPorId,
                traerTecnicosPorInforme,
                actualizarTecnico,
            }}
        >
            {children}
        </OrdenTrabajoContext.Provider>
    );
};

export default OrdenTrabajoContext;
