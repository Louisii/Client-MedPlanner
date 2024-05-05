import AsyncSelect from 'react-select/async'
import { useState } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';

const AsyncSelectorPaciente = ({ onSelectionChange }) => {
    const [prontuario, setProntuario] = useState('');
    const [filtroProntuario, setFiltroProntuario] = useState('');
    const [filtroNome, setFiltroNome] = useState('');
    const [selectPaciente, setSelectPaciente] = useState({value: 0, label: 'Procure um prontuário ou nome do paciente'});

    const getPacientes = async (e) => {
        return axiosWithToken.get('http://localhost:8080/paciente/buscar', {params: {
                prontuario: filtroProntuario,
                nome: filtroNome
            }})
            .then((response) => {
                const options = []
                response.data.forEach((paciente) => {
                  options.push({
                    label: paciente.idPaciente + ' - ' + paciente.nome,
                    value: paciente.idPaciente
                  })
                })
                return options
            })
    }

    const handleChangeFiltroPaciente = (data) => {
        if(/^-?\d+$/.test(data)){
            setFiltroProntuario(data);
            setFiltroNome(null);
        } else {
            setFiltroNome(data);
            setFiltroProntuario(null);
        }
    }

    const handleSelectionChange = (data) => {
        setSelectPaciente(data);
        onSelectionChange(data);
    }

    return (
        <AsyncSelect 
            className='h-[40px] m-1 w-full appearance-none border rounded'
            loadOptions={getPacientes}
            onInputChange={(data) => handleChangeFiltroPaciente(data)}
            onChange={(data) => handleSelectionChange(data)}
            value={selectPaciente}
            defaultOptions
        />
    )
}

export default AsyncSelectorPaciente;