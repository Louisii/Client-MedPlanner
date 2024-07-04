import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import axiosWithToken from '../lib/RequestInterceptor';
import Button from '../components/Button';
import ButtonVermelho from '../components/ButtonVermelho';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const DetalhesUsuario = () => {
    const { usuarioId } = useParams();
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [usuarioLogado, setUsuarioLogado] = useState(null);

    const maskCpf = (cpf) => {
        if (!cpf) return '';
        const cpfNumbers = cpf.replace(/\D/g, '');
        return cpfNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    useEffect(() => {
        getUsuario(usuarioId);
    }, [usuarioId]);

    const getUsuarioLogado = () => {
        axiosWithToken.get('http://localhost:8080/usuario/minha-conta')
            .then(response => {
                if (response.status === 200) {
                    setUsuarioLogado(response.data);
                } else {
                    console.error(`Falha ao obter usuário: ${response.status}`);
                }
            })
            .catch(error => {
                console.error('Erro ao obter usuário:', error.message);
            });
    };


    const getUsuario = () => {
        axiosWithToken.get(`http://localhost:8080/usuario/buscar?id=${usuarioId}`)
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

    const usuarioLogadoIsAdm = () => {
        if (usuarioLogado) {
            return usuarioLogado.cargo == "ADMINISTRADOR"
        }
        return false
    }


    const openDeleteModal = () => {
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };


    const confirmDelete = () => {
        if (usuario) {
            let url = ''
            if (usuario.cargo == "MEDICO") {
                url = `http://localhost:8080/profissional/deletar/`
            } else {
                url = `http://localhost:8080/usuario/deletar/`
            }
            axiosWithToken.delete(`${url}${usuario.idUsuario}`)
                .then((response) => {
                    closeDeleteModal();
                    handleCancel();
                })
                .catch((error) => {
                    console.error('Erro ao excluir locação:', error.message);
                });
        }
    };

    return (
        <Layout>
            {usuario != null ?
                <div className='p-4'>
                    <h2 className='p-4 text-xl font-bold'>Detalhes do Usuário</h2>
                    <div className='m-4 p-4'>
                        <p>Nome: {usuario.nome}</p>
                        <p>Função: {usuario.cargo === 'RECEPCAO' ? 'Recepção' : usuario.cargo === 'MEDICO' ? 'Médico(a)' : 'Administrador(a)'}</p>
                        <p>Email: {usuario.username}</p>
                        <p>CPF: {maskCpf(usuario.cpf)}</p>
                        <p>Situação: {usuario.situacao}</p>
                    </div>
                    <div className='flex items-center text-sm h-9 gap-4 m-4 p-4'>
                        <Button onClick={() => navigate(`/listagem-usuario`)} text="Voltar" />
                        {usuarioLogadoIsAdm && <Button onClick={() => navigate(`/edicao-usuario/${usuarioId}`)} text="Editar" />}
                        {usuarioLogadoIsAdm && <ButtonVermelho onClick={() => openDeleteModal()} text="Excluir" />}
                    </div>
                </div>
                :
                <p></p>
            }
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onCancel={closeDeleteModal}
                onConfirm={confirmDelete}
                text={`Tem certeza que deseja excluir permanentemente o usuário?`}
            />
        </Layout>
    );
};

export default DetalhesUsuario;
