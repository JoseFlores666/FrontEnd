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
  nombreFirmas, editarNombreFirmas, putAbono, updateSoliFolioExterno, actualizaEstado,
} from "../api/soli";
import { getInfome, createInfome, deleteInfome, llenadoDEPInforme, getUnaInfome, evaluacionDelInfome, getTecnicos, editarEstadoInforme, getImagenInfome } from "../api/informe";
import { getfolioInterno, getfolioInternoInforme } from "../api/folio";
import { gethistorialOrdenTrabajo, gethistorialSoli } from "../api/historialInput";
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
  const [info, setInfo] = useState([]);
  const [unaInfo, setUnaInfo] = useState([]);
  const [unasoli, setUnaSoli] = useState([]);
  const [unProyectAct, setUnProyectAct] = useState([]);
  const [nombresFirmas, setNombresFirmas] = useState([]);
  const [myFolioInterno, setMyFolioInterno] = useState([]);
  const [myFolioInternoInfo, setMyFolioInternoInfo] = useState([]);
  const [historialOrden, setHistorialOrden] = useState([]);
  const [historialSoli, setHistorialSoli] = useState([]);
  const [api_Key, setApi_Key] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [tecnicos, setTecnicos] = useState("");
  const [imagenInfo, setImagenInfo] = useState("");

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
  const getunSolitud = async (id) => {
    try {
      const res = await getUnaSoli(id);
      setUnaSoli(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const deleteSolitud = async (id) => {
    try {
      const res = await deleteSoli(id);

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
      console.log(res);
      if (!res) {
        console.log("Error al crear la solicitud");
      } else {
        console.log("Solicitud creada con éxito");
      }
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

  const actializarSoliEstado = async (id) => {
    try {

      await actualizaEstado(id);
      console.log("Actulizado con exito");
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
      setIdsAct(res.data.actividades);
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

  // Informe
  const getInfo = async () => {
    try {
      const res = await getInfome();
      setInfo(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };


  const createInfo = async (info) => {
    try {
      const res = await createInfome(info);
      setMensaje(res.data.mensaje);
    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };
  const createDEPInforme = async (id, info) => {
    try {
      const res = await llenadoDEPInforme(id, info);
      if (!res) {
        console.log("Error al crear la solicitud");
      } else {
        console.log("Solicitud creada con éxito");
      }
    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };
  const evaluarInfor = async (id, info) => {
    try {
      const res = await evaluacionDelInfome(id, info);
      !res ? console.log("Error al crear el informe") : console.log("Informe creado con éxito")

    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };
  const traeUnaInfo = async (id) => {
    try {
      const res = await getUnaInfome(id);
      setUnaInfo(res.data);
    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };
  const traeImagenInfo = async (id) => {
    try {
      const res = await getImagenInfome(id);
      setImagenInfo(res.data);
    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };

  const eliminarInfo = async (id) => {
    try {
      const res = await deleteInfome(id);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };
  const editarEstadoInfo = async (id) => {
    try {
      const res = await editarEstadoInforme(id);
      return res.data;
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  //Tecnicos
  const traerTecnicos = async () => {
    try {
      const res = await getTecnicos();
      setTecnicos(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
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
      console.error("Error :", error);
      setErrors(["Error fetching firmas"]);
    }
  };
  //Folio
  const traeFolioInterno = async () => {
    try {
      const res = await getfolioInterno();
      setMyFolioInterno(res.data.folio);
    } catch (error) {
      console.error("Error fetching firmas:", error);
      setErrors(["Error fetching firnas"]);
    }
  };
  const traeFolioInternoInforme = async () => {
    try {
      const res = await getfolioInternoInforme();
      setMyFolioInternoInfo(res.data.folioInforme);
    } catch (error) {
      console.error("Error fetching firmas:", error);
      setErrors(["Error fetching firnas"]);
    }
  };

  //historial
  const traeHistorialOrden = async () => {
    try {
      const res = await gethistorialOrdenTrabajo();
      setHistorialOrden(res.data);
    } catch (error) {
      console.error("Error fetching firmas:", error);
      setErrors(["Error fetching firnas"]);
    }
  };
  const traeHistorialSoli = async () => {
    try {
      const res = await gethistorialSoli();
      setHistorialSoli(res.data);
    } catch (error) {
      console.error("Error fetching firmas:", error);
      setErrors(["Error fetching firnas"]);
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
      setErrors(["Error fetching api_key"]);
    }
  };
  const CrearUnaApi_key = async (myApi_key) => {
    try {
      await CrearApi_key(myApi_key);
    } catch (error) {
      console.error("Error al crear el api_key:", error);
      setErrors(["Error fetching api_key"]);
    }
  }
  return (
    <SoliContext.Provider
      value={{
        traeHistorialSoli,
        historialSoli,
        soli,
        actualizarSoliFolioExterno,
        traeUnaInfo,
        unaInfo,
        evaluarInfor,
        editarEstadoInfo,
        editarFirmas,
        actializarSoliEstado,
        myFolioInterno,
        traeFolioInternoInforme,
        myFolioInternoInfo,
        createDEPInforme,
        traeHistorialOrden,
        historialOrden,
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
        info,
        getInfo,
        createInfo,
        eliminarInfo,
        imagenInfo,
        traeImagenInfo,
        traerTecnicos,
        tecnicos,
        errors,
        loading,
        mensaje,
      }}
    >
      {children}
    </SoliContext.Provider>
  );
}
