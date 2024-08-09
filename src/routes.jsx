import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";

//este verifica si el usuario esta autenticado para proteger las paginas
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Imposible</h1>
          <p className="text-lg text-gray-700">Regresa e inicia sesión o crea una cuenta :b</p>
        </div>
      </div>
    );
  }


  //Si no esta autenticado(si no inicio sesion)
  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;

  return <Outlet />;//Outlet es componente que esta  adentro segun yo es el 
  //que va a cargar o el actual no lo se
};
