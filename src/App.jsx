import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { OrdenDeTrabajoProvider } from "./context/ordenDeTrabajoContext";
import { ProtectedRoute } from "./routes";
import { Firmas } from "./pages/Desplegable/Firmas";
import RegisterPage from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { SoliProvider } from "./context/SolicitudContext";
import { FormularioSolicitud } from "./pages/SolicitudServicios/FormularioSolicitud";
import { TablaDeRegistros } from "./pages/SolicitudServicios/Table/TablaDeRegistros";
import { FormularioOrden } from "./pages/OrdenDeTrabajo/FormularioOrden";
import { TablaDeOrdenes } from "./pages/OrdenDeTrabajo/Table/TablaDeOrdenes";
import { AreaDeEntregas } from "./pages/SolicitudServicios/AreaDeEntregas";
import { AsignarFolioExterno } from "./pages/SolicitudServicios/AsignarFolioExterno";
import { CierreDelInforme } from "./pages/OrdenDeTrabajo/CierreDelInforme";
import { DashboardMenu } from "./components/ui/DashboardMenu";
import { Evidencias } from "./pages/OrdenDeTrabajo/Evidencias"
import AsignarTecnico from "./pages/OrdenDeTrabajo/AsignarTecnico"
import { TecnicosTable } from "./pages/Desplegable/TecnicosTable"
import { ProjectAndActManager } from "./pages/Desplegable/EditarProyects&Act"
import { InformeCompleto } from "./pages/OrdenDeTrabajo/InformeCompleto"
import { DiagnosticoTecnico } from "./pages/OrdenDeTrabajo/DiagnosticoTecnico"
import { Historial } from "./pages/SolicitudServicios/Historial"
import { TablaResumenEstados } from "./pages/Desplegable/TablaResumenEstados";
import EditarUsuario from "./pages/Desplegable/EditarUsuario";
import { TablaDeUsuarios } from "./pages/Desplegable/TablaDeUsuarios";

function App() {
  return (
    <AuthProvider>
      <SoliProvider>
        <OrdenDeTrabajoProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar />
              <main className="content">
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/soli/registro/:id" element={<FormularioSolicitud />} />
                    <Route path="/register/EditarUsuario/:id" element={<EditarUsuario />} />
                    <Route path="/soli/abonar/:id" element={<AreaDeEntregas />} />
                    <Route path="/soli" element={<TablaDeRegistros />} />
                    <Route path="/soli/TablaResumenEstados" element={<TablaResumenEstados />} />
                    <Route path="/dashboard" element={<DashboardMenu />} />
                    <Route path="/soli/folioExterno/:id" element={<AsignarFolioExterno />} />
                    <Route path="/soli/editarFirmas/" element={<Firmas />} />
                    <Route path="/tecnico/:id" element={<FormularioOrden />} />
                    <Route path="/personalTecnicos" element={<TecnicosTable />} />
                    <Route path="/TablaDeUsuarios" element={<TablaDeUsuarios />} />
                    <Route path="/tecnico/orden" element={<TablaDeOrdenes />} />
                    <Route path="/tecnico2/:id" element={<CierreDelInforme />} />
                    <Route path="/evidencias/:id" element={<Evidencias />} />
                    <Route path="/asignarTec/:id" element={<AsignarTecnico />} />
                    <Route path="/proyectAndAct" element={<ProjectAndActManager />} />
                    <Route path="/verInforme/:id" element={<InformeCompleto />} />
                    <Route path="/informacionOrden/:id" element={<DiagnosticoTecnico />} />

                    <Route path="/historial/:id" element={<Historial />} />
                  </Route>
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </OrdenDeTrabajoProvider>
      </SoliProvider>
    </AuthProvider>
  );
}

export default App;