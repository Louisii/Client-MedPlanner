import axiosWithToken from '../lib/RequestInterceptor';
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Layout from '../components/Layout';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useNavigate } from 'react-router-dom';

const ListagemEspecialidades = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [especialidadeToDelete, setEspecialidadeToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getEspecialidades();
    }, []);

    const getEspecialidades = () => {
        axiosWithToken.get('http://localhost:8080/especialidade/listar')
            .then((response) => { setEspecialidades(response.data) })
            .catch((error) => { console.log(error) });
    };

    const openDeleteModal = (especialidade) => {
        setEspecialidadeToDelete(especialidade);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setEspecialidadeToDelete(null);
    };

    const confirmDelete = () => {
        if (especialidadeToDelete) {
            axiosWithToken.delete(`http://localhost:8080/especialidade/deletar/${especialidadeToDelete.idEspecialidade}`)
                .then((response) => {
                    console.log(response.data); // Assuming backend returns a success message
                    getEspecialidades(); // Refresh the list after deletion
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
                <h2 className='p-4 text-xl font-bold'>Especialidades</h2>

                {especialidades.length > 0 ? (
                    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                        {especialidades.map((especialidade) => (
                            <div key={especialidade.idEspecialidade} className='m-4 p-4 grid grid-cols-2 gap-8 border border-gray-100 rounded-lg shadow-md'>
                                <div>
                                    <h2 className='text-xl font-bold'>{especialidade.nome}</h2>
                                </div>
                                {localStorage.getItem("role") == "ADMINISTRADOR" || localStorage.getItem("role") == "RECEPCAO" ?
                                    <div className='flex items-center text-sm justify-end h-9 gap-2'>
                                        <Button onClick={() => navigate(`/edicao-especialidade/${especialidade.idEspecialidade}`)} text="Editar" />
                                        <Button onClick={() => openDeleteModal(especialidade)} text="Excluir" />
                                    </div> : null}
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
                    text={especialidadeToDelete != null ? `Tem certeza que deseja excluir a especialidade ${especialidadeToDelete.nome}?` : "Tem certeza que deseja excluir a especialidad?"}
                />
            </div>
        </Layout>
    );
};

export default ListagemEspecialidades;
