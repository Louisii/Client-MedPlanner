import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Agenda from "../auth/Agenda";
import CadastroAla from "../auth/CadastroAla";
import CadastroEspecialidade from "../auth/CadastroEspecialidade";
import CadastroSala from "../auth/CadastroSala";
import CadastroUsuario from "../auth/CadastroUsuario";
import DetalhesUsuario from "../auth/DetalhesUsuario";
import Home from "../auth/Home";
import ListagemAlas from "../auth/ListagemAlas";
import ListagemEspecialidades from "../auth/ListagemEspecialidade";
import ListagemSala from "../auth/ListagemSalas";
import ListagemUsuarios from "../auth/ListagemUsuarios";
import MinhaConta from "../auth/MinhaConta";
import { useAuth } from "../lib/AuthProvider";
import Login from "../pages/Login";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

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
          path: "/cadastro-sala",
          element: <CadastroSala />
        },
        {
          path: "/listagem-sala",
          element: <ListagemSala />
        },
        {
          path: "/edicao-especialidade/:especialidadeId",
          element: <CadastroEspecialidade />
        },

        {
          path: "/edicao-sala/:idSala",
          element: <CadastroSala />
        },
        {
          path: "/cadastro-ala/",
          element: <CadastroAla />
        },
        {
          path: "/edicao-ala/:alaId",
          element: <CadastroAla />
        },
        {
          path: "/listagem-alas",
          element: <ListagemAlas />
        },
        {
          path: "/agenda-profissional/:profissionalId",
          element: <Agenda />
        },
        {
<<<<<<< HEAD
          path: "/minha-conta",
          element: <MinhaConta />
        },
        {
          path: "/alterar-senha",
          element: <div>Alterar Senha - Em construção</div>
=======
          path: "/agenda-sala/:salaId",
          element: <Agenda />
>>>>>>> 08ecd5e24962ffd7fcbe329b425d80a3c641a3e2
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