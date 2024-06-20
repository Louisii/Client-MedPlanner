
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


// https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/editing/

const Agenda = () => {
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

    return (
        <Layout>
            <div className='p-4'>
                <h2 className='p-4 text-xl font-bold'>Agenda</h2>

                <div className='p-4'>
                    <div className='mx-10'>
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
                                <MonthView />
                                <WeekView
                                    startDayHour={8}
                                    endDayHour={18}
                                    excludedDays={[0, 6]}>
                                </WeekView>
                                <DayView
                                    startDayHour={8}
                                    endDayHour={18}
                                />

                                <Toolbar />
                                <TodayButton />
                                <ViewSwitcher />
                                <DateNavigator />
                                <Appointments />
                                {/* <AppointmentTooltip
                                        showCloseButton
                                        showOpenButton
                                    /> */}
                                {/* <AppointmentForm

                                    /> */}


                            </Scheduler>
                        </Paper>
                    </div>
                </div>


            </div>
        </Layout>
    );
};

export default Agenda;
