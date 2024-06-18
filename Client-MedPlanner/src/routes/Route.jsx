import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../lib/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import Home from "../auth/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CadastroUsuario from "../auth/CadastroUsuario";
import ListagemUsuarios from "../auth/ListagemUsuarios";
import DetalhesUsuario from "../auth/DetalhesUsuario";
import ListagemEspecialidades from "../auth/ListagemEspecialidade";
import CadastroEspecialidade from "../auth/CadastroEspecialidade";

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
          path: "/cadastro-usuario",
          element: <CadastroUsuario />
        },
        {
          path: "/edicao-usuario/:usuarioId",
          element: <CadastroUsuario />
        },
        {
          path: "/usuario/:usuarioId",
          element: <DetalhesUsuario />
        },
        {
          path: "/listagem-usuario",
          element: <ListagemUsuarios />
        },
        {
          path: "/cadastro-especialidade",
          element: <CadastroEspecialidade />
        },
        {
          path: "/listagem-especialidade",
          element: <ListagemEspecialidades />
        },
        {
          path: "/edicao-especialidade/:especialidadeId",
          element: <CadastroEspecialidade />
        }

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