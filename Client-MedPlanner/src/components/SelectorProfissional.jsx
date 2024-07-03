import { useState, useEffect } from 'react';
import Select from 'react-select';
import axiosWithToken from '../lib/RequestInterceptor';

const SelectorProfissional = ({ onSelectionChange, defaultValue }) => {
    const [opcoesProfissionais, setOpcoesProfissionais] = useState([{ value: '', label: 'Selecione um profissional' }]);
    const [selectProfissional, setSelectProfissional] = useState(defaultValue || { value: 0, label: 'Selecione um profissional' });

    useEffect(() => {
        const fetchProfissionals = async () => {
            try {
                const response = await axiosWithToken.get('http://localhost:8080/usuario/buscar');
                if (response.status === 200) {
                    const profissionais = response.data
                        .filter(profissional => profissional.cargo === 'MEDICO')
                        .map((profissional) => ({
                            value: profissional.idUsuario,
                            label: `${profissional.idUsuario} - ${profissional.nome}`,
                        }));
                    setOpcoesProfissionais([{ value: '', label: 'Selecione um profissional' }, ...profissionais]);
                } else {
                    console.error(`Falha ao obter profissionais: ${response.status}`);
                }
            } catch (error) {
                console.error('Erro ao obter profissionais:', error.message);
            }
        };

        fetchProfissionals();
    }, []);

    useEffect(() => {
        if (defaultValue) {
            setSelectProfissional(defaultValue);
        }
    }, [defaultValue]);

    const handleSelectionChange = (selectedOption) => {
        setSelectProfissional(selectedOption);
        onSelectionChange(selectedOption);
    };

    return (
        <Select
            className="h-[40px] m-1 w-full appearance-none border rounded shadow"
            options={opcoesProfissionais}
            onChange={handleSelectionChange}
            value={selectProfissional}
        />
    );
};

export default SelectorProfissional;
