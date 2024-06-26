import AsyncSelect from 'react-select/async';
import { useState, useEffect } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';

const AsyncSelectorProfissional = ({ onSelectionChange, defaultValue }) => {
    const [filtroId, setFiltroId] = useState('');
    const [filtroNome, setFiltroNome] = useState('');
    const [selectProfissional, setSelectProfissional] = useState(defaultValue || { value: 0, label: 'Procure um profissional' });

    useEffect(() => {
        if (defaultValue) {
            setSelectProfissional(defaultValue);
        }
    }, [defaultValue]);

    const getProfissionals = async (inputValue) => {
        try {
            const response = await axiosWithToken.get('http://localhost:8080/usuario/buscar', {
                params: {
                    idUsuario: filtroId || undefined,
                    nome: filtroNome || undefined,
                },
            });
            return response.data
                .filter(profissional => profissional.cargo === 'MEDICO')
                .map((profissional) => ({
                    label: `${profissional.idUsuario} - ${profissional.nome}`,
                    value: profissional.idUsuario,
                }));
        } catch (error) {
            console.error('Error fetching professionals:', error);
            return [];
        }
    };

    const handleChangeFiltroProfissional = (inputValue) => {
        if (/^-?\d+$/.test(inputValue)) {
            setFiltroId(inputValue);
            setFiltroNome('');
        } else {
            setFiltroNome(inputValue);
            setFiltroId('');
        }
    };

    const handleSelectionChange = (selectedOption) => {
        setSelectProfissional(selectedOption);
        onSelectionChange(selectedOption);
    };

    return (
        <AsyncSelect
            className="h-[40px] m-1 w-full appearance-none border rounded shadow"
            loadOptions={getProfissionals}
            onInputChange={handleChangeFiltroProfissional}
            onChange={handleSelectionChange}
            value={selectProfissional}
            defaultOptions
        />
    );
};

export default AsyncSelectorProfissional;
