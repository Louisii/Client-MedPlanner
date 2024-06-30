import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Agenda from "../auth/Agenda";
import AlterarSenha from "../auth/AlterarSenha";
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
import Signup from "../pages/Signup";
import Relatorios from "../auth/Relatorios";

const Routes = () => {
  const { token } = useAuth();

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

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
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
        }, {
          path: "/agenda-sala/:salaId",
          element: <Agenda />
        },
        {
          path: "/relatorios/:tipo",
          element: <Relatorios />
        },
        {
          path: "/minha-conta",  // Adicionando a rota Minha Conta
          element: <MinhaConta />
        }
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
