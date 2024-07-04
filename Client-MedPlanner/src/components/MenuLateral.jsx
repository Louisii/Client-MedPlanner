import { FaChevronDown, FaHome, FaHospital, FaListAlt, FaSignOutAlt, FaStethoscope, FaUserCircle, FaUserPlus, FaUsers, FaFileAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logoMedPlanner.png';
import SubmenuItem from './SubmenuItem';

const MenuLateral = () => {
    const navigate = useNavigate();
    const userRole = sessionStorage.getItem('role');

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
        sessionStorage.clear();
        localStorage.clear();
        navigate("/", { replace: true });
    };

    const menuItems = {
        ADMINISTRADOR: [
            {
                id: 'usuarios_menu',
                title: 'Usuários',
                icon: <FaUsers />,
                link: '/listagem-usuarios',
                itens: [
                    { id: 'cadastrar_usuario_menu', title: 'Cadastrar Usuário', icon: <FaUserPlus />, link: '/cadastro-usuario' },
                    { id: 'lista_de_usuarios_menu', title: 'Lista de Usuários', icon: <FaUsers />, link: '/listagem-usuario' },
                    { id: 'cadastrar_especialidade_menu', title: 'Cadastrar Especialidade', icon: <FaUserPlus />, link: '/cadastro-especialidade' },
                    { id: 'listar_especialidade_menu', title: 'Lista de Especialidades', icon: <FaListAlt />, link: '/listagem-especialidade' }
                ]
            },
            {
                id: 'sala_menu',
                title: 'Salas',
                icon: <FaStethoscope />,
                link: '/listagem-sala',
                itens: [
                    { id: 'cadastro_sala_menu', title: 'Cadastrar Sala', icon: <FaListAlt />, link: '/cadastro-sala' },
                    { id: 'lista_de_salas_menu', title: 'Lista de Salas', icon: <FaListAlt />, link: '/listagem-sala' },
                    { id: 'cadastrar_ala_menu', title: 'Cadastrar Ala', icon: <FaHospital />, link: '/cadastro-ala' },
                    { id: 'listar_alas_menu', title: 'Lista de Alas', icon: <FaHospital />, link: '/listagem-alas' }
                ]
            },
            {
                id: 'relatorios_menu',
                title: 'Relatórios',
                icon: <FaFileAlt />,
                link: '/relatorios',
                itens: [
                    { id: 'relatorio_sala_menu', title: 'Relatório de Salas', icon: <FaUserPlus />, link: '/relatorios/sala' },
                    { id: 'relatorio_medico_menu', title: 'Relatório de Médicos', icon: <FaUsers />, link: '/relatorios/medico' },
                    { id: 'relatorio_diario_menu', title: 'Relatório Diário', icon: <FaUsers />, link: '/relatorios/diario' }
                ]
            }
        ],
        RECEPCAO: [
            {
                id: 'sala_menu',
                title: 'Salas',
                icon: <FaStethoscope />,
                link: '/listagem-sala',
                itens: [
                    { id: 'cadastro_sala_menu', title: 'Cadastrar Sala', icon: <FaListAlt />, link: '/cadastro-sala' },
                    { id: 'lista_de_salas_menu', title: 'Lista de Salas', icon: <FaListAlt />, link: '/listagem-sala' },
                    { id: 'cadastrar_ala_menu', title: 'Cadastrar Ala', icon: <FaHospital />, link: '/cadastro-ala' },
                    { id: 'listar_alas_menu', title: 'Lista de Alas', icon: <FaHospital />, link: '/listagem-alas' }
                ]
            }
        ],
        MEDICO: []
    };

    const minhaContaItem = {
        id: 'minha_conta_menu',
        title: 'Minha Conta',
        icon: <FaUserCircle />,
        link: '/minha-conta',
        itens: []
    };

    const menuToDisplay = menuItems[userRole] || [];

    return (
        <div className="h-screen bg-white shadow-md rounded-lg py-8">
            <div className='w-full mb-8 mt-4'>
                <img src={logo} alt="logo sga" className='w-48 mx-auto' />
            </div>
            <ul className='py-10'>
                <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                    <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to="/home">
                        <FaHome /> Home
                    </Link>
                </li>
                {menuToDisplay.map((item) => (
                    <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0' key={item.id}>
                        <div>
                            <div onClick={() => expandElement(item.id)} className='flex items-center gap-4 w-full pr-12 cursor-pointer hover:text-teal-700 '>
                                {item.icon}
                                {item.title}
                                {item.itens.length > 0 && <FaChevronDown className='ml-auto text-end hover:text-teal-700' />}
                            </div>
                            <div id={item.id} className={`transition-all duration-500 ${item.itens.length ? 'invisible h-0' : ''}`}>
                                {item.itens.map((itemFilho) => (
                                    <div key={itemFilho.id} className='pl-6 p-2 pt-4'>
                                        <SubmenuItem to={itemFilho.link} text={itemFilho.title} icon={itemFilho.icon} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </li>
                ))}
                <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                    <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to={minhaContaItem.link}>
                        {minhaContaItem.icon}
                        {minhaContaItem.title}
                    </Link>
                </li>
                <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0'>
                    <Link className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center' to="/" onClick={handleClickSair}>
                        <FaSignOutAlt /> Sair
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default MenuLateral;
