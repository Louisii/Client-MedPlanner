import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import axiosWithToken from '../lib/RequestInterceptor';
import { useNavigate, useParams } from 'react-router-dom';

const CadastroEspecialidade = () => {
    const { especialidadeId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ nome: '', sigla: '' });
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const [especialidade, setEspecialidade] = useState(null);

    const opcoesUF = ['Selecione', 'RS', 'SC', 'PR', 'SP'];
    const opcoesFuncao = ['Selecione', 'Administrador(a)', 'Recepcionista', 'Médico(a)'];
    const opcoesEspecialidade = ['Selecione', 'Cardiologista', 'Geral'];
    const opcoesSituacao = ['Selecione', 'A', 'I', 'E'];

    useEffect(() => {
        if (especialidadeId) {
            getEspecialidade(especialidadeId);
        }
    }, [especialidadeId]);

    const getEspecialidade = (id) => {
        axiosWithToken.get(`http://localhost:8080/especialidade/buscar?id=${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setEspecialidade(response.data[0]);
                } else {
                    console.error(`Falha ao obter especialidade: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter especialidade:', error.message);
            });
    };

    const salvarEspecialidade = () => {
        axiosWithToken.post('http://localhost:8080/especialidade/salvar', form)
            .then((response) => {
                if (response.status === 200) {
                    setRespostaOk(true);
                    navigate('/listagem-especialidade');
                }
            })
            .catch((error) => {
                setRespostaErro(error.response.data.errors);
                console.error('Erro ao salvar especialidade:', error.message);
            });
    };

    const handleForm = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        if (especialidadeId) {
            setForm({ ...form, idEspecialidade: especialidadeId });
        }
        salvarEspecialidade();
        setEnviar(true);
    };

    return (
        <Layout>
            <div className="p-4 my-auto">
                <form>
                    <h2 className="p-4">{especialidadeId ? 'Edição de Especialidade' : 'Cadastro de Especialidade'}</h2>
                    <div className="p-4 grid grid-cols-2 gap-8">
                        <div className="m-4">
                            <Label text="Nome" />
                            <Input
                                type="text"
                                placeholder=""
                                value={form.nome || (especialidade ? especialidade.nome : '')}
                                onChange={(e) => handleForm('nome', e.target.value)}
                            />
                        </div>
                        <div className="m-4">
                            <Label text="Sigla" />
                            <Input
                                type="text"
                                placeholder=""
                                value={form.sigla || (especialidade ? especialidade.sigla : '')}
                                onChange={(e) => handleForm('sigla', e.target.value)}
                            />
                        </div>
                    </div>
                    {(!respostaOk && respostaErro.length > 0) && (
                        <div className="bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2">
                            {respostaErro.map((e, index) => (
                                <p key={index}>{e}</p>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-4 p-8 items-center justify-end">
                        {especialidadeId && (
                            <Button onClick={() => navigate(`/especialidade/${especialidadeId}`)} text="Voltar" />
                        )}
                        <Button onClick={handleSubmit} text={especialidadeId ? 'Atualizar' : 'Cadastrar'} />
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CadastroEspecialidade;
