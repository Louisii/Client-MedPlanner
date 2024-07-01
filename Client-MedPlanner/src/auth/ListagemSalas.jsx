import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Layout from '../components/Layout';
import axiosWithToken from '../lib/RequestInterceptor';

const ListagemSala = () => {
    const [salas, setSalas] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [salaToDelete, setSalaToDelete] = useState(null);
    const [filterAla, setFilterAla] = useState('Selecione');
    const [filterSituacao, setFilterSituacao] = useState('Selecione');
    const [opcoesAla, setOpcoesAla] = useState([{ value: 'Selecione', label: 'Selecione' }]);
    const opcoesSituacao = [
        { value: 'Selecione', label: 'Selecione' },
        { value: 'A', label: 'Ativo' },
        { value: 'I', label: 'Inativo' },
        { value: 'M', label: 'Manutenção' }
    ];
    const navigate = useNavigate();

    useEffect(() => {
        getSalas();
        getAlas();
    }, []);

    useEffect(() => {
        getSalas();
    }, [filterAla, filterSituacao]);

    const getSalas = () => {
        const params = {};
        if (filterAla !== 'Selecione') params.idAla = filterAla;
        if (filterSituacao !== 'Selecione') params.situacao = filterSituacao;

        axiosWithToken.get('http://localhost:8080/sala/buscar', { params })
            .then((response) => { setSalas(response.data) })
            .catch((error) => { console.log(error) });
    };

    const getAlas = () => {
        axiosWithToken.get('http://localhost:8080/ala/buscar')
            .then((response) => {
                if (response.status === 200) {
                    const alas = response.data.map((ala) => ({ value: ala.idAla, label: ala.nome }));
                    setOpcoesAla([{ value: 'Selecione', label: 'Selecione' }, ...alas]);
                } else {
                    console.error(`Falha ao obter alas: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter alas:', error.message);
            });
    };

    const openDeleteModal = (sala) => {
        setSalaToDelete(sala);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSalaToDelete(null);
    };

    const confirmDelete = () => {
        if (salaToDelete) {
            axiosWithToken.delete(`http://localhost:8080/sala/deletar/${salaToDelete.idSala}`)
                .then((response) => {
                    console.log(response.data); // Assuming backend returns a success message
                    getSalas(); // Refresh the list after deletion
                    closeDeleteModal();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleEditSala = (idSala) => {
        navigate(`/edicao-sala/${idSala}`);
    };

    const handleAgendaSala = (idSala) => {
        navigate(`/agenda-sala/${idSala}`);
    };

    return (
        <Layout>
            <div className='p-4'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Listagem de Salas</h2>
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center'>
                            <label className='mr-2'>Filtrar por ala:</label>
                            <select
                                className='p-2 border border-gray-300 rounded'
                                value={filterAla}
                                onChange={(e) => setFilterAla(e.target.value)}
                            >
                                {opcoesAla.map((ala, index) => (
                                    <option key={index} value={ala.value}>{ala.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex items-center'>
                            <label className='mr-2'>Filtrar por situação:</label>
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
                        <Button onClick={() => navigate('/cadastro-sala')} text="Nova Sala" className="bg-blue-500 text-white p-2 rounded" />
                    </div>
                </div>

                <p className='text-right mb-4'>{salas.length} resultados</p>

                {salas.length > 0 ? (
                    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                        {salas.map((sala) => (
                            <div key={sala.idSala} className='m-4 p-4 border border-gray-200 rounded-lg shadow-md bg-gray-100'>
                                <div className='grid grid-cols-1 md:grid-cols-2'>
                                    <div>
                                        <h2 className='text-lg font-bold'>Sala {sala.idSala}</h2>
                                        <p><strong>Ala:</strong> {sala.ala.nome}</p>
                                        <p><strong>Andar:</strong> {sala.andar}</p>
                                        <p><strong>Situação:</strong> {sala.situacao}</p>
                                        <p><strong>Recursos:</strong></p>
                                        <ul>
                                            {sala.recursos.map((recurso, index) => (
                                                <li key={index}>
                                                    <strong>• {recurso.nomeRecurso}</strong> {recurso.descricaoRecurso}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className='flex flex-col items-end justify-between mt-4 md:mt-0'>
                                        <Button onClick={() => navigate(`/agenda-sala/${sala.idSala}`)} text="Agenda" className='bg-blue-500 text-white p-2 rounded mb-2' />
                                        <div className='flex space-x-2'>
                                            <Button onClick={() => handleEditSala(sala.idSala)} text="Editar" className='bg-green-500 text-white p-2 rounded' />
                                            <Button onClick={() => openDeleteModal(sala)} text="Excluir" className='bg-red-500 text-white p-2 rounded' />
                                        </div>
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

                {/* Modal for Confirm Delete */}
                <ConfirmDeleteModal
                    isOpen={deleteModalOpen}
                    onCancel={closeDeleteModal}
                    onConfirm={confirmDelete}
                    text={salaToDelete != null ? `Tem certeza que deseja excluir a sala ${salaToDelete.nomeSala}? Todos os recursos ligados a essa sala serão excluídos!` : "Tem certeza que deseja excluir a sala?"}
                />
            </div>
        </Layout>
    );
};

export default ListagemSala;
