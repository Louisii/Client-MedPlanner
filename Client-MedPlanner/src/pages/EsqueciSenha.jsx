import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logoMedPlanner.png';
import Input from '../components/Input';
import Label from '../components/Label';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const EsqueciSenha = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [respostaErro, setRespostaErro] = useState(null);
    const [respostaSucesso, setRespostaSucesso] = useState(null);

    const handleClickEnviar = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/usuario/esqueciSenha', { email });
            if (response.status === 200) {
                setRespostaSucesso("E-mail encaminhado com sucesso");
                setTimeout(() => {
                    navigate('/');
                }, 2000);  // Redirecionar após 2 segundos
            }
        } catch (error) {
            setRespostaErro(error.response?.data || 'Erro ao gerar nova senha.');
            console.error('Erro ao gerar nova senha.', error.message);
        }
    };

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    return (
        <div className='h-screen w-screen bg-gray-200'>
            <div className="h-screen flex items-center justify-center">
                <div>
                    <form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                        <div className='w-full mb-8 mt-4'>
                            <img src={logo} alt="logo MedPlanner" className='w-48 mx-auto' />
                        </div>
                        <div className="text-center font-bold mb-4">Recuperação de senha</div>
                        <div className="mb-6">
                            <Label text="E-mail" />
                            <Input type="email" placeholder="" onChange={handleChangeEmail} required />
                        </div>
                        <div className="text-center mb-4">Insira seu login e encaminharemos uma nova senha para você.</div>
                        <div className="text-center mb-6">
                            Lembre-se de altera-la ao acessar o sistema!
                        </div>
                        {respostaErro && (
                            <div className="text-red-500 mb-4">
                                {respostaErro}
                            </div>
                        )}
                        {respostaSucesso && (
                            <div className="text-green-500 mb-4">
                                {respostaSucesso}
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <Button onClick={() => navigate(`/`)} text="Voltar" />
                            <Button text="Enviar" onClick={handleClickEnviar} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EsqueciSenha;
