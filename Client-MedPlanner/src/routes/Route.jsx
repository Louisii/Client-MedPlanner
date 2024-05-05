import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../lib/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import CadastroPaciente from "../auth/CadastroPaciente";
import Home from "../auth/Home";
import ListagemDePacientes from "../auth/ListagemDePacientes";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CadastroUsuario from "../pages/CadastroUsuario";

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        {
          path: "/",
          element: <Login />
        },
        {
          path: "/sign-up",
          element: <Signup />
        },
        {
          path: "/cadastro-usuario",
          element: <CadastroUsuario />
        }
      ]
    }
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/cadastro-paciente",
          element: <CadastroPaciente />,
        },
        {
          path: "/listagem-pacientes",
          element: <ListagemDePacientes />,
        },

      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;