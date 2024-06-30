import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import logo from '../assets/logoMedPlanner.png';
import axiosWithToken from '../lib/RequestInterceptor';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';

const Home = () => {
  const [locacoes, setLocacoes] = useState([]);
  const [salas, setSalas] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const today = new Date().toISOString().split('T')[0];

  const getLocacoes = () => {
    axiosWithToken.get('http://localhost:8080/locacao/listar')
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setLocacoes(response.data);
        } else {
          console.error(`Falha ao obter locacoes: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error('Erro ao obter locacoes:', error.message);
      });
  };

  const getSalas = () => {
    axiosWithToken.get('http://localhost:8080/sala/buscar')
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setSalas(response.data);
        } else {
          console.error(`Falha ao obter salas: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error('Erro ao obter salas:', error.message);
      });
  };

  const agruparPorSala = () => {
    const salasComLocacoes = salas.map(sala => {
      const locacoesDaSala = locacoes.filter(locacao => locacao.sala.idSala === sala.idSala && locacao.dia.split('T')[0] === currentDate);
      return {
        ...sala,
        locacoes: locacoesDaSala
      };
    });

    return salasComLocacoes;
  };

  useEffect(() => {
    getSalas();
    getLocacoes();
  }, [currentDate]);

  const formatHora = (hora) => {
    const date = new Date(hora);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate.toISOString().split('T')[0]);
  };

  const handleTodayClick = () => {
    setCurrentDate(today);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <Layout>
      <div className='p-4'>
        <h2 className='p-4 text-xl font-bold'>Locações do dia</h2>
        <div className='flex flex-row items-center mx-6'>
          <button onClick={() => handleDateChange(-1)} className='p-2 bg-teal-600 rounded-full'>
            <FaArrowLeft color='white' />
          </button>
          <h2 className='p-4 text-lg font-semibold'>{currentDate === today ? 'Hoje' : formatDate(currentDate)}</h2>
          <button onClick={() => handleDateChange(1)} className='p-2 bg-teal-600 rounded-full'>
            <FaArrowRight color='white' />
          </button>
          {currentDate !== today && (
            <button onClick={handleTodayClick} className='p-2 ml-4 bg-teal-500 text-white rounded'>
              Voltar para Hoje
            </button>
          )}
        </div>

        {salas.length ?
          <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
            {agruparPorSala().map((sala) => (
              <div className='m-4 p-4 border border-gray-100 rounded-lg shadow-md' key={sala.idSala}>
                <p className='py-1 text-lg font-bold'>{sala.nomeSala}</p>
                {sala.locacoes.length ? sala.locacoes.map((loc) => (
                  <div key={loc.idLocacao}>
                    <div className='flex flex-row m-1 items-center border-b'>
                      <div className='flex flex-row m-1 py-1 px-2 mr-2 rounded bg-gray-200 w-36 items-center'>
                        <p className='pl-2'>{formatHora(loc.horaInicio)} - {formatHora(loc.horaFinal)}</p>
                      </div>
                      <FaUserDoctor />
                      <p className='pl-2'>{loc.usuario.nome}</p>
                    </div>
                  </div>
                )) : <p className='text-gray-500'>Nenhuma locação para {formatDate(currentDate)}</p>}
              </div>
            ))}
          </div>
          :
          <div className='text-center'>
            <p className='text-gray-500 m-10'>Nenhuma sala cadastrada</p>
          </div>
        }
      </div>
    </Layout>
  );
};

export default Home;
