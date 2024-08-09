import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

function Register() {
  const { signup, errors: registerErrors, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (value) => {
    await signup(value);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/soli/registro/:id");
  }, [isAuthenticated]);

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center">
      <Card className="border border-black">
        {registerErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-3xl font-bold">Registrate</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <Label htmlFor="username">Usuario:</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
              </span>
              <Input
                type="text"
                name="username"
                placeholder="Ingresa tu Usuario"
                {...register("username")}
                className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            {errors.username?.message && (
              <p className="text-red-500 mt-1">{errors.username?.message}</p>
            )}
          </div>

          <div className="">
            <Label htmlFor="email">Email:</Label>
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
                name="email"
                placeholder="Ingresa tu Email"
                autoComplete="email"
                {...register("email")}
                className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            {errors.email?.message && (
              <p className="text-red-500 mt-1">{errors.email?.message}</p>
            )}
          </div>
          <div className="">
            <Label htmlFor="password">Contraseña:</Label>
            <div className="flex">
              <Input
                type="password"
                name="password"
                placeholder="********"
                {...register("password")}
                className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            {errors.password?.message && (
              <p className="text-red-500 mt-1">{errors.password?.message}</p>
            )}
          </div>

          <div className="">
            <Label htmlFor="confirmPassword">Confirmar Contraseña:</Label>
            <div className="flex">
              <Input
                type="password"
                name="confirmPassword"
                placeholder="********"
                {...register("confirmPassword")}
                className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            {errors.confirmPassword?.message && (
              <p className="text-red-500 mt-1">{errors.confirmPassword?.message}</p>
            )}

            <div className="font-bold mr-4">
              <Button>Registrarse</Button>
            </div>
          </div>
        </form>
        <p>
          ¿Ya tienes cuenta?
          <Link className="text-sky-500 font-bold" to="/login">
            Login
          </Link>
        </p>
      </Card>
    </div>
  )
}
export default Register;
