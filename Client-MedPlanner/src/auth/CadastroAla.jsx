import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import axiosWithToken from '../lib/RequestInterceptor';
import { useNavigate, useParams } from 'react-router-dom';

const CadastroAla = () => {
    const { alaId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ nome: '', sigla: '' });
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const [ala, setAla] = useState(null);

    useEffect(() => {
        if (alaId) {
            getAla(alaId);
        }
    }, [alaId]);

    const getAla = (id) => {
        axiosWithToken.get(`http://localhost:8080/ala/buscar/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setForm(response.data);
                } else {
                    console.error(`Falha ao obter Ala: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter Ala:', error.message);
            });
    };

    const salvarAla = () => {
        axiosWithToken.post('http://localhost:8080/ala/salvar', form)
            .then((response) => {
                if (response.status === 200) {
                    setRespostaOk(true);
                    navigate('/listagem-alas');
                }
            })
            .catch((error) => {
                setRespostaErro(error.response.data.errors);
                console.error('Erro ao salvar ala:', error.message);
            });
    };

    const handleSubmit = () => {
        if (alaId) {
            setForm({ ...form, idAla: alaId });
        }
        salvarAla();
        setEnviar(true);
    };

    const handleForm = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    return (
        <Layout>
            <div className="p-4 my-auto">
                <form>
                    <h2 className="p-4">{alaId ? 'Edição de Ala' : 'Cadastro de Ala'}</h2>
                    <div className="p-4 grid grid-cols-2 gap-8">
                        <div className="m-4">
                            <Label text="Nome" />
                            <Input
                                type="text"
                                placeholder=""
                                value={form.nome}
                                onChange={(e) => handleForm('nome', e.target.value)}
                            />
                        </div>
                        <div className="m-4">
                            <Label text="Sigla" />
                            <Input
                                type="text"
                                placeholder=""
                                value={form.sigla}
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
                        {alaId && (
                            <Button onClick={() => navigate(`/listagem-alas`)} text="Voltar" />
                        )}
                        <Button onClick={handleSubmit} text={alaId ? 'Atualizar' : 'Cadastrar'} />
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CadastroAla;
