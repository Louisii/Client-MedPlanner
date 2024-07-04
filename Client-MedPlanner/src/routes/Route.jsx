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
import EsqueciSenha from "../pages/EsqueciSenha";
import FiltroLocacao from "../auth/FiltroLocacao";

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
        },
        {
          path: "/esqueci-senha",
          element: <EsqueciSenha />
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
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR']} />,
          children: [
            { path: "", element: <CadastroUsuario /> }
          ]
        },
        {
          path: "/edicao-usuario/:usuarioId",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR']} />,
          children: [
            { path: "", element: <CadastroUsuario /> }
          ]
        },
        {
          path: "/usuario/:usuarioId",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR']} />,
          children: [
            { path: "", element: <DetalhesUsuario /> }
          ]
        },
        {
          path: "/listagem-usuario",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR']} />,
          children: [
            { path: "", element: <ListagemUsuarios /> }
          ]
        },
        {
          path: "/cadastro-especialidade",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR']} />,
          children: [
            { path: "", element: <CadastroEspecialidade /> }
          ]
        },
        {
          path: "/listagem-especialidade",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR']} />,
          children: [
            { path: "", element: <ListagemEspecialidades /> }
          ]
        },
        {
          path: "/cadastro-sala",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR', 'RECEPCAO']} />,
          children: [
            { path: "", element: <CadastroSala /> }
          ]
        },
        {
          path: "/listagem-sala",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR', 'RECEPCAO']} />,
          children: [
            { path: "", element: <ListagemSala /> }
          ]
        },
        {
          path: "/edicao-especialidade/:especialidadeId",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR']} />,
          children: [
            { path: "", element: <CadastroEspecialidade /> }
          ]
        },
        {
          path: "/edicao-sala/:idSala",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR', 'RECEPCAO']} />,
          children: [
            { path: "", element: <CadastroSala /> }
          ]
        },
        {
          path: "/cadastro-ala/",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR', 'RECEPCAO']} />,
          children: [
            { path: "", element: <CadastroAla /> }
          ]
        },
        {
          path: "/edicao-ala/:alaId",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR', 'RECEPCAO']} />,
          children: [
            { path: "", element: <CadastroAla /> }
          ]
        },
        {
          path: "/listagem-alas",
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR', 'RECEPCAO']} />,
          children: [
            { path: "", element: <ListagemAlas/> }
          ]
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
          element: <ProtectedRoute allowedRoles={['ADMINISTRADOR']} />,
          children: [
            { path: "", element: <Relatorios/> }
          ]
        },
        {
          path: "/minha-conta",  
          element: <MinhaConta />
        },
        {
          path: "/alterar-senha",  
          element: <AlterarSenha />
        },
        {
          path: "/filtro-locacao",
          element: <FiltroLocacao />,
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
