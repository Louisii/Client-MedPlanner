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
    const [form, setForm] = useState({});
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);

    const opcoesSituacao = ['Selecione', 'A', 'I', 'E'];

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
                </div>

                <div className='p-4 grid grid-cols-3 gap-8'> 
                    <div className='m-4'>
                        <Label text="Situação" />
                        {form.idUsuario != null ?
                            <InputDisabled type='text' placeholder='' value={opcoesSituacao[2]} onChange={(e) => handleForm('situacao', e.target.value)} />
                            :
                            <Combobox opcoes={opcoesSituacao} opcoesDisplay={opcoesSituacao} value={sala != null ? opcoesSituacao[1] : null} onChange={(e) => handleForm('situacao', e.target.value)} />                        
                        }
                        
                    </div>
                </div>

                {!respostaOk && respostaErro == undefined || respostaErro.length > 0 ?
                    <div className='bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2'>
                        {respostaErro.map((e) => <p>{e}</p>)}
                    </div>
                    : null}

                <div className='flex gap-4 p-8 items-center justify-end'>
                    {idSala != null ? <Button onClick={() => navigate(`/sala/${idSala}`)} text="Voltar" /> : null}
                    <Button onClick={() => handleSubmit()} text={idSala != null ? "Atualizar" : "Cadastrar"} />
                </div>
            </form>
        </div>
    </Layout>
    )
}

export default CadastroSala