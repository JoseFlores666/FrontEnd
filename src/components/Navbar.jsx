import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { DashboardMenu } from '../pages/DashboardMenu'; // Importa el componente

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [isSolicitudesDropdownOpen, setIsSolicitudesDropdownOpen] = useState(false);
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  function cerrarSesion() {
    logout();
  }

  const toggleDashboardMenu = (state) => {
    setIsDashboardMenuOpen(state);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside2(event) {
      if (!event.target.closest('.solicitudes-dropdown')) {
        setIsSolicitudesDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside2);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-gray-50 dark:bg-black">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to={isAuthenticated ? "/soli/registro/:id" : "/"} className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQECmkNjpPwLnbAXf3j5eavPu0QSYoOfiNA8A&s"
              className="h-8 cursor-pointer"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Solicitudes Innego</span>
          </Link>
          <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
            <ul className="flex items-center space-x-3 rtl:space-x-reverse font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
              {isAuthenticated ? (
                <>
                  <li className="me-2">
                    <Link
                      className={` p-4  rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-blue-600 ${activeLink === "/" ? "text-blue-600 " : "text-gray-900 dark:text-white"}`}
                      onClick={() => toggleDashboardMenu(!isDashboardMenuOpen)}
                    >
                      Credenciales
                    </Link>
                    <DashboardMenu isOpen={isDashboardMenuOpen} toggleMenu={toggleDashboardMenu} />

                  </li>
                  <li className="me-2">
                    <Link
                      to="/tecnico/:id"
                      className={` p-4  rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-blue-600 ${activeLink === "/tecnico" ? "text-blue-600 " : "text-gray-900 dark:text-white"}`}
                      onClick={() => setActiveLink("/tecnic/:id")}
                    >
                      Registrar Orden
                    </Link>
                  </li>

                  <li className="me-2">
                    <Link
                      to="/soli/registro/:id"
                      className={` p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-blue-600 ${activeLink === "/soli/registro/:id" ? "text-blue-600 " : "text-gray-900 dark:text-white"}`}
                      onClick={() => setActiveLink("/soli/registro/:id")}
                    >
                      Registrar Solicitud
                    </Link>
                  </li>


                  <li className="me-2 relative solicitudes-dropdown">
                    <button
                      onClick={() => setIsSolicitudesDropdownOpen(!isSolicitudesDropdownOpen)}
                      className={`rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-blue-600 ${activeLink === "/soli" ? "text-blue-600 " : "text-gray-900 dark:text-white"}`}
                    >
                      Solicitudes
                    </button>
                    <div
                      className={`origin-top-right absolute right-0  w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none dark:bg-gray-700 dark:divide-gray-600 ${isSolicitudesDropdownOpen ? "block" : "hidden"}`}
                    >
                      <ul className="">
                        <li>
                          <Link
                            to="/soli"
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white ${activeLink === "/soli" ? "text-blue-600" : ""}`}
                            onClick={() => setActiveLink("/soli")}
                          >
                            Servicios y Bienes de Consumo Final
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/tecnico/orden"
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white ${activeLink === "/tecnico/orden" ? "text-blue-600" : ""}`}
                            onClick={() => setActiveLink("/tecnico/orden")}
                          >
                            Orden De Trabajo De Mantenimiento A Mobiliario E Instalaciones
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/soli/editarFirmas"
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white ${activeLink === "/soli/editarFirmas" ? "text-blue-600" : ""}`}
                            onClick={() => setActiveLink("/soli/editarFirmas")}
                          >
                            Editar nombre de las firmas
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>


                  <div className="relative inline-block text-left dropdown">
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png"
                      className="h-8 cursor-pointer"
                      alt="Flowbite Logo"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                    <div
                      className={`origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none dark:bg-gray-700 dark:divide-gray-600 ${isDropdownOpen ? "block" : "hidden"}`}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                    >

                      <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 dark:text-white">{user.username}</span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                      </div>
                      <ul className="py-2" aria-labelledby="user-menu-button">
                        <li>
                          <Link to="/" onClick={cerrarSesion} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Cerrar Sesión</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <li className="me-2">
                    <Link
                      to="/login"
                      className={` p-4  rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-blue-600 ${activeLink === "/login" ? "text-blue-600 " : "text-gray-900 dark:text-white"}`}
                      onClick={() => setActiveLink("/login")}
                    >
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li className="me-2">
                    <Link
                      to="/register"
                      className={` p-4  rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-blue-600 ${activeLink === "/register" ? "text-blue-600 " : "text-gray-900 dark:text-white"}`}
                      onClick={() => setActiveLink("/register")}
                    >
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
