import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'
import Button from '../components/Button'
import Input from '../components/Input'
import Label from '../components/Label'
import Combobox from '../components/Combobox'
import { Textarea } from '@material-tailwind/react'
import LinkStyled from '../components/LinkStyled'
import axios from 'axios';
import axiosWithToken from '../lib/RequestInterceptor';
import { useNavigate } from 'react-router-dom';

const CadastroPaciente = () => {
    const [enderecoViaCep, setEnderecoViaCep] = useState({});
    const [form, setForm] = useState({});
    const [contato, setContato] = useState({});
    const [endereco, setEndereco] = useState({});
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const navigate = useNavigate();

    const opcoesEstadoCivilDisplay = ['Selecione', 'Solteiro(a)', 'Casado(a)', 'Viúvo(a)', 'Divorciado(a)', 'Separado(a)', 'União Estável', 'Outros',];
    const opcoesEstadoCivil = ['Selecione', 'SO', 'CA', 'VI', 'DI', 'SE', 'UE', 'OU'];

    const opcoesNacionalidade = ['Selecione', 'Brasileiro(a)'];
    const opcoesNaturalidade = ['Selecione', 'Florianópolis SC'];

    const opcoesGrauDeInstrucaoDisplay = ['Sem instrução formal', 'Ensino fundamental incompleto', 'Ensino fundamental completo', 'Ensino médio incompleto', 'Ensino médio completo', 'Ensino técnico ou profissionalizante', 'Ensino superior incompleto', 'Ensino superior completo', 'Pós-graduação incompleta', 'Pós-graduação completa', 'Outro', 'Preferir não responder'];
    const opcoesGrauDeInstrucao = ['Selecione', 'SE', 'FI', 'FC', 'MI', 'TP', 'SI', '', 'SC', 'PI', 'PC', 'OU', 'PR',];

    const opcoesRacaCorDisplay = ['Selecione', 'Amarelo', 'Indígena', 'Branco', 'Pardo', 'Preto', 'Outros'];
    const opcoesRacaCor = ['Selecione', 'AM', 'IN', 'BR', 'PA', 'PR', 'OU'];

    const opcoesUF = ['Selecione', 'SC'];
    const opcoesTipoEndereco = ['Selecione', 'casa'];
    const opcoesTipoContato = ['Selecione', 'Celular'];

    const objTeste = {
        "nome": "teste",
        "nomeMae": "mae",
        "dtNascimento": "2023-11-28",
        "nomeSocial": "testee",
        "racaCor": "IN",
        "estadoCivil": "CA",
        "nacionalidade": "Brasileiro(a)",
        "naturalidade": "Florianópolis SC",
        "grauInstrucao": "SE",
        "contato": {
            "email": "louisimtd@outlook.com",
            "telefone": "998190788",
            "ddd": "48",
            "tpContato": "Celular"
        },
        "endereco": {
            "cep": "88020-280",
            "municipio": "FLORIANOPOLIS",
            "numero": "552"
        },
        "sexo": "F",
        "numIdentidade": "44444444449",
        "cpf": "44444444449",
        "emissorIdentidade": "ssp",
        "ufEmissor": "SC",
        "dtEmissao": "2023-11-28"
    }

    const handleFormTeste = () => {
        setForm(objTeste);
        console.log('form');
        console.log(JSON.stringify(form));
        setEnviar(true);
    }

    const getEndereco = (cep) => {
        if (cep != '') {
            axios.get(`http://viacep.com.br/ws/${cep}/json/`)
                .then((response) => { setEnderecoViaCep(response.data) })
                .catch((error) => { console.log(error) })
            console.log(JSON.stringify(enderecoViaCep))
        } else {
            console.log('cep vazio');
        }

    }

    const salvarPaciente = () => {
        axiosWithToken.post(`http://localhost:8080/paciente/salvar`, form)
            .then((response) => {
                if (response.status == 200) {
                    setRespostaOk(true);
                    navigate("/listagem-pacientes");
                }

            })
            .catch((error) => {
                setRespostaErro(error.response.data['errors']);
                console.log(respostaErro);

            })

    }

    function getSelectedValueSexo() {
        const selectedRadioButton = document.querySelector('input[name="sexo-radio"]:checked');

        if (selectedRadioButton) {
            const selectedValue = selectedRadioButton.value;
            return selectedValue;
        } else {
            return null;
        }
    }

    const handleChangeCEP = (event) => {
        getEndereco(event.target.value);
    };

    const handleFormEndereco = (name, value) => {
        setEndereco({ ...endereco, [name]: value });
    };

    const handleFormContato = (name, value) => {
        setContato({ ...contato, [name]: value });
    };

    const handleForm = (name, value) => {
        setForm({ ...form, [name]: value });
    };


    const handleSubmit = () => {
        let sexo = getSelectedValueSexo();
        console.log(sexo);
        setForm({
            ...form,
            "contato": { ...contato },
            "endereco": { ...endereco },
            "sexo": sexo,
        });
        console.log('form');
        console.log(JSON.stringify(form));
        // salvarPaciente()
        setEnviar(true);

    }

    useEffect(() => {
        if (Object.keys(form).length > 0) {
            salvarPaciente();
        }
    }, [enviar]);


    return (<Layout>
        <div className='p-4'>
            <form>

                <h2 className='p-4'>Cadastro de Paciente</h2>

                <h2 className='p-4'>Dados Pessoais</h2>

                <div className='p-4 grid lg:grid-cols-3 md:grid-cols-2 gap-8'>
                    <div className='lg:col-span-2'>

                        <div className='m-4'>
                            <Label text="Nome Completo" />
                            <Input type='text' placeholder='' onChange={(e) => handleForm('nome', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="Nome da mãe" />
                            <Input type='text' placeholder='' onChange={(e) => handleForm('nomeMae', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="Nome Social" />
                            <Input type='text' placeholder='' onChange={(e) => handleForm('nomeSocial', e.target.value)} />
                        </div>

                        <div className="m-4">
                            <Label text="Raça/Cor" />
                            <Combobox opcoes={opcoesRacaCor} opcoesDisplay={opcoesRacaCorDisplay} onChange={(e) => handleForm('racaCor', e.target.value)} />
                        </div>
                        <div className="m-4">
                            <Label text="Estado Cívil" />
                            <Combobox opcoes={opcoesEstadoCivil} opcoesDisplay={opcoesEstadoCivilDisplay} onChange={(e) => handleForm('estadoCivil', e.target.value)} />
                        </div>
                        <div className="m-4">
                            <Label text="Nacionalidade" />
                            <Combobox opcoes={opcoesNacionalidade} opcoesDisplay={opcoesNacionalidade} onChange={(e) => handleForm('nacionalidade', e.target.value)} />
                        </div>
                        <div className="m-4">
                            <Label text="Naturalidade" />
                            <Combobox opcoes={opcoesNaturalidade} opcoesDisplay={opcoesNaturalidade} onChange={(e) => handleForm('naturalidade', e.target.value)} />
                        </div>
                        <div className="m-4">
                            <Label text="Grau de Instrução" />
                            <Combobox opcoes={opcoesGrauDeInstrucao} opcoesDisplay={opcoesGrauDeInstrucaoDisplay} onChange={(e) => handleForm('grauInstrucao', e.target.value)} />
                        </div>

                    </div>
                    <div className='p-4'>
                        <div className='m-4'>
                            <Label text="Sexo" />
                            <div class="flex items-center">
                                <input id="default-radio-1" type="radio" value="M" name="sexo-radio" class=" w-4 h-4 mr-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <Label text="Masculino" />
                            </div>
                            <div class="flex items-center">
                                <input id="default-radio-2" type="radio" value="F" name="sexo-radio" class=" w-4 h-4 mr-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <Label text="Feminino" />
                            </div>
                            <div class="flex items-center">
                                <input id="default-radio-2" type="radio" value="N" name="sexo-radio" class=" w-4 h-4 mr-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <Label text="Não especificado" />
                            </div>
                        </div>

                        <div className='m-4'>
                            <Label text="Data de Nascimento" />
                            <Input type='date' onChange={(e) => handleForm('dtNascimento', e.target.value)} />

                        </div>
                        <div className='m-4'>
                            <Label text="Observações" />
                            <div className="flex w-auto flex-col gap-6">
                                <Textarea size="md" onChange={(e) => handleForm('obs', e.target.value)} className='className="h-[40px] m-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline' />
                            </div>

                        </div>

                    </div>

                </div>

                <h2 className='p-4'>Dados de Contato</h2>

                <div className='p-4 grid lg:grid-cols-3 md:grid-cols-2 gap-8'>
                    <div className='lg:col-span-2'>
                        <div className='m-4'>
                            <Label text="Email" />
                            <Input type='text' placeholder='' onChange={(e) => handleFormContato('email', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="DDD" />
                            <Input type='text' placeholder='' onChange={(e) => handleFormContato('ddd', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="Telefone" />
                            <Input type='text' placeholder='' onChange={(e) => handleFormContato('telefone', e.target.value)} />
                        </div>

                        <div className="m-4">
                            <Label text="Tipo de Contato" />
                            <Combobox opcoes={opcoesTipoContato} onChange={(e) => handleFormContato('tpContato', e.target.value)} />
                        </div>

                    </div>

                </div>

                <h2 className='p-4'>Dados de Endereço</h2>

                <div className='p-4 grid lg:grid-cols-3 md:grid-cols-2 gap-8'>
                    <div className='lg:col-span-2'>
                        <div className='m-4'>
                            <Label text="CEP" />
                            <Input type='text' placeholder='' onBlur={handleChangeCEP} onChange={(e) => handleFormEndereco('cep', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="Logradouro" />
                            <Input type='text' placeholder='' value={enderecoViaCep.logradouro} onChange={(e) => handleFormEndereco('logradouro', e.target.value)} />
                        </div>

                        <div className='m-4'>
                            <Label text="Complemento" />
                            <Input type='text' placeholder='' value={enderecoViaCep.complemento} onChange={(e) => handleFormEndereco('complemento', e.target.value)} />
                        </div>

                        <div className='m-4'>
                            <Label text="UF" />
                            <Input type='text' placeholder='' value={enderecoViaCep.uf} onChange={(e) => handleFormEndereco('uf', e.target.value)} />
                        </div>

                        <div className='m-4'>
                            <Label text="Código IBGE" />
                            <Input type='text' placeholder='' value={enderecoViaCep.ibge} />
                        </div>


                    </div>


                    <div>

                        <div className='m-4 items-center'>
                            <div className='xl:py-6 lg:py-4 md:py-2 className="h-[40px] m-1 appearance-none rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"'>
                                <LinkStyled target="_blank" to='https://buscacepinter.correios.com.br/app/logradouro_bairro/index.php' text='Não sabe seu CEP? Pesquisar' />

                            </div>
                        </div>
                        <div className='m-4'>
                            <Label text="Numero" />
                            <Input type='text' placeholder='' onChange={(e) => handleFormEndereco('numero', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="Bairro" />
                            <Input type='text' placeholder='' value={enderecoViaCep.bairro} onChange={(e) => handleFormEndereco('bairro', e.target.value)} />
                        </div>
                        <div className="m-4">
                            <Label text="Município" />
                            <Input type='text' placeholder='' value={enderecoViaCep.localidade} onChange={(e) => handleFormEndereco('municipio', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="Tipo de endereço" />
                            <Combobox opcoes={opcoesTipoEndereco} onChange={(e) => handleFormEndereco('tpEndedreco', e.target.value)} />
                        </div>


                    </div>
                </div>




                <h2 className='p-4'>Documentos</h2>

                <div className='p-4 grid lg:grid-cols-3 md:grid-cols-2 gap-8'>
                    <div className='lg:col-span-2'>
                        <div className='m-4'>
                            <Label text="RG" />
                            <Input type='text' placeholder='' onChange={(e) => handleForm('numIdentidade', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="Órgão emissor" />
                            <Input type='text' placeholder='' onChange={(e) => handleForm('emissorIdentidade', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="CPF" />
                            <Input type='text' placeholder='' onChange={(e) => handleForm('cpf', e.target.value)} />
                        </div>

                    </div>
                    <div className='p-4'>

                        <div className='m-4'>
                            <Label text="UF" />
                            <Combobox opcoes={opcoesUF} opcoesDisplay={opcoesUF} onChange={(e) => handleForm('ufEmissor', e.target.value)} />

                        </div>

                        <div className='m-4'>
                            <Label text="Data de emissão" />
                            <Input type='date' onChange={(e) => handleForm('dtEmissao', e.target.value)} />
                        </div>


                    </div>
                </div>

                {!respostaOk && respostaErro == undefined || respostaErro.length > 0 ?
                    <div className='bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2'>
                        {respostaErro.map((e) => <p>{e}</p>)}
                    </div>
                    : null}


                <div className='flex gap-4 p-4 items-center justify-end'>
                    <Button onClick={() => handleFormTeste()} text="Cadastrar teste" />
                </div>
                <div className='flex gap-4 p-4 items-center justify-end'>
                    <Button onClick={() => handleSubmit()} text="Cadastrar" />
                </div>
            </form>
        </div>
    </Layout>
    )
}

export default CadastroPaciente