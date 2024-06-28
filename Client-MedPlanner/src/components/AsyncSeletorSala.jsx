import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import axiosWithToken from '../lib/RequestInterceptor';

const AsyncSelectorProfissional = ({ onSelectionChange }) => {
    const [filtroId, setFiltroId] = useState('');
    const [filtroNomeSala, setFiltroNomeSala] = useState('');
    const [selectSala, setSelectSala] = useState({value: 0, label: 'Procure uma sala'});

    const getSalas = async (e) => {
        return axiosWithToken.get('http://localhost:8080/sala/buscar', {params: {
                id: filtroId,
                nome: filtroNomeSala
            }})
            .then((response) => {
                const options = []
                response.data.forEach((sala) => {
                  options.push({
                    label: sala.idSala + ' - ' + sala.nomeSala,
                    value: sala.idSala
                  })
                })
                return options
            })
    }

    const handleChangeFiltroSala = (data) => {
        if(/^-?\d+$/.test(data)){
            setFiltroId(data);
            setFiltroNomeSala(null);
        } else {
            setFiltroNomeSala(data);
            setFiltroId(null);
        }
    }

    const handleSelectionChange = (data) => {
        setSelectSala(data);
        onSelectionChange(data);
    }

    return (
        <AsyncSelect 
            className='h-[40px] m-1 w-full appearance-none border rounded'
            loadOptions={getSalas}
            onInputChange={(data) => handleChangeFiltroSala(data)}
            onChange={(data) => handleSelectionChange(data)}
            value={selectSala}
            defaultOptions
        />
    )
}

export default AsyncSelectorSala;