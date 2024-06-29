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
    const [form, setForm] = useState({
        nomeSala: '',
        ala: { idAla: '' },
        andar: '',
        situacao: 'Selecione',
        recursos: []
    });
    const [recursoForm, setRecursoForm] = useState({
        nomeRecurso: '',
        descricao: ''
    });
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const navigate = useNavigate();
    const [opcoesAla, setOpcoesAla] = useState([{ value: '', label: 'Selecione' }]);
    const opcoesSituacao = [
        { value: 'Selecione', label: 'Selecione' },
        { value: 'A', label: 'Ativo' },
        { value: 'I', label: 'Inativo' },
        { value: 'M', label: 'Manutenção' }
    ];

    useEffect(() => {
        if (idSala) {
            getSala(idSala);
        }
        fetchOpcoesAla();
    }, [idSala]);

    useEffect(() => {
        if (enviar) {
            salvarSala();
        }
    }, [enviar]);

    const fetchOpcoesAla = async () => {
        try {
            const response = await axiosWithToken.get(`http://localhost:8080/ala/buscar`);
            if (response.status === 200) {
                const alas = response.data.map((ala) => ({ value: ala.idAla, label: ala.nome }));
                setOpcoesAla([{ value: '', label: 'Selecione' }, ...alas]);
            } else {
                console.error(`Falha ao obter alas: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao obter alas:', error.message);
        }
    };

    const getSala = async (idSala) => {
        try {
            const response = await axiosWithToken.get(`http://localhost:8080/sala/buscar?idSala=${idSala}`);
            if (response.status === 200) {
                const sala = response.data;
                setForm({
                    nomeSala: sala.nomeSala,
                    ala: sala.ala || { idAla: '' },
                    andar: sala.andar != null ? String(sala.andar) : '',  // Converting to string if not null
                    situacao: sala.situacao,
                    recursos: sala.recursos || [],
                });
            } else {
                console.error(`Falha ao obter sala: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao obter sala:', error.message);
        }
    };

    const salvarSala = async () => {
        const payload = {
            ...form,
            ala: { idAla: form.ala.idAla }, // Certifica-se que 'ala' seja um objeto com a chave idAla
        };
        try {
            const response = await axiosWithToken.post(`http://localhost:8080/sala/salvar`, payload);
            if (response.status === 200) {
                setRespostaOk(true);
                navigate("/listagem-sala");
            }
        } catch (error) {
            if (error.response) {
                setRespostaErro(error.response.data.errors || ['Erro desconhecido']);
                console.log(error.response.data);
            } else {
                setRespostaErro(['Erro ao conectar ao servidor']);
                console.log(error.message);
            }
        } finally {
            setEnviar(false); // Reset enviar to false after the save
        }
    };

    const handleForm = (name, value) => {
        if (name === 'ala') {
            setForm({ ...form, [name]: { idAla: value } });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleRecursoChange = (name, value) => {
        setRecursoForm({ ...recursoForm, [name]: value });
    };

    const addRecurso = () => {
        const novoRecurso = { ...recursoForm };
        setForm({ ...form, recursos: [...form.recursos, novoRecurso] });
        setRecursoForm({ nomeRecurso: '', descricao: '' });
    };

    const removeRecurso = (index) => {
        const newRecursos = form.recursos.filter((_, i) => i !== index);
        setForm({ ...form, recursos: newRecursos });
    };

    const handleSubmit = () => {
        if (idSala != null) {
            setForm((prevForm) => ({
                ...prevForm,
                idSala: idSala,
            }));
        }
        setEnviar(true);
    };

    return (
        <Layout>
            <div className='p-4'>
                <h2 className='p-4'>{idSala != null ? "Edição de Sala" : "Cadastro de Sala"}</h2>
                <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                    <div className='p-4 grid grid-cols-4 gap-4'>
                        <div className='col-span-4'>
                            <Label text="Nome da Sala" />
                            <Input type='text' value={form.nomeSala} onChange={(e) => handleForm('nomeSala', e.target.value)} />
                        </div>
                        <div className='col-span-1'>
                            <Label text="Ala" />
                            <Combobox
                                opcoes={opcoesAla}
                                value={form.ala.idAla}
                                onChange={(value) => handleForm('ala', value)}
                            />
                        </div>
                        <div className='col-span-1'>
                            <Label text="Andar" />
                            <Input type='number' value={form.andar} onChange={(e) => handleForm('andar', e.target.value)} />
                        </div>
                        <div className='col-span-2'>
                            <Label text="Situação" />
                            <Combobox
                                opcoes={opcoesSituacao}
                                value={form.situacao}
                                onChange={(value) => handleForm('situacao', value)}
                            />
                        </div>
                    </div>

                    <div className='p-4'>
                        <h3>Recursos</h3>
                        <div className='grid grid-cols-3 gap-4 mb-4'>
                            <div className='col-span-1'>
                                <Label text="Nome" />
                                <Input
                                    type='text'
                                    placeholder='Nome'
                                    value={recursoForm.nomeRecurso}
                                    onChange={(e) => handleRecursoChange('nomeRecurso', e.target.value)}
                                />
                            </div>
                            <div className='col-span-2'>
                                <Label text="Descrição" />
                                <Input
                                    type='text'
                                    placeholder='Descrição'
                                    value={recursoForm.descricao}
                                    onChange={(e) => handleRecursoChange('descricao', e.target.value)}
                                />
                            </div>
                            <div className='col-span-1 flex items-end'>
                                <Button onClick={addRecurso} text="+" />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-4'>
                            {Array.isArray(form.recursos) && form.recursos.map((recurso, index) => (
                                <div key={index} className='flex items-center justify-between bg-gray-100 p-2 rounded w-full'>
                                    <div className='flex-1'>
                                        <p><strong>Nome:</strong> {recurso.nomeRecurso}</p>
                                        <p><strong>Descrição:</strong> {recurso.descricao}</p>
                                    </div>
                                    <Button onClick={() => removeRecurso(index)} text="Excluir" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {!respostaOk && (respostaErro == undefined || respostaErro.length > 0) &&
                        <div className='bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2'>
                            {respostaErro.map((e) => <p key={e}>{e}</p>)}
                        </div>
                    }
                    <div className='flex gap-4 p-8 items-center justify-end'>
                        <Button onClick={() => navigate('/listagem-sala')} text="Voltar" /> {/* Botão de Voltar corrigido */}
                        <Button onClick={handleSubmit} text={idSala != null ? "Atualizar" : "Cadastrar"} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CadastroSala;
