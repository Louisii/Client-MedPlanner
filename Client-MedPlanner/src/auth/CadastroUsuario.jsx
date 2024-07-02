import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import Combobox from '../components/Combobox';
import axiosWithToken from '../lib/RequestInterceptor';
import { useNavigate, useParams } from 'react-router-dom';
import InputDisabled from '../components/InputDisabled';
import AsyncSelectorEspecialidade from '../components/AsyncSelectorEspecialidade';

const CadastroUsuario = () => {
    const { usuarioId } = useParams();
    const [form, setForm] = useState({
        nome: '',
        username: '',
        cpf: '',
        cargo: 'Selecione',
        situacao: 'Selecione',
        especialidade: '',
        crm: '',
        uf_crm: 'Selecione'
    });
    const [respostaErro, setRespostaErro] = useState([]);
    const [respostaOk, setRespostaOk] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [opcoesEspecialidade, setOpcoesEspecialidade] = useState([{ value: '', label: 'Selecione' }]);
    const opcoesUF = [
        { value: '', label: 'Selecione' },
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espírito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' }
    ];
    const opcoesCargo = [{ value: '', label: 'Selecione' }, { value: 'ADMINISTRADOR', label: 'Administrador(a)' }, { value: 'RECEPCAO', label: 'Recepcionista' }, { value: 'MEDICO', label: 'Médico(a)' }];


    const getUsuario = async (usuarioId) => {
        try {
            const response = await axiosWithToken.get(`http://localhost:8080/usuario/buscar?id=${usuarioId}`);
            if (response.status === 200) {
                setUsuario(response.data);
                setForm({
                    nome: response.data.nome,
                    username: response.data.username,
                    cpf: response.data.cpf,
                    cargo: response.data.cargo,
                    situacao: response.data.situacao,
                    especialidade: response.data.especialidade,
                    crm: response.data.crm,
                    uf_crm: response.data.uf_crm,
                });
            }
        } catch (error) {
            console.error('Erro ao obter usuário:', error.message);
        }
    };

    const salvarUsuario = async () => {
        try {
            if (!usuarioId) {
                form = { ...form, situacao: "E" }
            }
            const response = await axiosWithToken.post(`http://localhost:8080/usuario/salvar`, adjustedForm);
            if (response.status === 200) {
                setRespostaOk(true);
                navigate("/listagem-usuario");
            }
        } catch (error) {
            setRespostaErro(error.response.data?.errors || []);
        }
    };

    const handleForm = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const validateForm = () => {
        const errors = [];
        if (!form.nome) errors.push("Nome é obrigatório.");
        if (!form.username) errors.push("Email é obrigatório.");
        if (!form.cpf) errors.push("CPF é obrigatório.");
        if (!form.cargo || form.cargo === 'Selecione') errors.push("Cargo é obrigatório.");
        // if (!form.situacao || form.situacao === 'Selecione') errors.push("Situação é obrigatória.");

        if (form.cargo === 'Médico(a)') {
            if (!form.especialidade || form.especialidade === 'Selecione') errors.push("Especialidade é obrigatória para médicos.");
            if (!form.crm) errors.push("CRM é obrigatório para médicos.");
            if (!form.uf_crm || form.uf_crm === 'Selecione') errors.push("UF do CRM é obrigatória para médicos.");
        }

        return errors;
    };

    const handleSubmit = () => {
        console.log(form)
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setRespostaErro(validationErrors);
            return;
        }

        if (usuarioId != null) {
            setForm((prevForm) => ({
                ...prevForm,
                idUsuario: usuarioId,
            }));
        }

        salvarUsuario();
        setEnviar(true);
    };

    const fetchOpcoesEspecialidade = async () => {
        try {
            const response = await axiosWithToken.get('http://localhost:8080/especialidade/listar');
            if (response.status === 200) {
                const especialidade = response.data.map((especialidade) => ({ value: especialidade.idEspecialidade, label: especialidade.nome }));
                console.log('setOpcoesEspecialidade:', especialidade); // Adicionando log para verificar os dados das especialidade
                setOpcoesEspecialidade([{ value: '', label: 'Selecione' }, ...especialidade]);
            } else {
                console.error(`Falha ao obter especialidade: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao obter especialidade:', error.message);
        }
    };

    useEffect(() => {
        if (usuarioId != null) {
            getUsuario(usuarioId);
        }
        fetchOpcoesEspecialidade();
    }, [usuarioId]);

    return (
        <Layout>
            <div className='p-4'>
                <form>
                    <h2 className='p-4'>{usuarioId != null ? "Edição de Usuário" : "Cadastro de Usuário"}</h2>

                    <div className='p-4 grid grid-cols-2 gap-8'>
                        <div className='m-4'>
                            <Label text="Nome Completo" />
                            <Input type='text' value={form.nome} onChange={(e) => handleForm('nome', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="Email" />
                            <Input type='text' value={form.username} onChange={(e) => handleForm('username', e.target.value)} />
                        </div>
                    </div>

                    <div className='p-4 grid grid-cols-3 gap-8'>
                        <div className='m-4'>
                            <Label text="CPF" />
                            <Input type='text' value={form.cpf} onChange={(e) => handleForm('cpf', e.target.value)} />
                        </div>
                        <div className='m-4'>
                            <Label text="Cargo" />
                            <Combobox opcoes={opcoesCargo} value={form.cargo} onChange={(value) => handleForm('cargo', value)} />
                        </div>

                    </div>

                    <div className='p-4 grid grid-cols-3 gap-8'>
                        <div className='m-4'>
                            <Label text="Especialidade" />
                            {form.cargo !== 'MEDICO' ?
                                <InputDisabled type='text' />
                                :
                                <Combobox
                                    opcoes={opcoesEspecialidade}
                                    value={form.especialidade}
                                    onChange={(value) => handleForm('especialidade', value)} />
                            }
                        </div>
                        <div className='m-4'>
                            <Label text="CRM" />
                            {form.cargo !== 'MEDICO' ?
                                <InputDisabled type='text' />
                                :
                                <Input type='text' value={form.crm} onChange={(e) => handleForm('crm', e.target.value)} />
                            }
                        </div>
                        <div className='m-4'>
                            <Label text="UF" />
                            {form.cargo !== 'MEDICO' ?
                                <InputDisabled type='text' />
                                :
                                <Combobox opcoes={opcoesUF} value={form.uf_crm} onChange={(value) => handleForm('uf_crm', value)} />
                            }
                        </div>
                    </div>

                    {respostaErro.length > 0 && (
                        <div className='bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2'>
                            {respostaErro.map((e, index) => <p key={index}>{e}</p>)}
                        </div>
                    )}

                    <div className='flex gap-4 p-8 items-center justify-end'>
                        {usuarioId != null && <Button onClick={() => navigate(`/usuario/${usuarioId}`)} text="Voltar" />}
                        <Button onClick={handleSubmit} text={usuarioId != null ? "Atualizar" : "Cadastrar"} />
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CadastroUsuario;
