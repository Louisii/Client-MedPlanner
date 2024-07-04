import { useState, useEffect } from 'react';
import Select from 'react-select';
const SelectorUF = ({ onSelectionChange, defaultValue }) => {
    const [opcoesUF, setopcoesUF] = useState([
        { value: '', label: 'Selecione' },
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espírito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' }
    ]);
    const [selectUF, setSelectUF] = useState({ value: defaultValue.value, label: defaultValue.label } || { value: '', label: 'Selecione' });

    useEffect(() => {
        if (defaultValue) {
            const foundOption = opcoesUF.find(option => option.value === defaultValue.value);
            if (foundOption) {
                setSelectUF(foundOption);
            }
        }
    }, [defaultValue, opcoesUF]);

    const handleSelectionChange = (selectedOption) => {
        setSelectUF(selectedOption);
        onSelectionChange(selectedOption);
    };

    return (
        <Select
            className="h-[40px] m-1 w-full appearance-none border rounded shadow"
            options={opcoesUF}
            onChange={handleSelectionChange}
            value={selectUF}
        />
    );
};

export default SelectorUF;
