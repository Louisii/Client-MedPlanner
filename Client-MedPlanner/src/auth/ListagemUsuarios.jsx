import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Layout from '../components/Layout';
import axiosWithToken from '../lib/RequestInterceptor';
import { FaUserDoctor } from 'react-icons/fa6';

const ListagemUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [filterCargo, setFilterCargo] = useState('Todos');
    const navigate = useNavigate();

    const opcoesCargo = [
        { value: 'Todos', label: 'Todos' },
        { value: 'ADMINISTRADOR', label: 'Administrador(a)' },
        { value: 'RECEPCAO', label: 'Recepcionista' },
        { value: 'MEDICO', label: 'Médico(a)' }
    ];

    useEffect(() => {
        getUsuarios();
    }, []);

    useEffect(() => {
        let filtered = usuarios;
        if (filterCargo !== 'Todos') {
            filtered = usuarios.filter(user => user.cargo === filterCargo);
        }
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
        setFilteredUsuarios(filtered);
    }, [filterCargo, usuarios]);

    const getUsuarios = () => {
        axiosWithToken.get('http://localhost:8080/usuario/listar')
            .then((response) => {
                const sortedUsuarios = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
                setUsuarios(sortedUsuarios);
                setFilteredUsuarios(sortedUsuarios);
            })
            .catch((error) => { console.log("Error fetching users:", error) });
    };

    return (
        <Layout>
            <div className='p-4'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Listagem de Usuários</h2>
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center'>
                            <label className='mr-2'>Filtrar por Cargo:</label>
                            <select
                                className='p-2 border border-gray-300 rounded'
                                value={filterCargo}
                                onChange={(e) => setFilterCargo(e.target.value)}
                            >
                                {opcoesCargo.map((cargo, index) => (
                                    <option key={index} value={cargo.value}>{cargo.label}</option>
                                ))}
                            </select>
                        </div>
                        <Button onClick={() => navigate('/cadastro-usuario')} text="Novo Usuário" className="bg-blue-500 text-white p-2 rounded" />
                    </div>
                </div>

                <p className='text-right mb-4'>{filteredUsuarios.length} resultados</p>

                {filteredUsuarios.length > 0 ? (
                    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                        {filteredUsuarios.map((u) => (
                            <div key={u.idUsuario} className='m-4 p-4 grid grid-cols-2 gap-8 border border-gray-100 rounded-lg shadow-md'>
                                <div>
                                    <h2 className='text-xl font-bold'>{u.nome}</h2>
                                    <p>
                                        {u.cargo === 'RECEPCAO' ? 'Recepção' : u.cargo === 'MEDICO' ? 'Médico(a)' : 'Administrador(a)'}
                                    </p>
                                    {u.cargo === 'MEDICO' &&
                                        <div>

                                            <h2 className=' text-gray-600 font-bold text-sm flex flex-row gap-2 items-center'>
                                                <FaUserDoctor /> {u.especialidade.nome} - {u.especialidade.sigla.toUpperCase()}
                                            </h2>
                                        </div>
                                    }

                                </div>
                                <div className='flex items-center text-sm justify-end h-9 gap-2'>
                                    {u.cargo === "MEDICO" && (
                                        <div className='flex items-center text-sm justify-end h-9'>
                                            <Button onClick={() => navigate(`/agenda-profissional/${u.idUsuario}`)} text="Agenda" />
                                        </div>
                                    )}
                                    <div className='flex items-center text-sm justify-end h-9'>
                                        <Button onClick={() => navigate(`/usuario/${u.idUsuario}`)} text="Detalhes" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='p-4'>
                        <div className='m-10'>
                            <p className='text-gray-400 text-center'>Nenhum registro encontrado</p>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ListagemUsuarios;
