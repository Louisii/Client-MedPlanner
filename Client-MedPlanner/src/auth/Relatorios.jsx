import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import axiosWithToken from '../lib/RequestInterceptor';
import { useNavigate, useParams } from 'react-router-dom';

const Relatorios = () => {
    const {tipo:tipo} = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({dataInicio: '', dataFim: ''});
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);

    const gerarRelatorioSala = () => {
        axiosWithToken.post('http://localhost:8080/relatorio/medicos-por-sala', form)
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

    const gerarRelatorioMedico = () => {
        axiosWithToken.post('http://localhost:8080/relatorio/salas-por-medico', form)
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
        if (tipo === 'sala') {
            gerarRelatorioSala();
        } else if (tipo === 'medico') {
            gerarRelatorioMedico();
        }
    };

    return (
        <Layout>
            <div className="p-4 my-auto">
                <form>
                    <h2 className="p-4">{'Relatórios'}</h2>
                    { tipo != "diario" ?
                    <div className="p-4 grid grid-cols-2 gap-8">
                        <div className="m-4">
                            {tipo == "sala" ?
                                < >
                                <Label text="Sala" />
                                <Input type='text' placeholder='' onChange={(e) => handleForm('sala', e.target.value)} />
                                </>
                                :
                                null
                            }
                            {tipo == "medico" ?
                                < >
                                <Label text="Médico" />
                                <Input type='text' placeholder='' onChange={(e) => handleForm('medico', e.target.value)} />
                                </>
                                :
                                null
                            }

                            <div className="m-4">
                                <Label text="Data inicial" />
                                <Input
                                    type="text"
                                    placeholder=""
                                    value={''}
                                    onChange={(e) => handleForm('dataInicio', e.target.value)}
                                />
                            </div>
                            <div className="m-4">
                                <Label text="Data final" />
                                <Input
                                    type="text"
                                    placeholder=""
                                    value={''}
                                    onChange={(e) => handleForm('dataFim', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>       
                    : null
                    }
                    {(!respostaOk && respostaErro.length > 0) && (
                        <div className="bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2">
                            {respostaErro.map((e, index) => (
                                <p key={index}>{e}</p>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-4 p-8 items-center justify-end">
                        <Button onClick={() => navigate(`/listagem-especialidade`)} text="Voltar" />
                        <Button onClick={handleSubmit} text={'Gerar relatório'} />
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Relatorios;
