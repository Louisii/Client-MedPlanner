import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Layout from '../components/Layout';
import axiosWithToken from '../lib/RequestInterceptor';

const ListagemUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [filterCargo, setFilterCargo] = useState('Selecione');
    const navigate = useNavigate();

    const opcoesCargo = [
        { value: 'Selecione', label: 'Selecione' },
        { value: 'ADMINISTRADOR', label: 'Administrador(a)' },
        { value: 'RECEPCAO', label: 'Recepcionista' },
        { value: 'MEDICO', label: 'Médico(a)' }
    ];

    useEffect(() => {
        getUsuarios();
    }, []);

    useEffect(() => {
        if (filterCargo === 'Selecione') {
            setFilteredUsuarios(usuarios);
        } else {
            const filtered = usuarios.filter(user => user.cargo === filterCargo);
            setFilteredUsuarios(filtered);
        }
    }, [filterCargo, usuarios]);

    const getUsuarios = () => {
        axiosWithToken.get('http://localhost:8080/usuario/listar')
            .then((response) => {
                setUsuarios(response.data);
                setFilteredUsuarios(response.data);
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
                                    <p>{u.cargo === 'RECEPCAO' ? 'Recepção' : u.cargo === 'MEDICO' ? 'Médico(a)' : 'Administrador(a)'}</p>
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
