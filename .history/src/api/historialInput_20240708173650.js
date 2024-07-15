import axios from "axios";

export const gethistorial = async () => axios.get(`/folio/ultimo-folio-counter`);

export const getfolioInternoInforme = async () => axios.get(`/folio/ultimo-folio-counter-informe`);
