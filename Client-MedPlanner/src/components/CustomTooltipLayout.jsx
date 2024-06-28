import React, { useState } from 'react';
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '../components/Button';
import Input from '../components/Input';
import AsyncSelectorSala from './AsyncSeletorSala';
import AsyncSelectorProfissional from './AsyncSelectorProfissional';

const CustomTooltipLayout = ({ appointmentMeta, onHide, visible, ...restProps }) => {
    const initialTitle = appointmentMeta?.data?.title || '';
    const initialStartDate = appointmentMeta?.data?.startDate || '';
    const initialEndDate = appointmentMeta?.data?.endDate || '';
    const initialSelectedSala = null;
    const initialSelectedAla = '';

    const [title, setTitle] = useState(initialTitle);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [selectedSala, setSelectedSala] = useState(initialSelectedSala);
    const [selectedAla, setSelectedAla] = useState(initialSelectedAla);

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
                <div className='w-80 p-2'>
                    <AsyncSelectorSala onSelectionChange={handleSalaChange} />
                </div>
                <div className='w-80 p-2'>
                    <AsyncSelectorProfissional />
                </div>
                <Input
                    type='text'
                    placeholder='Ala'
                    value={selectedAla}
                    readOnly
                />
                <Input
                    type='text'
                    placeholder='Hora início'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Hora fim'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} text="Cancelar" />
                <Button onClick={onHide} color="primary" text="Salvar" />
            </DialogActions>
        </Dialog>
    );
};

export { CustomTooltipLayout };
