import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Combobox from '../components/Combobox';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Layout from '../components/Layout';
import axiosWithToken from '../lib/RequestInterceptor';

const ListagemSala = () => {
    const [salas, setSalas] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [salaToDelete, setSalaToDelete] = useState(null);
    const [filterAla, setFilterAla] = useState('Selecione');
    const [opcoesAla, setOpcoesAla] = useState(['Selecione']);
    const navigate = useNavigate();

    useEffect(() => {
        getSalas();
        getAlas();
    }, []);

    const getSalas = () => {
        axiosWithToken.get('http://localhost:8080/sala/buscar')
            .then((response) => { setSalas(response.data) })
            .catch((error) => { console.log(error) });
    };

    const getAlas = () => {
        axiosWithToken.get('http://localhost:8080/ala/buscar')
            .then((response) => {
                if (response.status === 200) {
                    const alas = response.data.map((ala) => ala.nomeAla);
                    setOpcoesAla(['Selecione', ...alas]);
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

    return (
        <Layout>
            <div className='p-4'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Listagem de Salas</h2>
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center'>
                            <label className='mr-2'>Filtrar por ala:</label>
                            <Combobox opcoes={opcoesAla} opcoesDisplay={opcoesAla} value={filterAla} onChange={(e) => setFilterAla(e.target.value)} />
                        </div>
                        <Button onClick={() => navigate('/cadastro-sala')} text="Nova Sala" />
                    </div>
                </div>
                
                {salas.length > 0 ? (
                    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                        {salas.filter(sala => filterAla === 'Selecione' || sala.ala === filterAla).map((sala) => (
                            <div key={sala.idSala} className='m-4 p-4 border border-gray-100 rounded-lg shadow-md'>
                                <div className='grid grid-cols-1 md:grid-cols-2'>
                                    <div>
                                        <h2 className='text-lg font-bold'>Sala {sala.idSala}</h2>
                                        <p><strong>Ala:</strong> {sala.ala}</p>
                                        <p><strong>Andar:</strong> {sala.andar}</p>
                                        <p><strong>Recursos:</strong></p>
                                        <ul>
                                            {sala.recursos.map((recurso, index) => (
                                                <li key={index}>
                                                    <strong>• {recurso.nomeRecurso}</strong>: {recurso.descricaoRecurso}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className='flex justify-end items-start'>
                                        <Button onClick={() => navigate(`/edicao-sala/${sala.idSala}`)} text="Editar Sala" className='mr-2' />
                                        <Button onClick={() => openDeleteModal(sala)} text="Excluir" />
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
