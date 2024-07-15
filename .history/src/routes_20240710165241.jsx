import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";

//este verifica si el usuario esta autenticado para proteger las paginas
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <h1>Imposible regresa y inicia sesion o create una cuenta :b</h1>;

  //Si no esta autenticado(si no inicio sesion)
  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;

  return <Outlet />;//Outlet es componente que esta  adentro segun yo es el 
  //que va a cargar o el actual no lo se
};
