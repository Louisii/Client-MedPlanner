import axiosWithToken from '../lib/RequestInterceptor';
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Layout from '../components/Layout';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useNavigate } from 'react-router-dom';

const ListagemAlas = () => {
    const [alas, setAlas] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [alaToDelete, setAlaToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getAlas();
    }, []);

    const getAlas = () => {
        axiosWithToken.get('http://localhost:8080/ala/listar')
            .then((response) => { setAlas(response.data) })
            .catch((error) => { console.log(error) });
    };

    const openDeleteModal = (ala) => {
        setAlaToDelete(ala);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setAlaToDelete(null);
    };

    const confirmDelete = () => {
        if (alaToDelete) {
            axiosWithToken.delete(`http://localhost:8080/ala/deletar/${alaToDelete.idAla}`)
                .then((response) => {
                    console.log(response.data);
                    getAlas();
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
                <h2 className='p-4 text-xl font-bold'>Alas</h2>

                {alas.length > 0 ? (
                    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                        {alas.map((ala) => (
                            <div key={ala.idAla} className='m-4 p-4 grid grid-cols-2 gap-8 border border-gray-100 rounded-lg shadow-md'>
                                <div>
                                    <h2 className='text-xl font-bold'>{ala.nome}</h2>
                                </div>
                                <div className='flex items-center text-sm justify-end h-9 gap-2'>
                                    <Button onClick={() => navigate(`/edicao-ala/${ala.idAla}`)} text="Editar" />
                                    <Button onClick={() => openDeleteModal(ala)} text="Excluir" />
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
                    text={alaToDelete != null ? `Tem certeza que deseja excluir a ala ${alaToDelete.nome}?` : "Tem certeza que deseja excluir a ala?"}
                />
            </div>
        </Layout>
    );
};

export default ListagemAlas;
