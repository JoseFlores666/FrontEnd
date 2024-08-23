import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function LoginPage() {
  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(loginSchema), });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/soli/registro/:id");
    }
  }, [isAuthenticated]);

  const getErrorMessage = (field) => {
    return loginErrors.find(error => error.toLowerCase().includes(field)) || "";
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card className="shadow-xl border border-black">

        <h1 className="text-2xl font-bold caret-light-50 text-black">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1">
            <Label>Ingresa tu correo:</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
              </span>
              <Input
                type="text"
                id="email"
                className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Innego@hotmail.com"
                {...register("email", { required: true })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 mt-0.5">{errors.email.message}</p>
            )}
            {getErrorMessage("email") && (
              <p className="text-red-500 mt-0.5">{getErrorMessage("email")}</p>
            )}
          </div>

          <div className="mb-1">
            <Label>Ingresa tu contraseña:</Label>
            <div className="flex">
              <Input
                type={showPassword ? "text" : "password"}  // Cambia el tipo de input según el estado
                id="password"
                className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="********"
                autoComplete="email"
                {...register("password", { required: true, minLength: 6 })}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="px-2 rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 mt-0.5">{errors.password.message}</p>
            )}
            {getErrorMessage("contraseña") && (
              <p className="text-red-500 mt-0.5">{getErrorMessage("contraseña")}</p>
            )}
          </div>

          <div className="font-bold mr-4">
            <Button>Iniciar Sesión</Button>
          </div>
        </form>

       
      </Card>
    </div>
  );
}
