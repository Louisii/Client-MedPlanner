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
    TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import { useParams } from 'react-router-dom';
import axiosWithToken from '../lib/RequestInterceptor';
import { Typography } from '@material-tailwind/react';
import Button from '../components/Button';
import { FaStethoscope } from 'react-icons/fa';
import CriarLocacao from '../components/CriarLocacao';

const Agenda = () => {
    const { profissionalId, salaId } = useParams();
    const [profissional, setProfissional] = useState(null);
    const [sala, setSala] = useState(null);
    const [schedulerData, setSchedulerData] = useState([]);
    const [showCustomTooltip, setShowCustomTooltip] = useState(false);

    const getLocacoesDoMedico = () => {

        axiosWithToken.get(`http://localhost:8080/locacao/buscar?medico=${profissionalId}`)
            .then((response) => {
                console.log(`teste: ${response.data}`)
                if (response.status === 200) {
                    const dadosCalendario = response.data.map((l) => ({
                        // id: l.idLocacao,
                        startDate: new Date(l.horaInicio),
                        endDate: new Date(l.horaFinal),
                        title: `${l.sala.nomeSala} #${l.idLocacao}`,
                        style: {
                            backgroundColor: '#FFC107',
                        }
                    }));
                    setSchedulerData(dadosCalendario);
                } else {
                    console.error(`Falha ao obter locacoes: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter locacoes:', error.message);
            });
    };

    const getLocacoesDaSala = () => {
        axiosWithToken.get(`http://localhost:8080/locacao/buscar?sala=${salaId}`)

            .then((response) => {
                console.log(`locacoes`)
                console.log(response.data)
                if (response.status === 200) {
                    const dadosCalendario = response.data.map((l) => ({
                        startDate: new Date(l.horaInicio),
                        endDate: new Date(l.horaFinal),
                        title: `${l.usuario.nome} #${l.idLocacao}`,
                        style: {
                            backgroundColor: '#FFC107',
                        }
                    }));
                    setSchedulerData(dadosCalendario);
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

    const getSala = (id) => {
        axiosWithToken.get(`http://localhost:8080/sala/buscar?idSala=${id}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log('Fetched sala:', response.data);
                    setSala(response.data);
                } else {
                    console.error(`Falha ao obter sala: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter sala:', error.message);
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
            console.log('Fetching professional with ID:', profissionalId);
            getProfissional(profissionalId);
            getLocacoesDoMedico(profissionalId);
        } else if (salaId) {
            console.log('Fetching sala with ID:', salaId);
            getSala(salaId);
            getLocacoesDaSala(salaId);
        }

    }, [profissionalId, salaId]);


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

    const handleNovaLocacaoClick = () => {
        setShowCustomTooltip(true);
    };

    const handleCloseCustomTooltip = () => {
        setShowCustomTooltip(false);
        if (profissionalId) {
            getLocacoesDoMedico(profissionalId);
        } else if (salaId) {
            getLocacoesDaSala(salaId);
        }
    };
    return (
        <Layout>
            <div className='p-4'>
                {profissional || sala ? (
                    <div>
                        <div className='flex flex-row justify-between'>
                            {profissional &&
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
                            }
                            {sala &&
                                <div className='flex flex-row justify-between'>
                                    <div className='mx-4'>
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
                                        <p className='font-semibold mx-2 mb-1'>Recursos:</p>
                                        <div className='min-w-96 bg-gray-50 rounded h-24 max-w-96 px-2 mx-2 border overflow-y-auto '>
                                            {sala.recursos.map((r) => (
                                                <div key={r.idRecurso}>
                                                    <div className='flex flex-row items-center'>
                                                        <FaStethoscope size={14} /><p className=' ml-1'> {r.nomeRecurso}</p>
                                                    </div>
                                                    <p className='border-b ml-5 text-sm text-gray-500'> {r.descricao}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                            <div>
                                <Button onClick={handleNovaLocacaoClick} text="Nova locação" />
                                {profissionalId && (
                                    <CriarLocacao
                                        appointmentMeta={null}
                                        onHide={handleCloseCustomTooltip}
                                        visible={showCustomTooltip}
                                        entity={profissional}
                                        getLocacoes={getLocacoesDoMedico}
                                        type={"medico"}
                                    />

                                )}
                                {salaId && (
                                    <CriarLocacao
                                        appointmentMeta={null}
                                        onHide={handleCloseCustomTooltip}
                                        visible={showCustomTooltip}
                                        entity={sala}
                                        getLocacoes={getLocacoesDaSala}
                                        type={"sala"}
                                    />

                                )}
                            </div>
                        </div>
                        <div className='overflow-y-auto max-h-[calc(100vh-12rem)] border rounded-md m-2'>
                            <Paper>
                                <Scheduler data={schedulerData} locale="pt-BR">
                                    <EditingState onCommitChanges={commitChanges} />
                                    <IntegratedEditing />
                                    <ViewState defaultCurrentDate={new Date()} />
                                    <WeekView startDayHour={6} endDayHour={23} excludedDays={[0]} cellDuration={120} />
                                    <MonthView />
                                    <DayView startDayHour={6} endDayHour={23} />
                                    <Toolbar />
                                    <TodayButton />
                                    <ViewSwitcher />
                                    <DateNavigator />
                                    <Appointments appointmentComponent={Appointment} />
                                    <AppointmentTooltip
                                        showCloseButton
                                        showOpenButton
                                        layoutComponent={(props) => (
                                            profissionalId ?
                                                <CriarLocacao
                                                    {...props}
                                                    entity={profissional}
                                                    getLocacoes={getLocacoesDoMedico}
                                                    type={"medico"}
                                                />
                                                :
                                                <CriarLocacao
                                                    {...props}
                                                    entity={sala}
                                                    getLocacoes={getLocacoesDaSala}
                                                    type={"sala"}
                                                />
                                        )}
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
