import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'
import Button from '../components/Button'
import Input from '../components/Input'
import Label from '../components/Label'
import Combobox from '../components/Combobox'
import axiosWithToken from '../lib/RequestInterceptor';
import { useNavigate } from 'react-router-dom';

const CadastroUsuario = () => {
    const [form, setForm] = useState({});
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const navigate = useNavigate();


    const opcoesUF = ['Selecione', 'RS', 'SC', 'PR', 'SP'];
    const opcoesFuncao = ['Selecione', 'Administrador(a)', 'Recepcionista', 'Médico(a)'];
    const opcoesEspecialidade = ['Selecione', 'Cardiologista', 'Geral'];

    const handleFormTeste = () => {
        setForm(objTeste);
        console.log('form');
        console.log(JSON.stringify(form));
        setEnviar(true);
    }


    const salvarUsuario = () => {
        axiosWithToken.post(`http://localhost:8080/usuario/salvar`, form)
            .then((response) => {
                if (response.status == 200) {
                    setRespostaOk(true);
                    navigate("/listagem-usuario");
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
        setForm({
            ...{ situacao: 'A' },
            ...{ password: 'password' },
            ...{ username: form.email },
            ...form,
        });
        console.log('form');
        console.log(JSON.stringify(form));
        // salvarPaciente()
        salvarUsuario()
        setEnviar(true);

    }

    useEffect(() => {
        if (Object.keys(form).length > 0) {
            salvarUsuario();
        }
    }, [enviar]);


    return (<Layout>
        <div className='p-4'>
            <form>

                <h2 className='p-4'>Cadastro de Usuário</h2>

                <div className='p-4 grid grid-cols-3 gap-8'>

                    <div className='m-4'>
                        <Label text="Nome Completo" />
                        <Input type='text' placeholder='' onChange={(e) => handleForm('nome', e.target.value)} />
                    </div>
                    <div className='m-4'>
                        <Label text="Email" />
                        <Input type='text' placeholder='' onChange={(e) => handleForm('email', e.target.value)} />
                    </div>
                    <div className='m-4'>
                        <Label text="CPF" />
                        <Input type='text' placeholder='' onChange={(e) => handleForm('cpf', e.target.value)} />
                    </div>

                </div>

                <div className='p-4 grid grid-cols-4 gap-8'>

                    <div className='m-4'>
                        <Label text="Função" />
                        <Combobox opcoes={opcoesFuncao} opcoesDisplay={opcoesFuncao} onChange={(e) => handleForm('funcao', e.target.value)} />
                    </div>
                    <div className='m-4'>
                        <Label text="Especialidade" />
                        <Combobox opcoes={opcoesEspecialidade} opcoesDisplay={opcoesEspecialidade} onChange={(e) => handleForm('especialidade', e.target.value)} />
                    </div>
                    <div className='m-4'>
                        <Label text="CMR" />
                        <Input type='text' placeholder='' onChange={(e) => handleForm('crm', e.target.value)} />
                    </div>
                    <div className='m-4'>
                        <Label text="UF" />
                        <Combobox opcoes={opcoesUF} opcoesDisplay={opcoesUF} onChange={(e) => handleForm('uf_crm', e.target.value)} />
                    </div>

                </div>


                {!respostaOk && respostaErro == undefined || respostaErro.length > 0 ?
                    <div className='bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2'>
                        {/*  {respostaErro.map((e) => <p>{e}</p>)}*/}
                        <p>Não foi possível cadastrar.</p>

                    </div>
                    : null}


                {/* <div className='flex gap-4 p-4 items-center justify-end'>
                    <Button onClick={() => handleFormTeste()} text="Cadastrar teste" />
                </div> */}

                <div className='flex gap-4 p-8 items-center justify-end'>
                    <Button onClick={() => handleSubmit()} text="Cadastrar" />
                </div>
            </form>
        </div>
    </Layout>
    )
}

export default CadastroUsuario