import axiosWithToken from '../lib/RequestInterceptor';
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const ListagemEspecialidades = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getEspecialidades();
    }, []);

    const getEspecialidades = () => {
        axiosWithToken.get('http://localhost:8080/especialidade/listar')
            .then((response) => { setEspecialidades(response.data) })
            .catch((error) => { console.log(error) });
    };

    return (
        <Layout>
            <div className='p-4'>
                <div className='flex flex-row justify-between h-10'>
                    <h2 className='p-4 text-xl font-bold'>Listagem de Especialidades</h2>
                    <Button onClick={() => navigate('/cadastro-especialidade')} text="Nova Especialidade" className="bg-blue-500 text-white p-2 rounded" />
                </div>

                {especialidades.length > 0 ? (
                    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                        {especialidades.map((especialidade) => (
                            <div key={especialidade.idEspecialidade} className='m-4 p-4 grid grid-cols-2 gap-8 border border-gray-100 rounded-lg shadow-md'>
                                <div>
                                    <h2 className='text-xl font-bold'>{especialidade.nome}</h2>
                                    <h2 className=' text-gray-600 font-semibold'>{especialidade.sigla.toUpperCase()}</h2>
                                </div>
                                <div className='flex items-center text-sm justify-end h-9 gap-2'>
                                    <Button onClick={() => navigate(`/edicao-especialidade/${especialidade.idEspecialidade}`)} text="Editar" />
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

export default ListagemEspecialidades;
