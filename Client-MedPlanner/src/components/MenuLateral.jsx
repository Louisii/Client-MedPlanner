
import { FaChevronDown, FaListAlt, FaSignOutAlt, FaStethoscope, FaUserPlus, FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logoMedPlanner.png';
import SubmenuItem from './SubmenuItem';

const MenuLateral = () => {
    let navigate = useNavigate();
    const expandElement = (itemId) => {
        const element = document.getElementById(itemId);

        if (element.classList.contains("invisible")) {
            element.classList.remove("invisible");
            element.classList.remove("h-0");

        } else {
            element.classList.add("invisible");
            element.classList.add("h-0");
        }
    };

    const handleClickSair = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate("/", { replace: true });
    }


    const menuItems = [
        {
            id: 'usuarios_menu',
            title: 'Usuários',
            icon: <FaUsers />,
            link: '/listagem-usuarios',
            itens: [
                {
                    id: 'cadastrar_paciente_menu',
                    title: 'Cadastrar Usuário',
                    icon: <FaUserPlus />,
                    link: '/cadastro-usuario',
                },
                {
                    id: 'lista_de_pacientes_menu',
                    title: 'Lista de Usuários',
                    icon: <FaUsers />,
                    link: '/listagem-usuario',
                },
                {
                    id: 'lista_de_pacientes_menu',
                    title: 'Cadastrar Especialidade',
                    icon: <FaUsers />,
                    link: '/cadastro-especialidade',
                },
                {
                    id: 'lista_de_pacientes_menu',
                    title: 'Listar Especialidade',
                    icon: <FaUsers />,
                    link: '/listagem-especialidade',
                },
                {
                    id: 'lista_de_pacientes_menu',
                    title: 'Cadastrar Sala',
                    icon: <FaUsers />,
                    link: '/cadastro-sala',
                },
                {
                    id: 'lista_de_pacientes_menu',
                    title: 'Listar Sala',
                    icon: <FaUsers />,
                    link: '/listagem-sala',
                }


            ]
        },
        {
            id: 'sala_menu',
            title: 'Salas',
            icon: <FaStethoscope />,
            link: '/listagem-sala',
            itens: [
                {
                    id: 'cadastro_sala_menu',
                    title: 'Cadastrar Sala',
                    icon: <FaListAlt />,
                    link: '/cadastro-sala',
                },
                {
                    id: 'lista_de_salas_menu',
                    title: 'Listar Sala',
                    icon: <FaListAlt />,
                    link: '/listagem-sala',
                }


            ]
        },
        // {
        //     id: 'ambulatorio_menu',
        //     title: 'Ambulatório',
        //     icon: <FaStethoscope />,
        //     link: '/home',
        //     itens: [
        //         {
        //             id: 'lista_consultas_menu',
        //             title: 'Consultas Agendadas',
        //             icon: <FaListAlt />,
        //             link: '/consultas-agendadas',
        //         },


        //     ]
        // },
        // {
        //     id: 'agenda_menu',
        //     title: 'Agenda',
        //     icon: <FaCalendarAlt />,
        //     link: '/home',
        //     itens: [
        //         {
        //             id: 'cadastrar_agenda_menu',
        //             title: 'Cadastrar Agenda',
        //             icon: <FaCalendarPlus />,
        //             link: '/cadastro-agenda',
        //         },
        //         {
        //             id: 'lista_de_agendas_menu',
        //             title: 'Lista de Agendas',
        //             icon: <FaCalendarAlt />,
        //             link: '/agendas',
        //         },

        //     ]
        // },
        // {
        //     title: 'Ambulatório',
        //     icon: <FaStethoscope />
        // },
        // {
        //     title: 'Agenda',
        //     icon: <FaCalendarAlt />
        // },
        // {
        //     title: 'Corpo Clínico',
        //     icon: <FaUserMd />
        // },
        // {
        //     title: 'Relatório',
        //     icon: <FaFileAlt />
        // },
        // {
        //     title: 'Outros',
        //     icon: <FaEllipsisV />
        // },
    ]



    return (

        <div className=" h-screen bg-white shadow-md rounded-lg py-8 ">
            <div className='w-full mb-8 mt-4'>
                <img src={logo} alt="logo sga" className='w-48 mx-auto' />

                <ul className='py-10'>
                    {/* TODO ordenar itens da lista por ordem alfabetica 
                            https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value */}
                    {/* <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                        <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to="/" onClick={handleClickSair}>
                            <FaHome /> Home
                        </Link>
                    </li>
                    <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                        <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to="/" onClick={handleClickSair}>
                            <FaCalendar /> Agenda
                        </Link>
                    </li>
                    <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                        <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to="/" onClick={handleClickSair}>
                            <FaHospital /> Salas
                        </Link>
                    </li>
                    <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                        <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to="/" onClick={handleClickSair}>
                            <FaUsers /> Usuários
                        </Link>
                    </li>
                    <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                        <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to="/" onClick={handleClickSair}>
                            <FaBook /> Relatório
                        </Link>
                    </li>
                    <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                        <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to="/" onClick={handleClickSair}>
                            <FaUser /> Minha Conta
                        </Link>
                    </li> */}


                    {menuItems.map((item, i) =>
                        <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0' key={i}>
                            <div className=''>
                                <div onClick={(e) => { expandElement(item.id) }} className='flex items-center gap-4 w-full pr-12 cursor-pointer hover:text-teal-700 '>
                                    {item.icon}
                                    {item.title}
                                    <FaChevronDown className='ml-auto text-end hover:text-teal-700' />
                                </div>

                                <div id={item.id} className='invisible h-0' >
                                    {item.itens.map((itemFilho, i) =>
                                        <div key={itemFilho.id} className='pl-6 p-2 pt-4' id={itemFilho.id}>
                                            <SubmenuItem to={itemFilho.link} text={itemFilho.title} icon={itemFilho.icon} />

                                        </div>
                                    )}
                                </div>

                            </div>
                        </li>
                    )}
                    <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                        <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to="/" onClick={handleClickSair}>
                            <FaSignOutAlt /> Sair
                        </Link>
                    </li>
                </ul>
            </div>

        </div >

    );
}
export default MenuLateral 