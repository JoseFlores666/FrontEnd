import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AutocompleteInput } from "../../components/ui/AutocompleteInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useNavigate } from "react-router-dom";
import SubiendoImagenes from "../../components/ui/SubiendoImagenes"

import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from '../../schemas/RegisterTecPage2'
import { faTrashAlt, faEye, faEdit, faClone } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import "../../css/solicitud.css";
import "../../css/Animaciones.css";
import { GridContainer, Label, Title } from "../../components/ui";
import { useOrden } from "../../context/ordenDeTrabajoContext";

export const RegisterTecPage2 = () => {

    const { id } = useParams();
    const subiendoImagenesRef = useRef(null);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setValue, reset, setError } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            items: [{ cantidad: "", descripcion: "" }],
            images: [],
        }
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };
    const { traerUnaInfo, unaInfo,
        traerHistorialOrden, historialOrden, traerFolioInternoInforme,
        miFolioInternoInfo, crearDEPInforme, traerImagenInfo, imagenInfo, } = useOrden();

    const [recentSuggestions, setRecentSuggestions] = useState([]);

    const [fechaOrden, setFechaOrden] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    const [folioExterno, setFolioExterno] = useState("");
    const [items, setItems] = useState([{ cantidad: "", descripcion: "" }]);
    const refs = useRef([]);

    const [cargarDatos, setDatosCargados] = useState(false);

    useEffect(() => {
        const iniciarDatos = async () => {
            await traerImagenInfo(id);
            setDatosCargados(true);
        };
        if (!cargarDatos) {
            iniciarDatos();
        }
    }, [id, traerImagenInfo, cargarDatos]);

    console.log(imagenInfo
    )
    const onSubmit = async (data) => {
        try {
            if (subiendoImagenesRef.current && !subiendoImagenesRef.current.hasFiles()) {
                setError("images", { type: "manual", message: "Debe subir al menos una imagen." });
                return;
            }
            const formData = new FormData();

            // Agregar datos de items al FormData
            data.items.forEach((item, index) => {
                formData.append(`items[${index}].cantidad`, item.cantidad);
                formData.append(`items[${index}].descripcion`, item.descripcion);
            });

            // Agregar archivos al FormData
            const files = subiendoImagenesRef.current.getFiles();
            files.forEach((file, index) => {
                formData.append(`imagen-${index}`, file);
            });

            const res = await crearDEPInforme(id, formData);
            if (res && res.data?.mensaje) {
                Swal.fire("Completado", res.data?.mensaje, "success");
                limpiar();
                navigate('/tecnico/orden');
            } else {
                Swal.fire("Error", res?.error || "Error desconocido", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error del servidor", "error");
        }
    };

    const limpiar = () => {
        reset();
        setFechaOrden(() => {
            const today = new Date();
            return today.toISOString().split("T")[0];
        });
        setFolioExterno("");
        setItems([{ cantidad: "", descripcion: "" }]);
        if (subiendoImagenesRef.current) {
            subiendoImagenesRef.current.clearFiles();
        }
    };


    useEffect(() => {
        traerHistorialOrden();
        traerFolioInternoInforme();
        traerUnaInfo(id);
    }, []);

    useEffect(() => {
        if (!folioExterno) {
            setFolioExterno(miFolioInternoInfo);
        }
    }, [folioExterno, miFolioInternoInfo]);

    const handleCantidadChange = (index, newValue) => {
        const newItems = [...items];
        newItems[index].cantidad = newValue;
        setItems(newItems);
    };

    const handleInputChange = (index, value, field) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const agregarItem = (e) => {
        e.preventDefault();
        if (items.length < 4) {
            setItems([...items, { cantidad: "", descripcion: "" }]);
        } else {
            alert("No se pueden agregar más de 4 items.");
        }
    };

    const duplicarItem = async (index, e) => {
        e.preventDefault();
        const itemToDuplicate = items[index];
        const duplicatedItem = { ...itemToDuplicate };
        const newItems = [...items, duplicatedItem];
        setItems(newItems);
    };

    const eliminarItem = (index, e) => {
        e.preventDefault();
        setItems(items.filter((_, i) => i !== index));
    };

    const formatFecha = (fecha) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString(undefined, options);
    };

    return (
        <div className="mx-auto max-w-5xl p-4 text-black">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <Title showBackButton={true}>Área De Entregas</Title>
                    <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Fecha:</Label>
                            <p className="w-full rounded-md">   {formatFecha(unaInfo.informe?.fecha)}</p>
                        </div>

                        <div className="bg-slate-200 rounded p-2">
                            <Label>Solicita:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.nombre}</p>
                        </div>

                        <div className="bg-slate-200 rounded p-2">
                            <Label>Folio: </Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.folio}</p>

                        </div>
                    </GridContainer>
                    <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Tipo de Solicitud:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeSolicitud}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Tipo de Mantenimiento:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeMantenimiento}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Tipo de Trabajo:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeTrabajo}</p>
                        </div>
                    </GridContainer>
                    <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Área solicitante:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.areaSolicitante}</p>
                        </div>

                        <div className="bg-slate-200 rounded p-2 ">
                            <Label>Edificio:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.edificio}</p>
                        </div>
                    </GridContainer>
                    <div className="bg-slate-200 rounded p-2 mb-4">
                        <Label>Descripción:</Label>
                        <p>{unaInfo.informe?.descripcion}</p>
                    </div>

                    <div className="bg-slate-200 rounded p-2 mb-4 text-center">
                        <Label>Técnico Encargado:</Label>
                        {unaInfo.informe?.solicitud?.tecnicos ? (
                            <p>{unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto}</p>
                        ) : (
                            <p>No asignado</p>
                        )}

                        {errors.tecnicos && (
                            <span className="text-red-500">{errors.tecnicos.message}</span>
                        )}
                    </div>
                    <div className="bg-slate-200 rounded p-2 mb-4">
                        <Label>Diagnostico</Label>

                        <p>{unaInfo.informe?.solicitud?.diagnostico}</p>

                    </div>

                    <div className="flex items-center justify-center w-full h-11 p-3 rounded-md">
                        <p className="font-bold">Llenado Exclusivo Para El DEP MSG:</p>
                    </div>
                    <p className="text-center">Rellene los detalles a continuación.</p>
                    <div className="p-4 space-y-">
                        <div className="relative w-full">
                            <table className="w-full caption-bottom text-sm border">
                                <thead className="[&_tr]:border border-gray-400">
                                    <tr className="border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                        <th className="h-12 text-center px-4 align-middle font-medium text-black border-gray-400">
                                            Cantidad
                                        </th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-black border-gray-400">
                                            Descripción
                                        </th>
                                        <th className="h-12 px-4 align-middle font-medium text-black border-gray-400">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 border-b border-r border-l border-gray-400">
                                    {items.map((item, index) => (
                                        <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                            <td className="align-middle border border-gray-400">
                                                <div className="flex justify-center">
                                                    <input
                                                        className="h-10 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-2/4 text-center rounded-md border border-input border-gray-400 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                                        type="number"
                                                        min={0}
                                                        placeholder="Ingrese la cantidad"
                                                        onChange={(e) => handleCantidadChange(index, e.target.value)}
                                                        {...register(`items[${index}].cantidad`, { required: true })}
                                                        defaultValue={item.cantidad}
                                                        name={`items[${index}].cantidad`}
                                                    />
                                                </div>
                                                {errors.items && errors.items[index] && errors.items[index].cantidad && (
                                                    <span className="text-red-500">{errors.items[index].cantidad.message}</span>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle border border-gray-400">
                                                <AutocompleteInput
                                                    index={index}
                                                    value={item.descripcion}
                                                    onChange={(value) => handleInputChange(index, value, "descripcion")}
                                                    data={historialOrden}
                                                    recentSuggestions={recentSuggestions}
                                                    setRecentSuggestions={setRecentSuggestions}
                                                    inputRefs={refs}
                                                    placeholder="Ingrese una descripción"
                                                    fieldsToCheck={['Observacionestecnicas', 'descripcionDelServicio', 'soliInsumosDescripcion']}
                                                    inputProps={{
                                                        type: "text",
                                                        maxLength: 200,
                                                        className: "w-full resize-none text-black p-3 border border-gray-400 bg-gray-50 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                                                        onBlur: () => setValue(`items[${index}].descripcion`, item.descripcion, { shouldValidate: true })
                                                    }}
                                                />
                                                {errors.items && errors.items[index] && errors.items[index].descripcion && (
                                                    <span className="text-red-500">{errors.items[index].descripcion.message}</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-400">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={(e) => eliminarItem(index, e)}
                                                        className="inline-flex text-red-500 hover:text-red-700 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                    <button className="text-blue-500 hover:text-blue-700" onClick={(e) => duplicarItem(index, e)}>
                                                        <FontAwesomeIcon icon={faClone} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="p-4 bg-white mb-6 border-b border-r border-l border-gray-400 rounded-b-md">
                                <button
                                    onClick={(e) => agregarItem(e)}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-green-600 hover:text-white border-gray-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white h-10 px-4 py-2 w-full">
                                    Agregar más
                                </button>
                            </div>
                        </div>

                        <div className="image-lists mt-4">
                            <div className="image-list">
                                <h5>Lista de Imágenes</h5>
                                <ul>
                                    {imagenInfo.map((image, index) => (
                                        <li key={index}>
                                            {image.name}
                                            <utton
                                                variant="primary"
                                                onClick={() => handleShow(image)}
                                                className="ml-2"
                                            >
                                                Ver Imagen
                                            </utton>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="relative w-full">
                                    <table className="w-full text-sm border">
                                        <thead>
                                            <tr className="border">
                                                <th className="h-12 px-4 text-center border">Nº</th>
                                                <th className="h-12 px-4 text-center border">Nombre</th>
                                                <th className="h-12 px-4 text-center border">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {imagenInfo.map((image, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="text-center py-2 border">{index + 1}</td>
                                                    <td className="text-center py-2 border">{image.name}</td>
                                                    <td className="text-center py-2 border">
                                                        <button
                                                            className="text-blue-500 hover:text-blue-700 mx-1"
                                                            onClick={() => handleShow(image)}
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                        <button
                                                            className="text-yellow-500 hover:text-yellow-700 mx-1"
                                                            onClick={() => alert('Editar imagen')}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button
                                                            className="text-red-500 hover:text-red-700 mx-1"
                                                            onClick={() => alert('Eliminar imagen')}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div>
                                <SubiendoImagenes ref={subiendoImagenesRef} />
                                {errors.images && <div className="text-red-500">{errors.images.message}</div>}
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
                                type="submit"
                            >
                                Guardar Registro
                            </button>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
};
