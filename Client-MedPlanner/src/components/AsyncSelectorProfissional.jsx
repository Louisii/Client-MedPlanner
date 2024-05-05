import AsyncSelect from 'react-select/async'
import { useState } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';

const AsyncSelectorProfissional = ({ onSelectionChange }) => {
    const [filtroId, setFiltroId] = useState('');
    const [filtroNome, setFiltroNome] = useState('');
    const [selectProfissional, setSelectProfissional] = useState({value: 0, label: 'Procure um profissional'});

    const getProfissionals = async (e) => {
        return axiosWithToken.get('http://localhost:8080/profissional/buscar', {params: {
                id: filtroId,
                nome: filtroNome
            }})
            .then((response) => {
                const options = []
                response.data.forEach((profissional) => {
                  options.push({
                    label: profissional.idProfissional + ' - ' + profissional.nome,
                    value: profissional.idProfissional
                  })
                })
                return options
            })
    }

    const handleChangeFiltroProfissional = (data) => {
        if(/^-?\d+$/.test(data)){
            setFiltroId(data);
            setFiltroNome(null);
        } else {
            setFiltroNome(data);
            setFiltroId(null);
        }
    }

    const handleSelectionChange = (data) => {
        setSelectProfissional(data);
        onSelectionChange(data);
    }

    return (
        <AsyncSelect 
            className='h-[40px] m-1 w-full appearance-none border rounded'
            loadOptions={getProfissionals}
            onInputChange={(data) => handleChangeFiltroProfissional(data)}
            onChange={(data) => handleSelectionChange(data)}
            value={selectProfissional}
            defaultOptions
        />
    )
}

export default AsyncSelectorProfissional;