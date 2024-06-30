import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ErrorModal from '../components/ErrorModal';
import Input from '../components/Input';
import Layout from '../components/Layout';
import SuccessModal from '../components/SuccessModal';
import axiosWithToken from '../lib/RequestInterceptor';

const AlterarSenha = () => {
    const [usuario, setUsuario] = useState(null);
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

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

    const handleAlterarSenha = () => {
        if (!senhaAntiga || !novaSenha || !confirmarSenha) {
            setErrorMessage('Todos os campos devem estar preenchidos!');
            setIsErrorModalOpen(true);
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErrorMessage('A nova senha e a confirmação de senha não coincidem!');
            setIsErrorModalOpen(true);
            return;
        }

        axiosWithToken.post('http://localhost:8080/usuario/alterar-senha', { senhaAntiga, novaSenha })
            .then(response => {
                if (response.status === 200) {
                    setIsSuccessModalOpen(true);
                }
            })
            .catch(error => {
                console.error('Erro ao alterar senha:', error.message);
                setErrorMessage('Senha antiga incorreta!');
                setIsErrorModalOpen(true);
            });
    };

    return (
        <Layout>
            {usuario ? (
                <div className='p-4'>
                    <h2 className='p-4 text-xl font-bold'>Alterar senha</h2>

                    <div className='m-4 p-4'>
                        <p><strong>Nome:</strong> {usuario.nome}</p>
                        <p><strong>Email:</strong> {usuario.username}</p>
                    </div>

                    <div className='m-4 p-4'>
                        <Input type='password' placeholder='Senha antiga' value={senhaAntiga} onChange={(e) => setSenhaAntiga(e.target.value)} />
                        <Input type='password' placeholder='Nova senha' value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                        <Input type='password' placeholder='Confirme a nova senha' value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
                    </div>

                    <div className='flex items-center text-sm h-9 gap-4 m-4 p-4'>
                        <Button onClick={() => navigate('/minha-conta')} text="Cancelar" className="bg-gray-500 text-white" />
                        <Button onClick={handleAlterarSenha} text="Salvar" className="bg-green-500 text-white" />
                    </div>
                </div>
            ) : (
                <p>Carregando...</p>
            )}
            <SuccessModal 
                isOpen={isSuccessModalOpen} 
                onClose={() => { setIsSuccessModalOpen(false); navigate('/minha-conta'); }} 
                text="Senha alterada com sucesso!" 
            />
            <ErrorModal 
                isOpen={isErrorModalOpen} 
                onClose={() => setIsErrorModalOpen(false)} 
                text={errorMessage} 
            />
        </Layout>
    );
};

export default AlterarSenha;
