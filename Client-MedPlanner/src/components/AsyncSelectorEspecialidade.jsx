import AsyncSelect from 'react-select/async'
import { useState } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';

const AsyncSelectorEspecialidade = ({ onSelectionChange }) => {
    const [idEspecialeidade, setIdEspecialeidade] = useState('');
    const [filtroIdEspecialidade, setFiltroIdEspecialidade] = useState('');
    const [filtroNome, setFiltroNome] = useState('');
    const [selectEspecialidade, setSelectEspecialidade] = useState({ value: 0, label: 'Procure um ID ou nome de especialidade' });

    const getEspecialidades = async (e) => {
        return axiosWithToken.get('http://localhost:8080/especialidade/listar', {
            params: {
                idEspecialidade: filtroIdEspecialidade,
                nome: filtroNome
            }
        })
            .then((response) => {
                const options = []
                response.data.forEach((especialidade) => {
                    options.push({
                        label: especialidade.idEspecialidade + ' - ' + especialidade.nome,
                        value: especialidade.idEspecialidade
                    })
                })
                return options
            })
    }

    const handleChangeFiltroEspecialidade = (data) => {
        if (/^-?\d+$/.test(data)) {
            setFiltroIdEspecialidade(data);
            setFiltroNome(null);
        } else {
            setFiltroNome(data);
            setFiltroIdEspecialidade(null);
        }
    }

    const handleSelectionChange = (data) => {
        setSelectEspecialidade(data);
        onSelectionChange(data);
    }

    return (
        <AsyncSelect
            className='h-[40px] m-1 w-full appearance-none border rounded'
            loadOptions={getEspecialidades}
            onInputChange={(data) => handleChangeFiltroEspecialidade(data)}
            onChange={(data) => handleSelectionChange(data)}
            value={selectEspecialidade}
            defaultOptions
        />
    )
}

export default AsyncSelectorEspecialidade;