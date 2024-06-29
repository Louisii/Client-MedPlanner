import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '../components/Button';
import Input from '../components/Input';
import AsyncSelectorSala from './AsyncSeletorSala';
import AsyncSelectorProfissional from './AsyncSelectorProfissional';
import Label from './Label';
import { format, isSameDay, isBefore } from 'date-fns';
import axiosWithToken from '../lib/RequestInterceptor';
import InputDisabled from './InputDisabled';

const CriarLocacaoMedico = ({ appointmentMeta, onHide, visible, profissional, getLocacoes }) => {

    const initialStartDate = appointmentMeta?.data?.startDate
        ? format(new Date(appointmentMeta.data.startDate), 'yyyy-MM-dd\'T\'HH:mm')
        : '';
    const initialEndDate = appointmentMeta?.data?.endDate
        ? format(new Date(appointmentMeta.data.endDate), 'yyyy-MM-dd\'T\'HH:mm')
        : '';
    const initialSelectedSala = null;
    const initialSelectedAla = '';

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [selectedSala, setSelectedSala] = useState(initialSelectedSala);
    const [selectedAla, setSelectedAla] = useState(initialSelectedAla);
    const [medicoSelecionado, setMedicoSelecionado] = useState();
    const [respostaErro, setRespostaErro] = useState('');

    useEffect(() => {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
        setSelectedSala(initialSelectedSala);
        setSelectedAla(initialSelectedAla);
    }, [appointmentMeta]);

    useEffect(() => {
    }, [appointmentMeta, profissional]);

    const handleCancel = () => {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
        setSelectedSala(initialSelectedSala);
        setSelectedAla(initialSelectedAla);
        onHide();
    };

    const handleSalaChange = (selectedSala) => {
        setSelectedSala(selectedSala);
        setSelectedAla(selectedSala.ala ? selectedSala.ala.nome : '');
    };

    const salvar = () => {
        // Verificar campos vazios
        if (!startDate || !endDate || !selectedSala) {
            setRespostaErro('Todos os campos são obrigatórios.');
            return;
        }

        // Verificar se as datas são no mesmo dia
        if (!isSameDay(new Date(startDate), new Date(endDate))) {
            setRespostaErro('As datas de início e fim devem estar no mesmo dia.');
            return;
        }

        // Verificar se a startDate é anterior à endDate
        if (!isBefore(new Date(startDate), new Date(endDate))) {
            setRespostaErro('O horário de início deve ser anterior ao horário de fim.');
            return;
        }

        const data = {
            idUsuario: profissional.idUsuario,
            horaInicio: startDate,
            horaFinal: endDate,
            dia: format(new Date(startDate), 'yyyy-MM-dd'),
            sala: selectedSala.value,
            ala: selectedSala.ala.idAla
        };

        console.log(data)

        axiosWithToken.post('http://localhost:8080/locacao/salvar', data)
            .then((response) => {
                if (response.status === 200) {
                    handleCancel();
                    getLocacoes();
                }
            })
            .catch((error) => {
                setRespostaErro(error.response.data.errors);
                console.error('Erro ao salvar especialidade:', error.message);
            });
    };


    return (
        <Dialog open={visible} onClose={onHide}>
            <DialogTitle>Locação</DialogTitle>
            <DialogContent>
                <div className='my-4'>
                    <p className='font-semibold text-lg'>{profissional.nome}</p>
                    <div className='flex flex-row'>
                        <p className='font-semibold mr-1'>CRM: </p>
                        <p>{profissional.numCrm}</p>
                        <p>{`/${profissional.ufCrm}`}</p>
                    </div>
                    <div className='flex flex-row'>
                        <p className='font-semibold mr-1'>E-mail: </p>
                        <p>{profissional.username}</p>
                    </div>
                </div>

                <div className='flex flex-row my-4 gap-4'>
                    <div className='w-80'>
                        <Label text='Sala' />
                        <div className='my-2'>
                            <AsyncSelectorSala onSelectionChange={handleSalaChange} />
                        </div>
                    </div>
                    <div className='w-80'>
                        <Label text='Ala' />
                        <InputDisabled
                            type='text'
                            placeholder='Ala'
                            value={selectedAla}
                            readOnly
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-4 mb-4'>
                    <div className='w-80'>
                        <Label text='Hora início' />
                        <Input
                            type='datetime-local'
                            placeholder='Hora início'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className='w-80'>
                        <Label text='Hora fim' />
                        <Input
                            type='datetime-local'
                            placeholder='Hora fim'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                {respostaErro &&
                    <div className='bg-red-200 rounded m-2 p-2 '>{respostaErro}</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} text='Cancelar' />
                <Button onClick={salvar} color='primary' text='Salvar' />
            </DialogActions>
        </Dialog>
    );
};

export { CriarLocacaoMedico };
