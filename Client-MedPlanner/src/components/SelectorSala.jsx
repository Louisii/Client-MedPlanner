import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axiosWithToken from '../lib/RequestInterceptor';

const SelectorSala = ({ onSelectionChange, defaultValue }) => {
    const [options, setOptions] = useState([]);
    const [selectSala, setSelectSala] = useState(defaultValue || { value: 0, label: 'Selecione uma sala' });

    useEffect(() => {
        if (defaultValue) {
            setSelectSala(defaultValue);
        }
    }, [defaultValue]);

    const fetchSalas = async () => {
        try {
            const response = await axiosWithToken.get('http://localhost:8080/sala/buscar');
            const fetchedOptions = response.data.map((sala) => ({
                label: `${sala.idSala} - ${sala.nomeSala}`,
                value: sala.idSala,
                ala: sala.ala, // Include ala in the options
            }));
            setOptions(fetchedOptions);
        } catch (error) {
            console.error('Error fetching salas:', error);
        }
    };

    useEffect(() => {
        fetchSalas();
    }, []);

    const handleSelectionChange = (selectedOption) => {
        setSelectSala(selectedOption);
        onSelectionChange(selectedOption);
    };

    return (
        <Select
            className="h-[40px] m-1 w-full appearance-none border rounded shadow"
            options={options}
            onChange={handleSelectionChange}
            value={selectSala}
        />
    );
};

export default SelectorSala;
