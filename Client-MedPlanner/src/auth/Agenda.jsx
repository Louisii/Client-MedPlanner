import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { CustomTooltipLayout, CustomTooltipHeader, CustomTooltipContent } from '../components/CustomTooltipLayout';

import {
    Scheduler,
    Appointments,
    WeekView,
    Toolbar,
    DateNavigator,
    ViewSwitcher,
    MonthView,
    DayView,
    AppointmentTooltip,
    AppointmentForm,
    TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import { useParams } from 'react-router-dom';
import axiosWithToken from '../lib/RequestInterceptor';
import { Typography } from '@material-tailwind/react';

// https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/editing/

const Agenda = () => {
    const { profissionalId } = useParams();
    const [profissional, setProfissional] = useState(null);
    const [schedulerData, setSchedulerData] = useState([]);

    const getLocacoes = (profissionalId) => {
        // axiosWithToken.get(`http://localhost:8080/locacao/buscar?id=${profissionalId}`)
        axiosWithToken.get(`http://localhost:8080/locacao/listar`)
            .then((response) => {
                if (response.status === 200) {
                    const dadosCalendario = response.data.map((l) => ({
                        startDate: new Date(l.horaInicio),
                        endDate: new Date(l.horaFinal),
                        title: `${l.sala.nomeSala} - ${l.usuario.nome}`,
                        style: {

                            backgroundColor: '#FFC107',
                        }
                    }));
                    setSchedulerData(dadosCalendario);
                    // console.log(dadosCalendario)
                } else {
                    console.error(`Falha ao obter locacoes: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter locacoes:', error.message);
            });
    };

    const getProfissional = (id) => {
        axiosWithToken.get(`http://localhost:8080/usuario/buscar?id=${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setProfissional(response.data);
                } else {
                    console.error(`Falha ao obter profissional: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter profissional:', error.message);
            });
    };

    const commitChanges = ({ added, changed, deleted }) => {
        setSchedulerData((prevData) => {
            let data = [...prevData];
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
            }
            if (changed) {
                data = data.map((appointment) => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
                ));
            }
            if (deleted !== undefined) {
                data = data.filter((appointment) => appointment.id !== deleted);
            }
            return data;
        });
    };

    useEffect(() => {

        if (profissionalId) {
            getProfissional(profissionalId);
            getLocacoes();
            // getLocacoes(profissionalId);
        }
    }, [profissionalId]);


    const Appointment = ({ children, style, ...restProps }) => (
        <Appointments.Appointment
            {...restProps}
            style={{
                ...style,
                backgroundColor: '#5CC99B',
                borderRadius: '8px',
            }}
        >
            {children}
        </Appointments.Appointment>
    );

    return (
        <Layout>
            <div className='p-4'>
                {profissional ? (
                    <div>
                        <div className='mx-4'>
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

                        <div className='overflow-y-auto max-h-[calc(100vh-10rem)] border rounded-md m-2'>
                            <Paper>
                                <Scheduler data={schedulerData} locale="pt-BR">
                                    <EditingState onCommitChanges={commitChanges} />
                                    {/* <IntegratedEditing /> */}
                                    <ViewState defaultCurrentDate={new Date()} />
                                    <WeekView startDayHour={8} endDayHour={18} excludedDays={[0, 6]} />
                                    <MonthView />
                                    <DayView startDayHour={8} endDayHour={18} />
                                    <Toolbar />
                                    <TodayButton />
                                    <ViewSwitcher />
                                    <DateNavigator />
                                    <Appointments appointmentComponent={Appointment} />
                                    <AppointmentTooltip
                                        showCloseButton
                                        showOpenButton
                                        layoutComponent={CustomTooltipLayout}
                                    // headerComponent={CustomTooltipHeader}
                                    // contentComponent={CustomTooltipContent}
                                    />
                                    <AppointmentForm overlayComponent={CustomTooltipLayout} />
                                </Scheduler>
                            </Paper>
                        </div>
                    </div>
                ) : (
                    <div className='w-full justify-center items-center'>
                        <Typography className='p-4 text-gray-600' variant="h6">Agenda não encontrada</Typography>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Agenda;
