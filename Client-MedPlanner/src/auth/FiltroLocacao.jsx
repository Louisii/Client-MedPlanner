import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import SelectorSala from '../components/SelectorSala';  // Importando o SelectorSala
import SelectorProfissional from '../components/SelectorProfissional';

const FiltroLocacao = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('medico');
  const [selectedValue, setSelectedValue] = useState('');

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setSelectedValue('');
  };

  const handleBuscarClick = () => {
    if (selectedValue) {
      if (filtro === 'medico') {
        navigate(`/agenda-profissional/${selectedValue.value}`);
      } else {
        navigate(`/agenda-sala/${selectedValue}`);
      }
    }
  };

  const handleProfissionalSelection = (data) => {
    setSelectedValue(data);
  };

  const handleSalaSelection = (data) => {
    setSelectedValue(data.value);
  };

  return (
    <Layout>
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
          <h2 className='text-xl font-bold mb-4'>Filtrar por</h2>
          <div className='mb-4'>
            <label className='flex items-center'>
              <input
                type='radio'
                value='medico'
                checked={filtro === 'medico'}
                onChange={handleFiltroChange}
                className='mr-2'
              />
              Médico
            </label>
            <label className='flex items-center mt-2'>
              <input
                type='radio'
                value='sala'
                checked={filtro === 'sala'}
                onChange={handleFiltroChange}
                className='mr-2'
              />
              Sala
            </label>
          </div>
          <div className='mb-4'>
            {filtro === 'medico' ? (
              <SelectorProfissional onSelectionChange={handleProfissionalSelection} />
            ) : (
              <SelectorSala onSelectionChange={handleSalaSelection} />
            )}
          </div>
          <Button onClick={handleBuscarClick} text="Buscar" className='bg-teal-600 text-white w-full p-2 rounded' />
        </div>
      </div>
    </Layout>
  );
};

export default FiltroLocacao;
