
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

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
    const { profissionalId: profissionalId } = useParams();
    const [profissional, setProfissional] = useState(null);


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


    const currentDate = new Date().toJSON();

    const commitChanges = ({ added, changed, deleted }) => {


        this.setState((state) => {
            let { data } = state;
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
            }
            if (changed) {
                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
            }
            if (deleted !== undefined) {
                data = data.filter(appointment => appointment.id !== deleted);
            }
            return { data };
        });
    }


    useEffect(() => {
        if (profissionalId) {
            getProfissional(profissionalId);
        }
    }, [profissionalId]);


    return (
        <Layout>
            <div className='p-4'>

                {profissional != null ? (
                    <div>
                        <div className='mx-4'>
                            <p className='font-semibold text-lg' >{profissional.nome}</p>
                            <div className='flex flex-row ' >
                                <p className='font-semibold mr-1' >CRM: </p>
                                <p className='' >{profissional.numCrm}</p>
                                <p className='' >{`/${profissional.ufCrm}`}</p>
                            </div>
                            <div className='flex flex-row'>
                                <p className='font-semibold mr-1'>E-mail: </p>
                                <p className=''>{profissional.username}</p>
                            </div>
                        </div>

                        <div className='overflow-y-auto max-h-[calc(100vh-10rem)] border rounded-md m-2'>

                            <Paper>
                                <Scheduler
                                    data={[]}
                                >
                                    <EditingState
                                        onCommitChanges={commitChanges}
                                    />
                                    <IntegratedEditing />
                                    <ViewState
                                        defaultCurrentDate={currentDate}
                                    // currentDate={currentDate}
                                    // onCurrentDateChange={handleDateChange}
                                    />
                                    <WeekView
                                        startDayHour={8}
                                        endDayHour={18}
                                        excludedDays={[0, 6]}>
                                    </WeekView>
                                    <MonthView />

                                    <DayView
                                        startDayHour={8}
                                        endDayHour={18}
                                    />

                                    <Toolbar />
                                    <TodayButton />
                                    <ViewSwitcher />
                                    <DateNavigator />
                                    <Appointments />
                                    <AppointmentTooltip
                                        showCloseButton
                                        showOpenButton
                                    />
                                    <AppointmentForm

                                    />


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
