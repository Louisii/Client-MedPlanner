import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import Combobox from '../components/Combobox';
import axiosWithToken from '../lib/RequestInterceptor';
import { useNavigate, useParams } from 'react-router-dom';
import InputDisabled from '../components/InputDisabled';
import SelectorEspecialidade from '../components/SelectorEspecialidade';
import SelectorUF from '../components/SelectorUf';

const CadastroUsuario = () => {
  const { usuarioId } = useParams();
  const [form, setForm] = useState({
    nome: '',
    username: '',
    cpf: '',
    cargo: 'Selecione',
    situacao: 'E',
    especialidade: '',
    numCrm: '',
    ufCrm: 'Selecione'
  });
  const [maskedCpf, setMaskedCpf] = useState('');
  const [respostaErro, setRespostaErro] = useState([]);
  const [respostaOk, setRespostaOk] = useState(false);
  const [enviar, setEnviar] = useState(false);
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

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
          especialidade: response.data.especialidade.idEspecialidade,
          numCrm: response.data.numCrm,
          ufCrm: response.data.ufCrm,
        });
        setMaskedCpf(maskCpf(response.data.cpf));
      }
    } catch (error) {
      console.error('Erro ao obter usuário:', error.message);
    }
  };

  const salvarUsuario = async () => {
    try {
      const adjustedForm = {
        ...form,
        especialidade: form.especialidade ? { idEspecialidade: form.especialidade } : null
      };

      const payload = {
        nome: adjustedForm.nome,
        username: adjustedForm.username,
        cpf: adjustedForm.cpf.replace(/\D/g, ''), // Remover a máscara do CPF
        cargo: adjustedForm.cargo,
        situacao: adjustedForm.situacao,
        especialidade: adjustedForm.especialidade,
        numCrm: adjustedForm.numCrm,
        ufCrm: adjustedForm.ufCrm
      };
      console.log(payload);
      const url = adjustedForm.cargo === 'MEDICO'
        ? 'http://localhost:8080/profissional/salvar'
        : 'http://localhost:8080/usuario/salvar';

      const response = await axiosWithToken.post(url, payload);
      if (response.status === 200) {
        setRespostaOk(true);
        navigate("/listagem-usuario");
      }
    } catch (error) {
      setRespostaErro(error.response.data?.errors || []);
      console.error('Erro ao salvar usuário:', error.message);
    }
  };


  const handleForm = (name, value) => {
    if (name === 'cpf') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 11); // Limitar a 11 dígitos
      const maskedValue = maskCpf(cleanValue);
      setMaskedCpf(maskedValue);
      setForm({ ...form, [name]: cleanValue }); // Armazenar apenas os dígitos
    } else if (name === 'especialidade' || name === 'ufCrm') {
      setForm({ ...form, [name]: value.value }); // Atualiza o valor da especialidade ou UF
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const maskCpf = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const validateForm = () => {
    console.log(form)
    const errors = [];
    if (!form.nome) errors.push("Nome é obrigatório.");
    if (!form.username) errors.push("Email é obrigatório.");
    if (!form.cpf) errors.push("CPF é obrigatório.");
    if (form.cpf.length !== 11) errors.push("CPF deve ter 11 dígitos.");
    if (!form.cargo || form.cargo === 'Selecione') errors.push("Cargo é obrigatório.");

    if (form.cargo === 'MEDICO') {
      if (!form.especialidade || form.especialidade === 'Selecione') errors.push("Especialidade é obrigatória para médicos.");
      if (!form.numCrm) errors.push("CRM é obrigatório para médicos.");
      if (!form.ufCrm || form.ufCrm === 'Selecione') errors.push("UF do CRM é obrigatória para médicos.");
    }

    return errors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setRespostaErro(validationErrors);
      return;
    }

    salvarUsuario();
    setEnviar(true);
  };

  useEffect(() => {
    if (usuarioId != null) {
      getUsuario(usuarioId);
    }
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

          <div className='p-4 grid grid-cols-2 gap-8'>
            <div className='m-4'>
              <Label text="CPF" />
              <Input type='text' value={maskedCpf} onChange={(e) => handleForm('cpf', e.target.value)} />
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
                <SelectorEspecialidade onSelectionChange={(value) => handleForm('especialidade', value)} defaultValue={{ value: form.especialidade, label: form.especialidade }} />

              }
            </div>
            <div className='m-4'>
              <Label text="CRM" />
              {form.cargo !== 'MEDICO' ?
                <InputDisabled type='text' />
                :
                <Input type='text' value={form.numCrm} onChange={(e) => handleForm('numCrm', e.target.value)} />
              }
            </div>
            <div className='m-4'>
              <Label text="UF" />
              {form.cargo !== 'MEDICO' ?
                <InputDisabled type='text' />
                :
                <SelectorUF onSelectionChange={(value) => handleForm('ufCrm', value)} defaultValue={{ value: form.ufCrm, label: form.ufCrm }} />
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
