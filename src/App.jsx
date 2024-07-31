import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes";
import { Firmas } from "./pages/Firmas";
import RegisterPage from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { SoliProvider } from "./context/SolicitudContext";
import { RegisterSolicitudPage } from "./pages/RegisterSolicitudPage";
import { SolicitudTable } from "./pages/SolicitudTable";
import { RegisterTecnicoPage } from "./pages/RegisterTecnicoPage";
import { TecnicoPage } from "./pages/TecnicoPage";
import { AbonoSolicitud } from "./pages/AbonoSolicitud";
import { FolioExterno } from "./pages/FolioExterno";
import { RegisterTecPage2 } from "./pages/RegisterTecPage2";
import { DashboardMenu } from "./pages/DashboardMenu";
import { Evidencias } from "./pages/Evidencias"
import AsignarTecnico from "./pages/AsignarTecnico"
import { ProjectAndActManager } from "./pages/EditarProyects&Act"
import { VerInforme } from "./pages/VerInformePage"
import { InformacionOrden } from "./pages/InformacionOrden"
import {Historial} from "./pages/Historial"

function App() {
  return (
    <AuthProvider>
      <SoliProvider>
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
                  <Route path="/dashboard" element={<DashboardMenu />} />
                  <Route path="/soli/folioExterno/:id" element={<FolioExterno />} />
                  <Route path="/soli/editarFirmas/" element={<Firmas />} />
                  <Route path="/tecnico/:id" element={<RegisterTecnicoPage />} />
                  <Route path="/tecnico/orden" element={<TecnicoPage />} />
                  <Route path="/tecnico2/:id" element={<RegisterTecPage2 />} />
                  <Route path="/evidencias/:id" element={<Evidencias />} />
                  <Route path="/asignarTec/:id" element={<AsignarTecnico />} />
                  <Route path="/proyectAndAct" element={<ProjectAndActManager />} />
                  <Route path="/verInforme/:id" element={<VerInforme />} />
                  <Route path="/informacionOrden/:id" element={<InformacionOrden />} />
                  <Route path="/historial" element={<Historial />} />
                </Route>
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </SoliProvider>
    </AuthProvider>
  );
}

export default App;