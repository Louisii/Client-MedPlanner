import AsyncSelect from 'react-select/async'
import { useState } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';

const AsynSelectorConsultorio = ({ onSelectionChange }) => {
    const [consultorio, setConsultorio] = useState('');
    const [filtroConsultorio, setFiltroConsultorio] = useState('');
    const [selectConsultorio, setSelectConsultorio] = useState({value: 0, label: 'Procure um consultorio'});
    const getConsultorios = async (e) => {
        return axiosWithToken.get('http://localhost:8080/consultorio/buscar', {params: {
                consultorio: filtroConsultorio
            }})
            .then((response) => {
                const options = []
                response.data.forEach((consultorio) => {
                  options.push({
                    label: consultorio.numero,
                    value: consultorio.idConsultorio
                  })
                })
                return options
            })
    }

    const handleChangeFiltroConsultorio = (data) => {
        setFiltroConsultorio(data);
    }

    const handleSelectionChange = (data) => {
        setSelectConsultorio(data);
        onSelectionChange(data);
    }

    return (
        <AsyncSelect 
            className='h-[40px] m-1 w-full appearance-none border rounded'
            loadOptions={getConsultorios}
            onInputChange={(data) => handleChangeFiltroConsultorio(data)}
            onChange={(data) => handleSelectionChange(data)}
            value={selectConsultorio}
            defaultOptions
        />
    )
}

export default AsynSelectorConsultorio;