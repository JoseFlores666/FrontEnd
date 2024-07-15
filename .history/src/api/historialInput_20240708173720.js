import axios from "axios";

export const gethistorialOrdenTrabajo = async () => axios.get(`/folio/ultimo-folio-counter`);

export const getfolioInternoInforme = async () => axios.get(`/folio/ultimo-folio-counter-informe`);
