import AsyncSelect from 'react-select/async';
import { useState } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';

const AsyncSelectorAla = ({ onSelectionChange }) => {
    const [filtroId, setFiltroId] = useState('');
    const [filtroNome, setFiltroNome] = useState('');
    const [selectAla, setSelectAla] = useState({ value: 0, label: 'Procure uma ala' });

    const getAlas = async (inputValue) => {
        try {
            const response = await axiosWithToken.get('http://localhost:8080/ala/buscar', {
                params: {
                    idAla: filtroId || undefined,
                    nome: filtroNome || undefined,
                },
            });
            return response.data.map((ala) => ({
                label: `${ala.idAla} - ${ala.nome}`,
                value: ala.idAla,
            }));
        } catch (error) {
            console.error('Error fetching alas:', error);
            return [];
        }
    };

    const handleChangeFiltroAla = (inputValue) => {
        if (/^-?\d+$/.test(inputValue)) {
            setFiltroId(inputValue);
            setFiltroNome('');
        } else {
            setFiltroNome(inputValue);
            setFiltroId('');
        }
    };

    const handleSelectionChange = (selectedOption) => {
        setSelectAla(selectedOption);
        onSelectionChange(selectedOption);
    };

    return (
        <AsyncSelect
            className="h-[40px] m-1 w-full appearance-none border rounded"
            loadOptions={getAlas}
            onInputChange={handleChangeFiltroAla}
            onChange={handleSelectionChange}
            value={selectAla}
            defaultOptions
        />
    );
};

export default AsyncSelectorAla;
