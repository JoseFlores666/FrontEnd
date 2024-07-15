import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/authContext";
import { ProtectedRoute } from "./routes";
import HomePage from "./pages/HomePage";
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

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // if (isAuthenticated) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <SoliProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <main className="content">
              <Routes>
                <Route path="/" element={
                  <RedirectAuthenticatedUser>
                    <LoginPage />
                  </RedirectAuthenticatedUser>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/soli/registro/:id" element={<RegisterSolicitudPage />} />
                  <Route path="/soli/abonar/:id" element={<AbonoSolicitud />} />
                  <Route path="/soli" element={<SolicitudTable />} />
                  <Route path="/dashboard" element={<DashboardMenu />} />
                  <Route path="/soli/folioExterno/:id" element={<FolioExterno />} />
                  <Route path="/soli/editarFirmas/" element={<Firmas />} />
                  <Route path="/tecnico" element={<RegisterTecnicoPage />} />
                  <Route path="/tecnico/orden" element={<TecnicoPage />} />
                  <Route path="/tecnico2/:id" element={<RegisterTecPage2 />} />
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