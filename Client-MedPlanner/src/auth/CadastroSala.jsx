import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'
import Button from '../components/Button'
import Input from '../components/Input'
import Label from '../components/Label'
import Combobox from '../components/Combobox'
import axiosWithToken from '../lib/RequestInterceptor';
import { useNavigate, useParams } from 'react-router-dom';
import InputDisabled from '../components/InputDisabled';

const CadastroSala = () => {
    const { idSala } = useParams()
    const [form, setForm] = useState({ nomeSala: '', ala: 'Santa Maria', andar: 2, situacao: 'Disponível', recursos: [{ nomeRecurso: '', descricaoRecurso: '' }] });
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);

    const opcoesSituacao = ['Selecione', 'A', 'I', 'M'];

    const getSala = (idSala) => {
        axiosWithToken.get(`http://localhost:8080/sala/buscar?id=${idSala}`)
            .then((response) => {
                if (response.status === 200) {
                    setSala(response.data[0]);
                } else {
                    console.error(`Falha ao obter sala: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter sala:', error.message);
            });
    }

    const salvarSala = () => {
        axiosWithToken.post(`http://localhost:8080/sala/salvar`, form)
            .then((response) => {
                if (response.status == 200) {
                    setRespostaOk(true);
                    navigate("/listagem-sala");
                }
            })
            .catch((error) => {
                setRespostaErro(error.response.data['errors']);
                console.log(respostaErro);

            })

    }

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

        console.log('form');
        console.log(JSON.stringify(form));
        salvarSala()
        setEnviar(true);

    }

    useEffect(() => {
        if (Object.keys(form).length > 0) {
            salvarSala();
        }
        if (idSala != null) {
            getSala(idSala);
        }
    }, [enviar, idSala]);



    return (<Layout>
        <div className='p-4'>
            <form>

                <h2 className='p-4'>{idSala != null ? "Edição de Sala" : "Cadastro de Sala"}</h2>

                <div className='p-4 grid grid-cols-2 gap-8'>
                    <div className='m-4'>
                        <Label text="Nome da Sala" />
                        <Input type='text' placeholder='' value={sala != null && form.nomeSala == null ? sala.nomeSala : form.nomeSala} onChange={(e) => handleForm('nomeSala', e.target.value)} />
                    </div>
                    <div className='m-4'>
                            <Label text="Ala" />
                            <InputDisabled type='text' value='Santa Maria' onChange={(e) => handleForm('ala', e.target.value)} />
                    </div>
                    <div className='m-4'>
                            <Label text="Andar" />
                            <InputDisabled type='text' value='2' onChange={(e) => handleForm('andar', e.target.value)} />
                    </div>
                    <div className='m-4'>
                            <Label text="Situação" />
                            <Combobox opcoes={opcoesSituacao} value={form.situacao} onChange={(e) => handleForm('situacao', e.target.value)} />
                        </div>                
                </div>

                <div className='p-4'>
                        <h3>Recursos</h3>
                        {form.recursos.map((recurso, index) => (
                            <div key={index} className='flex gap-4 items-center'>
                                <Input type='text' placeholder='Nome' value={recurso.nomeRecurso} onChange={(e) => handleRecursoChange(index, 'nomeRecurso', e.target.value)} />
                                <Input type='text' placeholder='Descrição' value={recurso.descricaoRecurso} onChange={(e) => handleRecursoChange(index, 'descricaoRecurso', e.target.value)} />
                                <Button onClick={() => removeRecurso(index)} text="Excluir" />
                            </div>
                        ))}
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

export default CadastroSala