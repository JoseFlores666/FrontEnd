import axios from ;

export const gethistorialOrdenTrabajo = async () =>
  axios.get(`/historialInput/`);

// export const getfolioInternoInforme = async () =>
//   axios.get(`/folio/ultimo-folio-counter-informe`);