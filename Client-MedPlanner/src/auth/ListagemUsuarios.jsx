
import axiosWithToken from '../lib/RequestInterceptor';
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const ListagemUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = () => {
        axiosWithToken.get('http://localhost:8080/usuario/listar')
            .then((response) => { setUsuarios(response.data) })
            .catch((error) => { console.log(error) })
    }

    return (
        <Layout>
            {<div className='p-4'>
                <div className='flex flex-row justify-between h-10'>
                    <h2 className='p-4 text-xl font-bold'>Listagem de Usuários</h2>
                    <Button onClick={() => navigate('/cadastro-usuario')} text="Novo usuário" className="bg-blue-500 text-white p-2 rounded" />
                </div>

                {usuarios.length > 0 ?

                    <div className='p-4'>
                        <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
                            {usuarios.map((u) => (
                                <div className='m-4 p-4 grid grid-cols-2 gap-8 border border-gray-100 rounded-lg shadow-md'>
                                    <div>
                                        <h2 className='text-xl font-bold'>{u.nome}</h2>
                                        <p>{
                                            u.cargo == 'RECEPCAO' ? 'Recepção' : u.cargo == 'MEDICO' ? 'Médico(a)' : 'Administrador(a)'

                                        }</p>
                                    </div>

                                    <div className='flex items-center text-sm justify-end h-9 gap-2'>
                                        {
                                            u.cargo == "MEDICO" ? <div className='flex items-center text-sm justify-end h-9'>
                                                <Button onClick={() => navigate(`/agenda-profissional/${u.idUsuario}`)} text="Agenda" />
                                            </div> : null
                                        }
                                        <div className='flex items-center text-sm justify-end h-9'>
                                            <Button onClick={() => navigate(`/usuario/${u.idUsuario}`)} text="Detalhes" />
                                        </div>
                                    </div>


                                </div>

                            ))}

                        </div>
                    </div>
                    :

                    <div className='p-4'>

                        <div className='m-10'>

                            <p className='text-gray-400 text-center'>Nenhum registro encontrado</p>

                        </div>

                    </div>


                }
            </div >}
        </Layout >
    )

}

export default ListagemUsuarios