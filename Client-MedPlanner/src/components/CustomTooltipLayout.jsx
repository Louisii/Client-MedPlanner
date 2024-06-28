import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '../components/Button';
import Input from '../components/Input';
import AsyncSelectorSala from './AsyncSeletorSala';
import AsyncSelectorProfissional from './AsyncSelectorProfissional';
import Label from './Label';
import { format } from 'date-fns'; // Importando a função format do date-fns

const CustomTooltipLayout = ({ appointmentMeta, onHide, visible, profissional, ...restProps }) => {
    const initialTitle = appointmentMeta?.data?.title || '';
    const initialStartDate = appointmentMeta?.data?.startDate
        ? format(new Date(appointmentMeta.data.startDate), 'yyyy-MM-dd\'T\'HH:mm')
        : '';
    const initialEndDate = appointmentMeta?.data?.endDate
        ? format(new Date(appointmentMeta.data.endDate), 'yyyy-MM-dd\'T\'HH:mm')
        : '';
    const initialSelectedSala = null;
    const initialSelectedAla = '';

    const [title, setTitle] = useState(initialTitle);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [selectedSala, setSelectedSala] = useState(initialSelectedSala);
    const [selectedAla, setSelectedAla] = useState(initialSelectedAla);

    useEffect(() => {
        setTitle(initialTitle);
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
        setSelectedSala(initialSelectedSala);
        setSelectedAla(initialSelectedAla);
    }, [appointmentMeta]);

    // Adicionando console.log para ver os props recebidos
    useEffect(() => {
        console.log('appointmentMeta:', appointmentMeta);
        console.log('profissional:', profissional);
        console.log('restProps:', restProps);
    }, [appointmentMeta, profissional, restProps]);


    const handleCancel = () => {
        setTitle(initialTitle);
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

    return (
        <Dialog open={visible} onClose={onHide}>
            <DialogTitle>Locação</DialogTitle>
            <DialogContent>
                {profissional == null ? (
                    <div className='w-80 p-2'>
                        <AsyncSelectorProfissional />
                    </div>
                ) : (
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
                )}
                <div className='flex flex-row my-4 gap-4'>
                    <div className='w-80'>
                        <Label text={'Sala'} />
                        <div className='my-2'>
                            <AsyncSelectorSala onSelectionChange={handleSalaChange} />
                        </div>
                    </div>
                    <div className='w-80'>
                        <Label text={'Ala'} />
                        <Input
                            type='text'
                            placeholder='Ala'
                            value={selectedAla}
                            readOnly
                        />
                    </div>
                </div>
                <div className='flex flex-row gap-4 mb-4'>
                    <div className='w-80'>
                        <Label text={'Hora início'} />
                        <Input
                            type='datetime-local'
                            placeholder='Hora início'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className='w-80'>
                        <Label text={'Hora fim'} />
                        <Input
                            type='datetime-local'
                            placeholder='Hora fim'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} text="Cancelar" />
                <Button onClick={onHide} color="primary" text="Salvar" />
            </DialogActions>
        </Dialog>
    );
};

export { CustomTooltipLayout };
