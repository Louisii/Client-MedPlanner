import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Layout from '../components/Layout';
import axiosWithToken from '../lib/RequestInterceptor';

const MinhaConta = () => {
    const [usuario, setUsuario] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate(); // Certifique-se de que useNavigate está sendo usado corretamente

    useEffect(() => {
        getUsuario();
    }, []);

    const getUsuario = () => {
        axiosWithToken.get('http://localhost:8080/usuario/minha-conta')
            .then(response => {
                if (response.status === 200) {
                    setUsuario(response.data);
                } else {
                    console.error(`Falha ao obter usuário: ${response.status}`);
                }
            })
            .catch(error => {
                console.error('Erro ao obter usuário:', error.message);
            });
    };

    const handleDeleteAccount = () => {
        axiosWithToken.delete('http://localhost:8080/usuario/excluir-conta')
            .then(response => {
                if (response.status === 200) {
                    alert('Conta excluída com sucesso!');
                    // Redirecionar ou realizar outra ação após a exclusão da conta
                }
            })
            .catch(error => {
                console.error('Erro ao excluir conta:', error.message);
                alert('Erro ao excluir conta');
            });
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleAlterarSenha = () => {
        navigate('/alterar-senha');
    };

    return (
        <Layout>
            {usuario ? (
                <div className='p-4'>
                    <h2 className='p-4 text-xl font-bold'>Minha Conta</h2>
                    <div className='m-4 p-4'>
                        <p><strong>Nome:</strong> {usuario.nome}</p>
                        <p><strong>Email:</strong> {usuario.username}</p>
                        <p><strong>CPF:</strong> {usuario.cpf}</p>
                        <p><strong>Função:</strong> {usuario.cargo}</p>
                        {usuario.cargo === 'MEDICO' && (
                            <>
                                <p><strong>Especialidade:</strong> {usuario.especialidade?.nome}</p>
                                <p><strong>CRM:</strong> {usuario.crm}</p>
                                <p><strong>Estado:</strong> {usuario.uf_crm}</p>
                            </>
                        )}
                    </div>
                    <div className='flex items-center text-sm h-9 gap-4 m-4 p-4'>
                        <Button onClick={handleAlterarSenha} text="Alterar Senha" />
                        <Button onClick={openDeleteModal} text="Excluir Conta" className="bg-red-600 text-white" />
                    </div>

                    <ConfirmDeleteModal
                        isOpen={isDeleteModalOpen}
                        onCancel={closeDeleteModal}
                        onConfirm={handleDeleteAccount}
                        text="Tem certeza que deseja excluir sua conta? Você não terá mais acesso ao sistema!"
                    />
                </div>
            ) : (
                <p>Carregando...</p>
            )}
        </Layout>
    );
};

export default MinhaConta;
