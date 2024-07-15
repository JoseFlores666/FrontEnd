import axios from "axios";

export const gethistorialOrden de trabajo = async () => axios.get(`/folio/ultimo-folio-counter`);

export const getfolioInternoInforme = async () => axios.get(`/folio/ultimo-folio-counter-informe`);
