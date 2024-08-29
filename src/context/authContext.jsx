import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest, ActualizaUsuario, getUsuarios, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 200) {
        
        //coloca verdadero si ya esta autenticado(si ya se resgitro)
        setIsAuthenticated(true);
        return res;
      }
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);

      //coloca verdadero si ya esta autenticado(si ya inicio sesion)
      setIsAuthenticated(true);
      return res;
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };
  const traerUsuarios = async () => {
    try {
      const res = await getUsuarios();
      console.log(res.data)
      setUsuarios(res.data)
    } catch (error) {
      console.log(error.response.data.mensaje);
      setErrors(error.response.data.mensaje);
    }
  };
  const ActualizarMyUsuario = async (id, user) => {
    try {
      const res = await ActualizaUsuario(id, user);
      setErrors([]);
      return res;
    } catch (error) {
      console.log(error.response.data.mensaje);
      setErrors(error.response.data.mensaje);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);

  };

  //para que se mantega la cookies despues de recargar
  useEffect(() => {
    const checkLogin = async () => {

      const cookies = Cookies.get();//la cookies trae las credenciales(usuario)

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) return setIsAuthenticated(false);

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);

      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        ActualizarMyUsuario,
        traerUsuarios,
        usuarios,
        logout,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
