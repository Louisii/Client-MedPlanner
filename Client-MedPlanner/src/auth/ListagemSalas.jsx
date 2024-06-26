import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Layout from '../components/Layout';
import axiosWithToken from '../lib/RequestInterceptor';

const ListagemSala = () => {
    const [sala, setSala] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [salaToDelete, setSalaToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getSala();
    }, []);

    const getSala = () => {
        axiosWithToken.get('http://localhost:8080/sala/buscar')
            .then((response) => { setSala(response.data) })
            .catch((error) => { console.log(error) });
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
                    getSala(); // Refresh the list after deletion
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
                <h2 className='p-4 text-xl font-bold'>Salas</h2>

                {sala.length > 0 ? (
                    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                        {sala.map((sala) => (
                            <div key={sala.idSala} className='m-4 p-4 grid grid-cols-2 gap-8 border border-gray-100 rounded-lg shadow-md'>
                                <div>
                                    <h2 className='text-xl font-bold'>{sala.nomeSala}</h2>
                                </div>
                                <div className='flex items-center text-sm justify-end h-9 gap-2'>
                                    <Button onClick={() => navigate(`/edicao-sala/${sala.idSala}`)} text="Editar" />
                                    <Button onClick={() => openDeleteModal(sala)} text="Excluir" />
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
                    text={salaToDelete != null ? `Tem certeza que deseja excluir a sala ${salaToDelete.nomeSala}? Todos os recursos ligados a essa sala serão excluidos!` : "Tem certeza que deseja excluir a sala?"}
                />
            </div>
        </Layout>
    );
};

export default ListagemSala;
