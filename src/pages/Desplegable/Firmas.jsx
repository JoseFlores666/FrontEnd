import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { firmasSchema } from "../../schemas/Firmas";
import "../../css/solicitud.css";
import { useSoli } from "../../context/SolicitudContext";
import "../../css/Animaciones.css";
import { AutocompleteInput } from '../../components/ui/AutocompleteInput';
import { Title } from "../../components/ui";
import { useNavigate } from "react-router-dom";

export const Firmas = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(firmasSchema),
  });
  const navigate = useNavigate();
  const refs = useRef([]);
  const [firmas, setFirmas] = useState({ solicitud: "", jefeInmediato: "", direccion: "", autorizo: "" });

  const { editarFirmas, getFirmas, nombresFirmas } = useSoli();
  const [esperarFirmas, setEsperarFirmas] = useState(false);
  const [recentSuggestions, setRecentSuggestions] = useState("");

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
      setFirmas({ solicitud, jefeInmediato: revision, direccion: validacion, autorizo: autorizacion });
    }
  };

  const guardarDatos = async () => {
    try {
      const res = await editarFirmas(firmas);

      if (res && res.data?.mensaje) {
        Swal.fire("Datos actualizados", res.data?.mensaje, "success").then(() => {
          navigate('/soli/registro/:id');
        });
        setEsperarFirmas(true);
      } else {
        Swal.fire("Error", res?.error || "Error desconocido", "error");
      }
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
                  value={firmas.solicitud || ""}
                  onChange={(newValue) => setFirmas((prev) => ({ ...prev, solicitud: newValue }))}
                  data={nombresFirmas}
                  recentSuggestions={recentSuggestions}
                  setRecentSuggestions={setRecentSuggestions}
                  inputRefs={refs}
                  placeholder="Nombre del Solicitante"
                  fieldsToCheck={['autorizacion', 'revision', 'solicitud', 'validacion']}
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
                  value={firmas.jefeInmediato || ""}
                  onChange={(newValue) => setFirmas((prev) => ({ ...prev, jefeInmediato: newValue }))}
                  data={nombresFirmas}
                  recentSuggestions={recentSuggestions}
                  setRecentSuggestions={setRecentSuggestions}
                  inputRefs={refs}
                  placeholder="Nombre del Jefe Inmediato"
                  fieldsToCheck={['autorizacion', 'revision', 'solicitud', 'validacion']}
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
                  value={firmas.direccion || ""}
                  onChange={(newValue) => setFirmas((prev) => ({ ...prev, direccion: newValue }))}
                  data={nombresFirmas}
                  recentSuggestions={recentSuggestions}
                  setRecentSuggestions={setRecentSuggestions}
                  inputRefs={refs}
                  placeholder="Nombre de la Dirección"
                  fieldsToCheck={['autorizacion', 'revision', 'solicitud', 'validacion']}
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
                  value={firmas.autorizo || ""}
                  onChange={(newValue) => setFirmas((prev) => ({ ...prev, autorizo: newValue }))}
                  data={nombresFirmas}
                  recentSuggestions={recentSuggestions}
                  setRecentSuggestions={setRecentSuggestions}
                  inputRefs={refs}
                  placeholder="Nombre del que autoriza"
                  fieldsToCheck={['autorizacion', 'revision', 'solicitud', 'validacion']}
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
