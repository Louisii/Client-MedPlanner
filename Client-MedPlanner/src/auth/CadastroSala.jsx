import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Combobox from '../components/Combobox';
import Input from '../components/Input';
import Label from '../components/Label';
import Layout from '../components/Layout';
import axiosWithToken from '../lib/RequestInterceptor';

const CadastroSala = () => {
    const { idSala } = useParams();
    const [form, setForm] = useState({ nomeSala: '', ala: '', andar: '', situacao: 'Selecione', recursos: [{ nomeRecurso: '', descricaoRecurso: '' }] });
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);
    const [opcoesAla, setOpcoesAla] = useState(['Selecione']);
    const [opcoesAndar, setOpcoesAndar] = useState(['Selecione']);
    const opcoesSituacao = ['Selecione', 'A', 'I', 'M'];

    useEffect(() => {
        if (idSala) {
            getSala(idSala);
        }
        fetchOpcoesAla();
        fetchOpcoesAndar();
    }, [idSala]);

    const fetchOpcoesAla = () => {
        axiosWithToken.get(`http://localhost:8080/ala/buscar`)
            .then((response) => {
                if (response.status === 200) {
                    const alas = response.data.map((ala) => ala.nomeAla);
                    setOpcoesAla(['Selecione', ...alas]);
                } else {
                    console.error(`Falha ao obter alas: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter alas:', error.message);
            });
    };

    const fetchOpcoesAndar = () => {
        axiosWithToken.get(`http://localhost:8080/ala/buscar`)
            .then((response) => {
                if (response.status === 200) {
                    const andares = response.data.map((andar) => andar.numeroAndar);
                    setOpcoesAndar(['Selecione', ...andares]);
                } else {
                    console.error(`Falha ao obter andares: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter andares:', error.message);
            });
    };

    const getSala = (idSala) => {
        axiosWithToken.get(`http://localhost:8080/sala/buscar?id=${idSala}`)
            .then((response) => {
                if (response.status === 200) {
                    setSala(response.data[0]);
                    setForm({
                        nomeSala: response.data[0].nomeSala,
                        ala: response.data[0].ala,
                        andar: response.data[0].andar,
                        situacao: response.data[0].situacao,
                        recursos: response.data[0].recursos,
                    });
                } else {
                    console.error(`Falha ao obter sala: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter sala:', error.message);
            });
    };

    const salvarSala = () => {
        axiosWithToken.post(`http://localhost:8080/sala/salvar`, form)
            .then((response) => {
                if (response.status === 200) {
                    setRespostaOk(true);
                    navigate("/listagem-sala");
                }
            })
            .catch((error) => {
                setRespostaErro(error.response.data['errors']);
                console.log(respostaErro);
            });
    };

    const handleForm = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleRecursoChange = (index, name, value) => {
        const newRecursos = form.recursos.map((recurso, i) => (
            i === index ? { ...recurso, [name]: value } : recurso
        ));
        setForm({ ...form, recursos: newRecursos });
    };

    const addRecurso = () => {
        setForm({ ...form, recursos: [...form.recursos, { nomeRecurso: '', descricaoRecurso: '' }] });
    };

    const removeRecurso = (index) => {
        const newRecursos = form.recursos.filter((_, i) => i !== index);
        setForm({ ...form, recursos: newRecursos });
    };

    const handleSubmit = () => {
        if (idSala != null) {
            setForm({
                ...{ idSala: idSala },
                ...form,
            });
        }

        salvarSala();
        setEnviar(true);
    };

    return (
        <Layout>
            <div className='p-4'>
                <form>
                    <h2 className='p-4'>{idSala != null ? "Edição de Sala" : "Cadastro de Sala"}</h2>

                    <div className='p-4 grid grid-cols-4 gap-4'>
                        <div className='col-span-4'>
                            <Label text="Nome da Sala" />
                            <Input type='text' value={form.nomeSala} onChange={(e) => handleForm('nomeSala', e.target.value)} />
                        </div>
                        <div className='col-span-1'>
                            <Label text="Ala" />
                            <Combobox opcoes={opcoesAla} opcoesDisplay={opcoesAla} value={form.ala} onChange={(e) => handleForm('ala', e.target.value)} />
                        </div>
                        <div className='col-span-1'>
                            <Label text="Andar" />
                            <Combobox opcoes={opcoesAndar} opcoesDisplay={opcoesAndar} value={form.andar} onChange={(e) => handleForm('andar', e.target.value)} />
                        </div>
                        <div className='col-span-2'>
                            <Label text="Situação" />
                            <Combobox opcoes={opcoesSituacao} opcoesDisplay={['Selecione', 'A', 'I', 'M']} value={form.situacao} onChange={(e) => handleForm('situacao', e.target.value)} />
                        </div>
                    </div>

                    <div className='p-4'>
                        <h3>Recursos</h3>
                        <div className='grid grid-cols-3 gap-4'>
                            {form.recursos.map((recurso, index) => (
                                <div key={index} className='flex col-span-3 gap-4 items-center'>
                                    <div className='col-span-1'>
                                        <Input type='text' placeholder='Nome' value={recurso.nomeRecurso} onChange={(e) => handleRecursoChange(index, 'nomeRecurso', e.target.value)} />
                                    </div>
                                    <div className='col-span-2'>
                                        <Input type='text' placeholder='Descrição' value={recurso.descricaoRecurso} onChange={(e) => handleRecursoChange(index, 'descricaoRecurso', e.target.value)} />
                                    </div>
                                    <div className='col-span-1'>
                                        <Button onClick={() => removeRecurso(index)} text="Excluir" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={addRecurso} text="Adicionar Recurso" />
                    </div>

                    {!respostaOk && (respostaErro == undefined || respostaErro.length > 0) &&
                        <div className='bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2'>
                            {respostaErro.map((e) => <p key={e}>{e}</p>)}
                        </div>
                    }

                    <div className='flex gap-4 p-8 items-center justify-end'>
                        {idSala != null && <Button onClick={() => navigate(`/sala/${idSala}`)} text="Voltar" />}
                        <Button onClick={handleSubmit} text={idSala != null ? "Atualizar" : "Cadastrar"} />
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default CadastroSala;
