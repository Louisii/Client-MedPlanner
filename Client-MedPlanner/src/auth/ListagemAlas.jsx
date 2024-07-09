import React, { useState, useEffect } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';
import Button from '../components/Button';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const ListagemAlas = () => {
    const [alas, setAlas] = useState([]);
    const [filterSituacao, setFilterSituacao] = useState('Selecione');
    const navigate = useNavigate();

    const opcoesSituacao = [
        { value: 'Selecione', label: 'Selecione' },
        { value: 'A', label: 'Ativo' },
        { value: 'I', label: 'Inativo' },
        { value: 'M', label: 'Manutenção' }
    ];

    useEffect(() => {
        getAlas();
    }, [filterSituacao]);

    const getAlas = () => {
        let url = 'http://localhost:8080/ala/listar';
        if (filterSituacao !== 'Selecione') {
            url = `http://localhost:8080/ala/buscar/situacao/${filterSituacao}`;
        }

        axiosWithToken.get(url)
            .then((response) => { setAlas(response.data) })
            .catch((error) => { console.log(error) });
    };


    const traduzirSituacao = (situacao) => {
        switch (situacao) {
            case 'A':
                return 'Ativo';
            case 'I':
                return 'Inativo';
            case 'E':
                return 'Em manutenção';
            default:
                return situacao;
        }
    };

    return (
        <Layout>
            <div className='p-4'>
                <div className='flex flex-row justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Listagem de Alas</h2>
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center'>
                            <label className='mr-2'>Filtrar por Situação:</label>
                            <select
                                className='p-2 border border-gray-300 rounded'
                                value={filterSituacao}
                                onChange={(e) => setFilterSituacao(e.target.value)}
                            >
                                {opcoesSituacao.map((situacao, index) => (
                                    <option key={index} value={situacao.value}>{situacao.label}</option>
                                ))}
                            </select>
                        </div>
                        <Button onClick={() => navigate('/cadastro-ala')} text="Nova Ala" className="bg-blue-500 text-white p-2 rounded" />
                    </div>
                </div>
                <p className='text-right mb-4'>{alas.length} resultados</p>
                {alas.length > 0 ? (
                    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                        {alas.map((ala) => (
                            <div key={ala.idAla} className='m-4 p-4 grid grid-cols-2 gap-8 border border-gray-100 rounded-lg shadow-md'>
                                <div>
                                    <h2 className='text-xl font-bold'>{ala.nome}</h2>
                                    <p><strong>Situação:</strong> {traduzirSituacao(ala.situacao)}</p>
                                </div>
                                <div className='flex items-center text-sm justify-end h-9 gap-2'>
                                    <Button onClick={() => navigate(`/edicao-ala/${ala.idAla}`)} text="Editar" />
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

export default ListagemAlas;
