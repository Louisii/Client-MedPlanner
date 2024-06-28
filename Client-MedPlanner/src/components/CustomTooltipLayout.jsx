import React, { useState } from 'react';
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import Button from '../components/Button'
import Input from '../components/Input'

// Custom Layout Component
const CustomTooltipLayout = ({ appointmentMeta, onHide, visible, ...restProps }) => {
    const [title, setTitle] = useState(appointmentMeta?.data?.title || '');
    const [startDate, setStartDate] = useState(appointmentMeta?.data?.startDate || '');
    const [endDate, setEndDate] = useState(appointmentMeta?.data?.endDate || '');

    const handleCancel = () => {
        onHide();
    };

    return (
        <Dialog open={visible} onClose={onHide}>
            <DialogTitle>Locação</DialogTitle>
            <DialogContent>
                <Input
                    type='text'
                    placeholder='Ala'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Sala'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Médico'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Hora início'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Hora fim'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Data'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Se repete'
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

// // Custom Header Component
// const CustomTooltipHeader = ({ children, appointmentData, ...restProps }) => (
//     <div>
//         <h3>{appointmentData ? appointmentData.title : ''}</h3>
//         {children}
//     </div>
// );

// // Custom Content Component
// const CustomTooltipContent = ({ children, appointmentData, ...restProps }) => (
//     <div>
//         <p>{appointmentData ? appointmentData.title : ''}</p>
//         <p>{appointmentData ? appointmentData.startDate.toString() : ''}</p>
//         <p>{appointmentData ? appointmentData.endDate.toString() : ''}</p>
//         {children}
//     </div>
// );

export { CustomTooltipLayout };
// export { CustomTooltipLayout, CustomTooltipHeader, CustomTooltipContent };
