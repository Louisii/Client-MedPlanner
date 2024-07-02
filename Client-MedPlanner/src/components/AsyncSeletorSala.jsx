import AsyncSelect from 'react-select/async';
import { useState, useEffect } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';

const AsyncSelectorSala = ({ onSelectionChange, defaultValue }) => {
    const [filtroId, setFiltroId] = useState('');
    const [filtroNomeSala, setFiltroNomeSala] = useState('');
    const [selectSala, setSelectSala] = useState(defaultValue || { value: 0, label: 'Selecione uma sala' });

    useEffect(() => {
        if (defaultValue) {
            setSelectSala(defaultValue);
        }
    }, [defaultValue]);

    const getSalas = async (inputValue) => {
        try {
            const response = await axiosWithToken.get('http://localhost:8080/sala/buscar', {
                params: {
                    idSala: filtroId || undefined,
                    nomeSala: filtroNomeSala || undefined
                }
            });
            return response.data.map((sala) => ({
                label: `${sala.idSala} - ${sala.nomeSala}`,
                value: sala.idSala,
                ala: sala.ala, // Include ala in the options
            }));
        } catch (error) {
            console.error('Error fetching salas:', error);
            return [];
        }
    };

    const handleChangeFiltroSala = (inputValue) => {
        if (/^-?\d+$/.test(inputValue)) {
            setFiltroId(inputValue);
            setFiltroNomeSala('');
        } else {
            setFiltroNomeSala(inputValue);
            setFiltroId('');
        }
    };

    const handleSelectionChange = (selectedOption) => {
        setSelectSala(selectedOption);
        onSelectionChange(selectedOption);
    };

    return (
        <AsyncSelect
            className="h-[40px] m-1 w-full appearance-none border rounded shadow"
            loadOptions={getSalas}
            onInputChange={handleChangeFiltroSala}
            onChange={handleSelectionChange}
            value={selectSala}
            defaultOptions
        />
    );
};

export default AsyncSelectorSala;
