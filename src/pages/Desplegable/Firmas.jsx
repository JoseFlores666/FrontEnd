import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { firmasSchema } from "../../schemas/Firmas";
import "../../css/solicitud.css";
import { useSoli } from "../../context/SolicitudContext";
import "../../css/Animaciones.css";
import { AutocompleteInput } from '../../components/ui/AutocompleteInput'
import { Title } from "../../components/ui";

export const Firmas = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(firmasSchema),
  });

  const refs = useRef([])

  const { editarFirmas, getFirmas, nombresFirmas } = useSoli();
  const [esperarFirmas, setEsperarFirmas] = useState(false);
  const [recentSuggestions, setRecentSuggestions] = useState("");
  const [solicitud, setSolicitud] = useState("");
  const [jefeInmediato, setJefeInmediato] = useState("");
  const [direccion, setDireccion] = useState("");
  const [autorizo, setAutorizo] = useState("");

  useEffect(() => {
    const llamaFirmas = async () => {
      try {
        await getFirmas();
        setEsperarFirmas(true);
      } catch (error) {
        console.error("Error al consultar las firmas:", error);
        Swal.fire("Error al guardar los datos", "", "error");
      }
    };
    if (!esperarFirmas) {
      llamaFirmas();
      llenadoFirmas();
    }
  }, [getFirmas, esperarFirmas]);

  const llenadoFirmas = () => {
    if (nombresFirmas.length > 0) {
      const { solicitud, revision, validacion, autorizacion } = nombresFirmas[0];
      setSolicitud(solicitud);
      setJefeInmediato(revision);
      setDireccion(validacion);
      setAutorizo(autorizacion);
    }
  };

  const guardarDatos = async (data) => {
    console.log("Datos guardados:", data);
    console.log("Datos guardados:", data);

    try {
      await editarFirmas(data);
      setEsperarFirmas(true)
      Swal.fire("Datos guardados", "", "success");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      Swal.fire("Error al guardar los datos", "", "error");
    }
  };

  return (
    <div className="flex items-center justify-center mx-auto max-w-7xl p-4 text-black" style={{ height: '90vh' }}>
      <div className="bg-white p-6 rounded-lg shadow-md border border-black slide-down">
        <Title showBackButton={true}>Editar Firmas</Title>
        <div>
          <form onSubmit={handleSubmit(guardarDatos)} >
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8 text-center">
              <div className="mb-4 gap-8 mx-10">
                <label htmlFor="solicitud" className="block text-lg font-bold">Solicitud</label>
                <AutocompleteInput
                  index={0}
                  value={solicitud || ""}
                  onChange={(newValue) => setSolicitud(newValue)}
                  data={nombresFirmas}
                  recentSuggestions={recentSuggestions}
                  setRecentSuggestions={setRecentSuggestions}
                  inputRefs={refs}
                  placeholder="Nombre del Solicitante"
                  fieldsToCheck={['autorizacion', 'revision', 'solicitud', 'validacion',]}
                  inputProps={{
                    type: "text",
                    maxLength: 200,
                    className: "w-full resize-none text-center text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                  }}
                />

              </div>

              <div className="mb-4 gap-8 mx-10">
                <label htmlFor="JefeInmediato" className="block text-lg font-bold">Revisión</label>
                <AutocompleteInput
                  index={1}
                  value={jefeInmediato || ""}
                  onChange={(newValue) => setJefeInmediato(newValue)}
                  data={nombresFirmas}
                  recentSuggestions={recentSuggestions}
                  setRecentSuggestions={setRecentSuggestions}
                  inputRefs={refs}
                  placeholder="Nombre de el jefeInmediato"
                  fieldsToCheck={['autorizacion', 'revision', 'solicitud', 'validacion',]}
                  inputProps={{
                    type: "text",
                    maxLength: 200,
                    className: "w-full resize-none text-center text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                  }}
                />

              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8 text-center">
              <div className="mb-4 gap-8 mx-10">
                <label htmlFor="Validacion" className="block text-lg font-bold">Validación</label>
                <AutocompleteInput
                  index={2}
                  value={direccion || ""}
                  onChange={(newValue) => setDireccion(newValue)}
                  data={nombresFirmas}
                  recentSuggestions={recentSuggestions}
                  setRecentSuggestions={setRecentSuggestions}
                  inputRefs={refs}
                  placeholder="Nombre de el direccion"
                  fieldsToCheck={['autorizacion', 'revision', 'solicitud', 'validacion',]}
                  inputProps={{
                    type: "text",
                    maxLength: 200,
                    className: "w-full resize-none text-center text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                  }}
                />
              </div>
              <div className="mb-4 gap-8 mx-10">
                <label htmlFor="Autorizo" className="block text-lg font-bold">Autorizó</label>
                <AutocompleteInput
                  index={3}
                  value={autorizo || ""}
                  onChange={(newValue) => setAutorizo(newValue)}
                  data={nombresFirmas}
                  recentSuggestions={recentSuggestions}
                  setRecentSuggestions={setRecentSuggestions}
                  inputRefs={refs}
                  placeholder="Nombre del que autoriza"
                  fieldsToCheck={['autorizacion', 'revision', 'solicitud', 'validacion',]}
                  inputProps={{
                    type: "text",
                    maxLength: 200,
                    className: "w-full resize-none text-center text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                  }}
                />
              </div>
            </div>


            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};