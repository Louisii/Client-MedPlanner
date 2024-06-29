import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '../components/Button';
import Input from '../components/Input';
import AsyncSelectorProfissional from './AsyncSelectorProfissional';
import Label from './Label';
import { format, isSameDay, isBefore } from 'date-fns';
import axiosWithToken from '../lib/RequestInterceptor';

const CriarLocacaoSala = ({ appointmentMeta, onHide, visible, sala, getLocacoes }) => {

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

    const handleCancel = () => {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
        setSelectedSala(initialSelectedSala);
        setSelectedAla(initialSelectedAla);
        onHide();
    };

    const salvar = () => {
        if (!startDate || !endDate || !medicoSelecionado) {
            setRespostaErro('Todos os campos são obrigatórios.');
            return;
        }

        if (!isSameDay(new Date(startDate), new Date(endDate))) {
            setRespostaErro('As datas de início e fim devem estar no mesmo dia.');
            return;
        }

        if (!isBefore(new Date(startDate), new Date(endDate))) {
            setRespostaErro('O horário de início deve ser anterior ao horário de fim.');
            return;
        }

        const data = {
            idUsuario: medicoSelecionado.value,
            horaInicio: startDate,
            horaFinal: endDate,
            dia: format(new Date(startDate), 'yyyy-MM-dd'),
            sala: sala.idSala,
            ala: sala.ala.idAla
        };

        axiosWithToken.post('http://localhost:8080/locacao/salvar', data)
            .then((response) => {
                if (response.status === 200) {
                    handleCancel();
                    getLocacoes(); // Chama a função getLocacoes após a criação da locação
                }
            })
            .catch((error) => {
                setRespostaErro(error.response.data.errors);
                console.error('Erro ao salvar especialidade:', error.message);
            });
    };

    const handleProfissionalSelection = (data) => {
        setMedicoSelecionado(data);
    };

    return (
        <Dialog open={visible} onClose={onHide}>
            <DialogTitle>Locação</DialogTitle>
            <DialogContent>
                <div className='my-4'>
                    <p className='font-semibold text-lg'>{sala.nomeSala}</p>
                    <div className='flex flex-row'>
                        <p className='font-semibold mr-1'>Ala: </p>
                        <p>{sala.ala.nome}</p>
                    </div>
                    <div className='flex flex-row'>
                        <p className='font-semibold mr-1'>Andar: </p>
                        <p>{sala.andar}</p>
                    </div>
                </div>

                <div>
                    <Label text='Médico' />
                    <AsyncSelectorProfissional onSelectionChange={handleProfissionalSelection} />
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

export { CriarLocacaoSala };
