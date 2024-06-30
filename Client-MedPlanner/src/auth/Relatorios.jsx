import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import axiosWithToken from '../lib/RequestInterceptor';
import { useNavigate, useParams } from 'react-router-dom';

const Relatorios = () => {
    const { tipo } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ dataInicio: '', dataFim: '' });
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);

    const gerarRelatorioSala = () => {
        axiosWithToken.post('http://localhost:8080/relatorio/medicos-por-sala', form)
            .then((response) => {
                if (response.status === 200) {
                    setRespostaOk(true);
                }
            })
            .catch((error) => {
                setRespostaErro(error.response.data.errors);
                console.error('Erro ao gerar relatório:', error.message);
            });
    };

    const gerarRelatorioMedico = () => {
        axiosWithToken.post('http://localhost:8080/relatorio/salas-por-medico', form)
            .then((response) => {
                if (response.status === 200) {
                    setRespostaOk(true);
                }
            })
            .catch((error) => {
                setRespostaErro(error.response.data.errors);
                console.error('Erro ao gerar relatório:', error.message);
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
                    <h2 className="p-4">Relatórios</h2>
                    {tipo !== 'diario' &&
                        <div className="p-4 grid grid-cols-4 gap-4 items-end">
                            {tipo === 'sala' &&
                                <div className="m-4">
                                    <Label text="Sala" />
                                    <Input type='text' placeholder='' onChange={(e) => handleForm('sala', e.target.value)} />
                                </div>
                            }
                            {tipo === 'medico' &&
                                <div className="m-4">
                                    <Label text="Médico" />
                                    <Input type='text' placeholder='' onChange={(e) => handleForm('medico', e.target.value)} />
                                </div>
                            }
                            <div className="m-4">
                                <Label text="Data inicial" />
                                <Input
                                    type="text"
                                    placeholder=""
                                    value={form.dataInicio}
                                    onChange={(e) => handleForm('dataInicio', e.target.value)}
                                />
                            </div>
                            <div className="m-4">
                                <Label text="Data final" />
                                <Input
                                    type="text"
                                    placeholder=""
                                    value={form.dataFim}
                                    onChange={(e) => handleForm('dataFim', e.target.value)}
                                />
                            </div>
                            <div className="m-4">
                                <Button onClick={handleSubmit} text="Gerar relatório" />
                            </div>
                        </div>
                    }
                    {!respostaOk && respostaErro.length > 0 && (
                        <div className="bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2">
                            {respostaErro.map((e, index) => (
                                <p key={index}>{e}</p>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-4 p-8 items-center justify-end">
                        <Button onClick={() => navigate(`/listagem-especialidade`)} text="Voltar" />
                    </div>
                </form>
                {respostaOk && (
                    <div className="p-4">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2">Coluna 1</th>
                                    <th className="py-2">Coluna 2</th>
                                    <th className="py-2">Coluna 3</th>
                                    <th className="py-2">Coluna 4</th>
                                    <th className="py-2">Coluna 5</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">Dado 1</td>
                                    <td className="border px-4 py-2">Dado 2</td>
                                    <td className="border px-4 py-2">Dado 3</td>
                                    <td className="border px-4 py-2">Dado 4</td>
                                    <td className="border px-4 py-2">Dado 5</td>
                                </tr>
                                {/* Adicione mais linhas conforme necessário */}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Relatorios;
