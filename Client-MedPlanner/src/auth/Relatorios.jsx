import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import axiosWithToken from '../lib/RequestInterceptor';
import { useParams } from 'react-router-dom';
import { format, parse } from 'date-fns';

const Relatorios = () => {
    const { tipo } = useParams();
    const [form, setForm] = useState({ dataInicio: '', dataFim: '' });
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [relatorio, setRelatorio] = useState([]);

    const gerarRelatorioSala = () => {
        axiosWithToken.get('http://localhost:8080/relatorios/medicos-por-sala', {
            params: {
                salaId: form.salaId,
                dataInicio: format(parse(form.dataInicio, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'),
                dataFim: format(parse(form.dataFim, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
            }
        })
        .then((response) => {
            if (response.status === 200) {
                setRespostaOk(true);
                setRelatorio(response.data);
                console.log(response);
            } else {
                console.error(`Falha ao obter dados de relatório: ${response.status}`);
            }
        })
        .catch((error) => {
            setRespostaErro(error.response?.data?.errors || ['Erro ao gerar relatório.']);
            console.error('Erro ao gerar relatório:', error.message);
        });
    };

    const gerarRelatorioMedico = () => {
        axiosWithToken.get('http://localhost:8080/relatorios/salas-por-medico', {
            params: {
                medicoId: form.medicoId,
                dataInicio: format(parse(form.dataInicio, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'),
                dataFim: format(parse(form.dataFim, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
            }
        })
        .then((response) => {
            if (response.status === 200) {
                setRespostaOk(true);
                setRelatorio(response.data);
            } else {
                console.error(`Falha ao obter dados de relatório: ${response.status}`);
            }
        })
        .catch((error) => {
            setRespostaErro(error.response?.data?.errors || ['Erro ao gerar relatório.']);
            console.error('Erro ao gerar relatório:', error.message);
        });
    };

    const gerarRelatorioDiario = () => {
        axiosWithToken.get('http://localhost:8080/relatorios/diario')
        .then((response) => {
            setRelatorio(response.data);
        })
        .catch((error) => {
            setRespostaErro(error.response?.data?.errors || ['Erro ao gerar relatório diário.']);
            console.error('Erro ao gerar relatório diário:', error.message);
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
        } else if (tipo === 'diario') {
            gerarRelatorioDiario();
        }
    };

    return (
        <Layout>
            <div className="p-4 my-auto">
                <form>
                    <h2 className="p-4">Relatórios</h2>
                    {tipo !== 'diario' &&
                        <div className="p-4 grid grid-cols-4 gap-8 items-end">
                            {tipo === 'sala' &&
                                <div className="m-4">
                                    <Label text="Sala" />
                                    <Input type='text' placeholder='' onChange={(e) => handleForm('salaId', e.target.value)} />
                                </div>
                            }
                            {tipo === 'medico' &&
                                <div className="m-4">
                                    <Label text="Médico" />
                                    <Input type='text' placeholder='' onChange={(e) => handleForm('medicoId', e.target.value)} />
                                </div>
                            }
                            <div className="m-4">
                                <Label text="Data inicial" />
                                <Input
                                    type="text"
                                    placeholder="dd/mm/aaaa"
                                    value={form.dataInicio}
                                    onChange={(e) => handleForm('dataInicio', e.target.value)}
                                />
                            </div>
                            <div className="m-4">
                                <Label text="Data final" />
                                <Input
                                    type="text"
                                    placeholder="dd/mm/aaaa"
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
                </form>
                <div className="p-4">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Codigo</th>
                                <th className="py-2 px-4 border">Nome</th>
                                <th className="py-2 px-4 border">Total de horas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatorio.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border">{item.id}</td>
                                    <td className="py-2 px-4 border">{item.nome}</td>
                                    <td className="py-2 px-4 border">{item.totalHoras + " horas"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Relatorios;
