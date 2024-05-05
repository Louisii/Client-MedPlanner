import AsyncSelect from 'react-select/async'
import { useState } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';

const AsyncSelectorAgenda = ({ onSelectionChange }) => {
    const [agenda, setAgenda] = useState('');
    const [filtroAgenda, setFiltroAgenda] = useState('');
    const [filtroProfissional, setFiltroProfissional] = useState('');
    const [selectAgenda, setSelectAgenda] = useState({value: 0, label: 'Procure uma agenda ou nome do profissional'});

    const getAgendas = async (e) => {
        return axiosWithToken.get('http://localhost:8080/agenda/buscar', {params: {
                agenda: filtroAgenda,
                profissional: filtroProfissional
            }})
            .then((response) => {
                const options = []
                response.data.forEach((agenda) => {
                  options.push({
                    label: agenda.idAgenda + ' - ' + agenda.idProfissional.nome + ' - ' + agenda.idEspecialidade.nome,
                    value: agenda.idAgenda
                  })
                })
                return options
            }).catch((error) => {
                console.error('Erro ao obter agendas:', error);
                return [];
            });
    }

    const handleChangeFiltroAgenda = (data) => {
        if(/^-?\d+$/.test(data)){
            setFiltroAgenda(data);
            setFiltroProfissional(null);
        } else {
            setFiltroProfissional(data);
            setFiltroAgenda(null);
        }
    }

    const handleSelectionChange = (data) => {
        setSelectAgenda(data);
        onSelectionChange(data);
    }

    return (
        <AsyncSelect 
            className='h-[40px] m-1 w-full appearance-none border rounded'
            loadOptions={getAgendas}
            onInputChange={(data) => handleChangeFiltroAgenda(data)}
            onChange={(data) => handleSelectionChange(data)}
            value={selectAgenda}
            defaultOptions
        />
    )
}

export default AsyncSelectorAgenda;