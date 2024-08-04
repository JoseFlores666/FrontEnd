import { createContext, useContext, useState, useEffect } from "react";
import {
    InformaciónDeLaOrden,
    createInfome,
    deleteInfome,
    editarEstadoInforme,
    evaluacionDelInfome,
    getEncabezado,
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
    const [tecnicos, setTecnicos] = useState([]);
    const [estados, setEstados] = useState([]);
    const [unaInfo, setUnaInfo] = useState([]);
    const [imagenInfo, setImagenInfo] = useState([]);
    const [encabezado, setEncabezado] = useState([]);
    const [historialOrden, setHistorialOrden] = useState([]);
    const [miFolioInternoInfo, setMiFolioInternoInfo] = useState([]);
    const [estadosTotales, setEstadosTotales] = useState(0);

    const traerOrdenesDeTrabajo = async () => {
        try {
            const respuesta = await getInfome();
            setInformes(respuesta.data);
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

    const observacionesDelTecnico = async (id, observaciones) => {
        try {
            const res = await InformaciónDeLaOrden(id, observaciones);
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

    const traerEncabezado = async (id) => {
        try {
            const res = await getEncabezado(id);
            setEncabezado(res.data);
        } catch (error) {
            console.error("Error al traer informe (encabezado):", error);
            setErrores(["Error al traer informe (encabezado)"]);
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
            console.log(res.data)
            setMiFolioInternoInfo(res.data.folio);
        } catch (error) {
            console.error("Error al traer folio interno del informe:", error);
            setErrores(["Error al traer folio interno del informe"]);
        }
    };

    const actualizarEstadosOrdenTrabajo = async (estadosAActualizar) => {
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

    const getCantidadTotalOrdenTrabajoEstados = async () => {
        try {
            const res = await getCantidadTotalOrdenTrabajoEstados();
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


    return (
        <OrdenTrabajoContext.Provider
            value={{
                errores,
                informes,
                tecnicos,
                estados,
                estadosTotales,
                unaInfo,
                miFolioInternoInfo,
                imagenInfo,
                encabezado,
                historialOrden,
                //funciones
                traerOrdenesDeTrabajo,
                crearOrdenTrabajo,
                eliminarOrdenTrabajo,
                actualizarOrdenTrabajo,
                crearDEPInforme,
                evaluarInforme,
                observacionesDelTecnico,
                traerUnaInfo,
                traerImagenInfo,
                eliminarInfo,
                editarEstadoInfo,
                traerTecnicos,
                traerEncabezado,
                traerHistorialOrden,
                traerFolioInternoInforme,
                // Otras funciones y estados...
                actualizarEstadosOrdenTrabajo,
                crearEstadosOrdenTrabajo,
                declinarSoliOrdenTrabajo,
                getCantidadTotalOrdenTrabajoEstados,
                getEstadosOrdenTrabajo,
            }}
        >
            {children}
        </OrdenTrabajoContext.Provider>
    );
};

export default OrdenTrabajoContext;
