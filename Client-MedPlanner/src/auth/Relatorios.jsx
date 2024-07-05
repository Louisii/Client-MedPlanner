import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import axiosWithToken from '../lib/RequestInterceptor';
import { useParams } from 'react-router-dom';
import { format, parseISO, isBefore } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SelectorProfissional from '../components/SelectorProfissional';
import SelectorSala from '../components/SelectorSala';

const Relatorios = () => {
    const { tipo } = useParams();
    const [form, setForm] = useState({ dataInicio: '', dataFim: '' });
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [relatorio, setRelatorio] = useState([]);
    const [selectedSala, setSelectedSala] = useState(null);
    const [selectedMedico, setSelectedMedico] = useState(null);
    const [selectedSalaLabel, setSelectedSalaLabel] = useState('');
    const [selectedMedicoLabel, setSelectedMedicoLabel] = useState('');

    useEffect(() => {
        setForm({ dataInicio: '', dataFim: '' });
        setRespostaErro([]);
        setRespostaOk(false);
        setRelatorio([]);
        setSelectedSala(null);
        setSelectedMedico(null);
        setSelectedSalaLabel('');
        setSelectedMedicoLabel('');
        if (tipo === 'diario') {
            gerarRelatorioDiario();
        }
    }, [tipo]);

    const gerarRelatorioSala = () => {
        axiosWithToken.get('http://localhost:8080/relatorios/medicos-por-sala', {
            params: {
                salaId: selectedSala,
                dataInicio: form.dataInicio,
                dataFim: form.dataFim
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
                medicoId: selectedMedico,
                dataInicio:form.dataInicio,
                dataFim:form.dataFim
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
            const dadosFormatados = response.data.map((locacao) => ({
                id: locacao.idLocacao,
                nomeMedico: locacao.usuario.nome,
                nomeSala: locacao.sala.nomeSala,
                dia: format(new Date(locacao.dia), 'dd-MM-yyyy'),
                horaInicio: format(new Date(locacao.horaInicio), 'HH:mm'),
                horaFim: format(new Date(locacao.horaFinal), 'HH:mm')
            }));
            setRelatorio(dadosFormatados);
        })
        .catch((error) => {
            setRespostaErro(error.response?.data?.errors || ['Erro ao gerar relatório diário.']);
            console.error('Erro ao gerar relatório diário:', error.message);
        });
    };

    const handleForm = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const validateTime = () => {
        const { dataInicio, dataFim } = form;
        if (dataInicio && dataFim) {
            const start = parseISO(dataInicio);
            const end = parseISO(dataFim);
            if (isBefore(end, start)) {
                setRespostaErro(['A data final não pode ser anterior à data inicial.']);
                return false;
            }
        }
        setRespostaErro([]);
        return true;
    };

    const handleSubmit = () => {
        if (validateTime()) {
            if (tipo === 'sala') {
                gerarRelatorioSala();
            } else if (tipo === 'medico') {
                gerarRelatorioMedico();
            }
        }
    };

    const handleSalaChange = (selectedSala) => {
        setSelectedSala(selectedSala.value);
        setSelectedSalaLabel(selectedSala.label);
    };

    const handleProfissionalSelection = (selectedMedico) => {
        setSelectedMedico(selectedMedico.value);
        setSelectedMedicoLabel(selectedMedico.label);
    };

    const gerarPDF = () => {
        const input = document.getElementById('relatorio-table');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                // Adicionando cabeçalho
                const dataAtual = format(new Date(), 'dd/MM/yyyy');
                const { dataInicio, dataFim } = form;

                pdf.setFontSize(12);
                pdf.text(`Tipo de Relatório: ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`, 10, 10);
                pdf.text(`Data de Geração: ${dataAtual}`, 150, 10);
                if (tipo === 'sala') {
                    pdf.text(`Sala: ${selectedSalaLabel}`, 10, 20);
                } else if (tipo === 'medico') {
                    pdf.text(`Médico: ${selectedMedicoLabel}`, 10, 20);
                }
                if(tipo !== 'diario'){
                    pdf.text(`Data Inicial: ${dataInicio}`, 10, 30);
                    pdf.text(`Data Final: ${dataFim}`, 10, 40);
                    pdf.addImage(imgData, 'PNG', 0, 60, pdfWidth, pdfHeight);
                } else {
                    pdf.addImage(imgData, 'PNG', 0, 40, pdfWidth, pdfHeight);
                }
                               
                pdf.save('relatorio.pdf');
            });
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
                                    <SelectorSala onSelectionChange={handleSalaChange} defaultValue={"Selecionar"} />
                                </div>
                            }
                            {tipo === 'medico' &&
                                <div className="m-4">
                                    <Label text="Médico" />
                                    <SelectorProfissional onSelectionChange={handleProfissionalSelection} defaultValue={"Selecionar"} />
                                </div>
                            }
                            <div className="m-4">
                                <Label text="Data inicial" />
                                <Input
                                    type='date'
                                    placeholder='Hora início'
                                    value={form.dataInicio}
                                    onChange={(e) => handleForm('dataInicio', e.target.value)}
                                />
                            </div>
                            <div className="m-4">
                                <Label text="Data final" />
                                <Input
                                    type='date'
                                    placeholder='Hora início'
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
                    <div id="relatorio-table">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    {tipo === 'sala' && <th className="py-2 px-4 border">Médico</th>}
                                    {tipo === 'medico' && <th className="py-2 px-4 border">Sala</th>}
                                    {tipo === 'diario' && (
                                        <>
                                            <th className="py-2 px-4 border">Nome Médico</th>
                                            <th className="py-2 px-4 border">Sala</th>
                                            <th className="py-2 px-4 border">Dia</th>
                                        </>
                                    )}
                                    {tipo !== 'diario' ? (
                                        <th className="py-2 px-4 border">Total de horas</th>
                                    ) : (
                                        <>
                                            <th className="py-2 px-4 border">Hora de Início</th>
                                            <th className="py-2 px-4 border">Hora de Fim</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {relatorio.map((item, index) => (
                                    <tr key={index}>
                                        {tipo === 'sala' && <td className="py-2 px-4 border">{item.nome}</td>}
                                        {tipo === 'medico' && <td className="py-2 px-4 border">{item.nome}</td>}
                                        {tipo === 'diario' && (
                                            <>
                                                <td className="py-2 px-4 border">{item.nomeMedico}</td>
                                                <td className="py-2 px-4 border">{item.nomeSala}</td>
                                                <td className="py-2 px-4 border">{item.dia}</td>
                                                <td className="py-2 px-4 border">{item.horaInicio}</td>
                                                <td className="py-2 px-4 border">{item.horaFim}</td>
                                            </>
                                        )}
                                        {tipo !== 'diario' && <td className="py-2 px-4 border">{item.totalHoras + " horas"}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4">
                        <Button onClick={gerarPDF} text="Gerar PDF" />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Relatorios;
