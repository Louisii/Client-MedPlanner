import { useState, useEffect } from 'react';
import Select from 'react-select';
import axiosWithToken from '../lib/RequestInterceptor';
const SelectorEspecialidade = ({ onSelectionChange, defaultValue }) => {
    const [opcoesEspecialidades, setOpcoesEspecialidades] = useState([{ value: '', label: 'Selecione uma especialidade' }]);
    const [selectEspecialidade, setSelectEspecialidade] = useState(defaultValue || { value: '', label: 'Selecione uma especialidade' });
  
    useEffect(() => {
      const fetchEspecialidades = async () => {
        try {
          const response = await axiosWithToken.get('http://localhost:8080/especialidade/buscar');
          if (response.status === 200) {
            const especialidades = response.data
              .map((especialidade) => ({
                value: especialidade.idEspecialidade,
                label: `${especialidade.idEspecialidade} - ${especialidade.nome}`,
              }));
            setOpcoesEspecialidades([{ value: '', label: 'Selecione uma especialidade' }, ...especialidades]);
          } else {
            console.error(`Falha ao obter especialidades: ${response.status}`);
          }
        } catch (error) {
          console.error('Erro ao obter especialidades:', error.message);
        }
      };
  
      fetchEspecialidades();
    }, []);
  
    useEffect(() => {
      if (defaultValue) {
        setSelectEspecialidade(defaultValue);
      }
    }, [defaultValue]);
  
    const handleSelectionChange = (selectedOption) => {
      setSelectEspecialidade(selectedOption);
      onSelectionChange(selectedOption);
    };
  
    return (
      <Select
        className="h-[40px] m-1 w-full appearance-none border rounded shadow"
        options={opcoesEspecialidades}
        onChange={handleSelectionChange}
        value={selectEspecialidade}
      />
    );
  };

export default SelectorEspecialidade;
