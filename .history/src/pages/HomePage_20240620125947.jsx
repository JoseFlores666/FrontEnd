import React from "react";
import { Link } from "react-router-dom";


function HomePage() {

  return (
    <section className="min-h-screen flex justify-center items-center">
      <div className="bg-white text-black rounded-md shadow-2xl p-8 border border-black">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido a Nuestra Plataforma de Solicitudes
        </h1>
        <p className="text-lg text-gray-900 mb-6">
          En nuestra plataforma, puede realizar solicitudes de manera eficiente
          y segura. Nos dedicamos a brindarle el mejor servicio posible.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 shadow-2xl hover:bg-blue-800 text-white px-6 py-3 rounded-md inline-block border border-black"
          aria-label="Iniciar Sesión"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="bg-gray-500 shadow-2xl hover:bg-gray-800 text-white px-6 py-3 rounded-md inline-block ml-4 border border-black"
          aria-label="Registrarse"
        >
          Registrarse
        </Link>
      </div>
   
    </section>
  );
}

export default HomePage;
