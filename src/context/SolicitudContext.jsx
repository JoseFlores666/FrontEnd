import { createContext, useContext, useState, useEffect } from "react";
import {
  getSolitudes,
  createSoli,
  deleteSoli,
  getUnaSoli,
  updateSoli,
  idsProyect,
  getUnProyectYAct,
  traeUnProyectAct,
  getFiltroEstado,
  nombreFirmas, editarNombreFirmas, putAbono,
  updateSoliFolioExterno, getEstados, actualizaEstado,
  getVercantidadTotalEstados, declinarSoli,
  hisorialSolicitud, hisorialDeUnaSoli, deleteUnHistorialSoli,
  getActividad, postActividad, asignarActividadesProyecto,
  getProyecto, deleteActividad, putActividad,
  getActSinAsignar, postProyecto, deleteProyecto,
  asignarActividadProyect, ProyectCrearActYAsignarle,
  editarProyecto, getUnProyectoActividades, desenlazarActividadProyec,

} from "../api/soli";




import { getfolioInterno } from "../api/folio";
import { gethistorialSoli } from "../api/historialInput";
import { CrearApi_key, VerApis_Keys, actualizaApi_key } from "../api/api_key";

const SoliContext = createContext();

export const useSoli = () => {
  const context = useContext(SoliContext);
  if (!context) throw new Error("useSoli must be used within a SoliProvider");
  return context;
};

export function SoliProvider({ children }) {
  const [soli, setSoli] = useState([]);
  const [ids, setIds] = useState([]);
  const [proyect, setproyect] = useState([]);
  const [act, setAct] = useState([]);
  const [idsAct, setIdsAct] = useState([]);
  const [nombreProAct, setNombreProAct] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unasoli, setUnaSoli] = useState([]);
  const [myHisorialSolicitud, setMyHisorialSolicitud] = useState([]);
  const [unProyectAct, setUnProyectAct] = useState([]);
  const [nombresFirmas, setNombresFirmas] = useState([]);
  const [myFolioInterno, setMyFolioInterno] = useState([]);
  const [historialSoli, setHistorialSoli] = useState([]);
  const [historialUnaSoli, setHistorialUnaSoli] = useState([]);
  const [api_Key, setApi_Key] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [estados, setEstados] = useState([]);
  const [cantidadEstados, setCantidadEstados] = useState("");

  const [misProyectos, setMisProyectos] = useState([]);
  const [miProyectoAct, setMiProyectoAct] = useState([]);
  const [misActividades, setMisActividades] = useState([]);
  const [actSinAsignar, setActSinAsignar] = useState([]);


  //Solicitudes
  const getSoli = async () => {
    try {
      const res = await getSolitudes();
      setSoli(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };
  const traehistoriSoli = async () => {
    try {
      const res = await hisorialSolicitud();
      setMyHisorialSolicitud(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };
  const traehisorialDeUnaSoli = async (id) => {
    try {
      const res = await hisorialDeUnaSoli(id);
      setHistorialUnaSoli(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };
  const getunSolitud = async (id) => {
    try {
      const res = await getUnaSoli(id);
      // console.log(res)
      setUnaSoli(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };
  const ActualizarEstados = async (estados) => {
    try {
      const res = await actualizaEstado(estados);
      return res.data;
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const deleteSolitud = async (id, user) => {
    try {
      const res = await deleteSoli(id, user);
      return res;
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const getUnPorEstado = async (estado) => {
    try {
      const res = await getFiltroEstado(estado);
      setSoli(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const crearmySoli = async (soli) => {
    try {
      const res = await createSoli(soli);
      return res;

    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };
  const declinarmySoi = async (id, user) => {
    try {
      const res = await declinarSoli(id, user);
      return res;
    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };
  const eliminarUnHistorialSoli = async (id, data) => {
    try {
      const res = await deleteUnHistorialSoli(id, data);
      return res;
    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };

  const actializarSoli = async (id, datosSolicitud) => {
    try {
      await updateSoli(id, datosSolicitud);
      console.log("Actulizado con exito");
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const verMisEstados = async () => {
    try {
      const res = await getEstados();
      setEstados(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const VercantTotalEstado = async (mesAnioIdestado) => {
    try {
      const res = await getVercantidadTotalEstados(mesAnioIdestado);
      setCantidadEstados(res.data)
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };


  const actualizarSoliFolioExterno = async (id, datosSolicitud) => {
    try {
      await updateSoliFolioExterno(id, datosSolicitud);
      console.log("Actulizado con exito");
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  //abono
  const RealizarAbono = async (id, data) => {
    try {
      const response = await putAbono(id, data);
      return response.data;
    } catch (error) {
      console.error("Error al abonar:", error);
      setErrors(["Error al abonar"]);
    }
  };

  //proyectos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const getIdsProyect = async () => {
    try {
      const res = await idsProyect();
      setIds(res.data); //id con todos los proyectos
    } catch (error) {
      console.error("Error fetching project ids:", error);
      setErrors(["Error fetching project ids"]);
    }
  };

  const getIdsProyectYAct = async (id) => {
    try {
      const res = await traeUnProyectAct(id);
      setIdsAct(res.data?.proyecto?.actividades);
    } catch (error) {
      console.error("Error fetching project activities:", error);
      setErrors(["Error fetching project activities"]);
    }
  };

  //obtener nombre del proyecto y actividad
  const getIdsProyectYActIndividual = async (proyectoId, actividadId) => {
    try {
      const res = await getUnProyectYAct(proyectoId, actividadId);
      setproyect(res.data.nombreProyecto);
      setAct(res.data.nombreActividad);
    } catch (error) {
      console.error("Error fetching project activities:", error);
      setErrors(["Error fetching project activities"]);
    }
  };


  //firmas
  const getFirmas = async () => {
    try {
      const res = await nombreFirmas();
      setNombresFirmas(res.data);
    } catch (error) {
      console.error("Error fetching firmas:", error);
      setErrors(["Error fetching firnas"]);
    }
  };
  const editarFirmas = async (nombrefirmas) => {
    try {
      const id = "664d5e645db2ce15d4468548";
      await editarNombreFirmas(id, nombrefirmas);
      console.log("Actulizado con exito");
    } catch (error) {
      console.error("Error al editar firmas", error);
      setErrors(["Error editar firmas"]);
    }
  };
  //Folio
  const traeFolioInterno = async () => {
    try {
      const res = await getfolioInterno();
      setMyFolioInterno(res.data.folio);
    } catch (error) {
      console.error("Error fetching folioInterno:", error);
      setErrors(["Error fetching folioInterno"]);
    }
  };


  const traeHistorialSoli = async () => {
    try {
      const res = await gethistorialSoli();
      setHistorialSoli(res.data);
    } catch (error) {
      console.error("Error fetching historialSoli:", error);
      setErrors(["Error fetching historialSoli"]);
    }
  };
  //PARA El APY DEL PDF
  const traeApis_keys = async () => {
    try {
      const res = await VerApis_Keys();
      setApi_Key(res.data);
    } catch (error) {
      console.error("Error consultar los api_Key:", error);
      setErrors(["Error fetching api_key"]);
    }
  };
  const EditarApis_keys = async (idApiKeys, newApiKey) => {
    try {
      await actualizaApi_key(idApiKeys, newApiKey);
    } catch (error) {
      console.error("Error al editar el api_key:", error);
      setErrors(["Error al editar api_key"]);
    }
  };
  const CrearUnaApi_key = async (myApi_key) => {
    try {
      await CrearApi_key(myApi_key);
    } catch (error) {
      console.error("Error al crear el api_key:", error);
      setErrors(["Error crear una api_key"]);
    }
  }

  //Actividad
  const traerActividades = async () => {
    try {
      const res = await getActividad();
      setMisActividades(res.data)
    } catch (error) {
      console.error("Error al consultar las actividades", error);
      setErrors(["Error fetching actividad"]);
    }
  }
  const traerActSinAsignar = async () => {
    try {
      const res = await getActSinAsignar();
      setActSinAsignar(res.data)
    } catch (error) {
      console.error("Error al consultar las actividades", error);
      setErrors(["Error fetching actividad"]);
    }
  }

  const crearActividad = async (actividad) => {
    try {
      const res = await postActividad(actividad);
      console.log(res.data)
      return res;
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  }
  const actualizarAct = async (id, data) => {
    try {
      const res = await putActividad(id, data);
      console.log(res.data)
      return res;
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  }

  const eliminarActividad = async (id) => {
    try {
      const res = await deleteActividad(id);
      console.log(res.data)
      return res;
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  }
  //Proyecto
  const traerProyectos = async () => {
    try {
      const res = await getProyecto();
      setMisProyectos(res.data)
    } catch (error) {
      console.error("Error al consultar los proyectos ", error);
      setErrors(["Error fetching actividad"]);
    }
  }
  const traeMyProyecActividades = async (id) => {
    try {
      const res = await getUnProyectoActividades(id);
      console.log(res.data?.proyecto || [])
      setMiProyectoAct(res.data?.proyecto || [])
    } catch (error) {
      console.error("Error al consultar los proyectos ", error);
      setErrors(["Error fetching actividad"]);
    }
  }
  const crearProyecto = async (proyecto) => {
    try {
      const res = await postProyecto(proyecto);
      return res;
    } catch (error) {
      console.error("Error al crear el proyecto", error);
      setErrors(["Error al crear el proyecto"]);
    }
  }
  const proyectAsignarActividades = async (id, idActividades) => {
    try {
      const res = await asignarActividadProyect(id, idActividades);
      return res;
    } catch (error) {
      console.error("Error al asginarle las actividades a su proyecto", error);
      setErrors(["Error al asginarle las actividades a su proyecto"]);
    }
  }
  const desasignarActProyect = async (id, idActividades) => {
    try {
      const res = await desenlazarActividadProyec(id, idActividades);
      return res;
    } catch (error) {
      console.error("Error al desasginarle las actividad a su proyecto", error);
      setErrors(["Error al desasginarle las actividad a su proyecto"]);
    }
  }
  const editarMyProyect = async (id, proyecto) => {
    try {
      const res = await editarProyecto(id, proyecto);
      return res;
    } catch (error) {
      console.error("Error al actualizar el proyecto", error);
      setErrors(["Error al actualizar el proyecto "]);
    }
  }
  const crearActYasignarProyect = async (id, actividades) => {
    try {
      const res = await ProyectCrearActYAsignarle(id, actividades);
      return res;
    } catch (error) {
      console.error("Error al intentar crear y asginarle las actividades a su proyecto", error);
      setErrors(["Error al intentar crear y asginarle las actividades a su proyecto"]);
    }
  }
  const eliminarProyecto = async (id) => {
    try {
      const res = await deleteProyecto(id);
      return res;
    } catch (error) {
      console.error("Error al eliminar su proyecto", error);
      setErrors(["Error al eliminar su proyecto"]);
    }
  }

  const asignarActProyecto = async (proyectoAct) => {
    try {
      const res = await asignarActividadesProyecto(proyectoAct);
      return res.data;
    } catch (error) {
      console.error("Error al asingar una o varias actividades a un proyecto", error);
      setErrors(["Error al asingar una o varias actividades a un proyecto"]);
    }
  }
  return (
    <SoliContext.Provider
      value={{
        traerActividades,
        proyectAsignarActividades,
        desasignarActProyect,
        crearActYasignarProyect,
        eliminarActividad,
        traerActSinAsignar,
        editarMyProyect,
        actSinAsignar,
        actualizarAct,
        crearProyecto,
        traeMyProyecActividades,
        miProyectoAct,
        eliminarProyecto,
        traerProyectos,
        asignarActProyecto,
        misProyectos,
        misActividades,
        crearActividad,
        ActualizarEstados,
        estados,
        eliminarUnHistorialSoli,
        historialUnaSoli,
        traehisorialDeUnaSoli,
        verMisEstados,
        traehistoriSoli,
        myHisorialSolicitud,
        cantidadEstados,
        VercantTotalEstado,
        traeHistorialSoli,
        historialSoli,
        soli,
        declinarmySoi,
        actualizarSoliFolioExterno,
        editarFirmas,
        myFolioInterno,
        nombresFirmas,
        traeFolioInterno,
        unasoli,
        RealizarAbono,
        traeApis_keys,
        api_Key,
        EditarApis_keys,
        CrearUnaApi_key,
        getFirmas,
        actializarSoli,
        act,
        getUnPorEstado,
        getSoli,
        unProyectAct,
        getunSolitud,
        proyect,
        ids,
        getIdsProyectYActIndividual,
        getIdsProyect,
        nombreProAct,
        idsAct,
        getIdsProyectYAct,
        crearmySoli,
        deleteSolitud,
        getUnaSoli,

        errors,
        loading,
        mensaje,
      }}
    >
      {children}
    </SoliContext.Provider>
  );
}