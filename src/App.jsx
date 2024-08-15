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
import { RegisterSolicitudPage } from "./pages/SolicitudServicios/RegisterSolicitudPage";
import { SolicitudTable } from "./pages/SolicitudServicios/Table/SolicitudTable";
import { RegisterTecnicoPage } from "./pages/OrdenDeTrabajo/RegisterTecnicoPage";
import { TecnicoPage } from "./pages/OrdenDeTrabajo/Table/TecnicoPage";
import { AbonoSolicitud } from "./pages/SolicitudServicios/AbonoSolicitud";
import { FolioExterno } from "./pages/SolicitudServicios/FolioExterno";
import { RegisterTecPage2 } from "./pages/OrdenDeTrabajo/RegisterTecPage2";
import { DashboardMenu } from "./components/ui/DashboardMenu";
import { Evidencias } from "./pages/OrdenDeTrabajo/Evidencias"
import AsignarTecnico from "./pages/OrdenDeTrabajo/AsignarTecnico"
import {TecnicosTable} from "./pages/Desplegable/TecnicosTable"
import { ProjectAndActManager } from "./pages/Desplegable/EditarProyects&Act"
import { VerInforme } from "./pages/OrdenDeTrabajo/VerInformePage"
import { InformacionOrden } from "./pages/OrdenDeTrabajo/InformacionOrden"
import { Historial } from "./pages/SolicitudServicios/Historial"
import { TablaResumenEstados } from "./pages/SolicitudServicios/Table/TablaResumenEstados";

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
                  <Route path="/register" element={<RegisterPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/soli/registro/:id" element={<RegisterSolicitudPage />} />
                    <Route path="/soli/abonar/:id" element={<AbonoSolicitud />} />
                    <Route path="/soli" element={<SolicitudTable />} />
                    <Route path="/soli/TablaResumenEstados" element={<TablaResumenEstados />} />
                    <Route path="/dashboard" element={<DashboardMenu />} />
                    <Route path="/soli/folioExterno/:id" element={<FolioExterno />} />
                    <Route path="/soli/editarFirmas/" element={<Firmas />} />
                    <Route path="/tecnico/:id" element={<RegisterTecnicoPage />} />
                    <Route path="/personalTecnicos" element={<TecnicosTable />} />
                    <Route path="/tecnico/orden" element={<TecnicoPage />} />
                    <Route path="/tecnico2/:id" element={<RegisterTecPage2 />} />
                    <Route path="/evidencias/:id" element={<Evidencias />} />
                    <Route path="/asignarTec/:id" element={<AsignarTecnico />} />
                    <Route path="/proyectAndAct" element={<ProjectAndActManager />} />
                    <Route path="/verInforme/:id" element={<VerInforme />} />
                    <Route path="/informacionOrden/:id" element={<InformacionOrden />} />
                   
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