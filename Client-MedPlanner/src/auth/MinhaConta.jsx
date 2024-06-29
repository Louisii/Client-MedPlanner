import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Layout from '../components/Layout';
import axiosWithToken from '../lib/RequestInterceptor';

const MinhaConta = () => {
    const [usuario, setUsuario] = useState(null);
    const [novaSenha, setNovaSenha] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getUsuario();
    }, []);

    const getUsuario = () => {
        axiosWithToken.get('http://localhost:8080/usuario/minha-conta')
            .then((response) => {
                if (response.status === 200) {
                    setUsuario(response.data);
                } else {
                    console.error(`Falha ao obter usuário: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter usuário:', error.message);
            });
    }

    const alterarSenha = () => {
        axiosWithToken.post('http://localhost:8080/usuario/alterar-senha', { novaSenha })
            .then((response) => {
                if (response.status === 200) {
                    alert('Senha alterada com sucesso');
                }
            })
            .catch((error) => {
                console.error('Erro ao alterar senha:', error.message);
                alert('Erro ao alterar senha');
            });
    }

    const excluirConta = () => {
        axiosWithToken.delete('http://localhost:8080/usuario/excluir-conta')
            .then((response) => {
                if (response.status === 200) {
                    alert('Conta excluída com sucesso');
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('usuario');
                    navigate("/", { replace: true });
                }
            })
            .catch((error) => {
                console.error('Erro ao excluir conta:', error.message);
                alert('Erro ao excluir conta');
            });
    }

    return (
        <Layout>
            {usuario != null ?
                <div className='p-4'>
                    <h2 className='p-4 text-xl font-bold'>Dados da Conta</h2>

                    <div className='m-4 p-4'>
                        <p><strong>Nome:</strong> {usuario.nome}</p>
                        <p><strong>Email:</strong> {usuario.username}</p>
                        <p><strong>CPF:</strong> {usuario.cpf}</p>
                        <p><strong>Função:</strong> {usuario.cargo}</p>
                        <p><strong>Especialidade:</strong> {usuario.especialidade}</p>
                        <p><strong>CRM:</strong> {usuario.crm}</p>
                        <p><strong>Estado:</strong> {usuario.uf}</p>
                    </div>

                    <div className='m-4 p-4'>
                        <Input type='password' placeholder='Nova Senha' value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                        <Button onClick={alterarSenha} text="Alterar Senha" />
                    </div>

                    <div className='flex items-center text-sm h-9 gap-4 m-4 p-4'>
                        <Button onClick={excluirConta} text="Excluir conta" className="bg-red-500 text-white" />
                    </div>
                </div>
                :
                <p>Carregando...</p>
            }
        </Layout>
    );
}

export default MinhaConta;
