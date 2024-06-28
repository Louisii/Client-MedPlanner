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
                    id: 'cadastrar_usuario_menu',
                    title: 'Cadastrar Usuário',
                    icon: <FaUserPlus />,
                    link: '/cadastro-usuario',
                },
                {
                    id: 'lista_de_usuarios_menu',
                    title: 'Lista de Usuários',
                    icon: <FaUsers />,
                    link: '/listagem-usuario',
                },
                {
                    id: 'cadastrar_especialidade_menu',
                    title: 'Cadastrar Especialidade',
                    icon: <FaUserPlus />,
                    link: '/cadastro-especialidade',
                },
                {
                    id: 'listar_especialidade_menu',
                    title: 'Listar Especialidade',
                    icon: <FaListAlt />,
                    link: '/listagem-especialidade',
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
        }
    ]

    return (
        <div className="h-screen bg-white shadow-md rounded-lg py-8">
            <div className='w-full mb-8 mt-4'>
                <img src={logo} alt="logo sga" className='w-48 mx-auto' />

                <ul className='py-10'>
                    {menuItems.map((item) =>
                        <li className='text-gray-500 w-full shadow-sm py-3 pl-6 pr-0' key={item.id}>
                            <div>
                                <div onClick={() => { expandElement(item.id) }} className='flex items-center gap-4 w-full pr-12 cursor-pointer hover:text-teal-700 '>
                                    {item.icon}
                                    {item.title}
                                    <FaChevronDown className='ml-auto text-end hover:text-teal-700' />
                                </div>

                                <div id={item.id} className='invisible h-0'>
                                    {item.itens.map((itemFilho) =>
                                        <div key={itemFilho.id} className='pl-6 p-2 pt-4'>
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
        </div>
    );
}

export default MenuLateral;
