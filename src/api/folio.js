import axios from "./axios";

export const getfolioInterno = async () => axios.get(`/folio/ultimo-folio-counter`);

export const getfolioInternoInforme = async () => axios.get(`/folio/ultimo-folio-counter-informe`);
