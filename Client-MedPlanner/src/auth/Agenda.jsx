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
import { CriarLocacaoMedico } from '../components/CriarLocacaoMedico';
import { CriarLocacaoSala } from '../components/CriarLocacaoSala';
import { FaStethoscope } from 'react-icons/fa';

const Agenda = () => {
    const { profissionalId, salaId } = useParams();
    const [profissional, setProfissional] = useState(null);
    const [sala, setSala] = useState(null);
    const [schedulerData, setSchedulerData] = useState([]);
    const [showCustomTooltip, setShowCustomTooltip] = useState(false);

    const getLocacoesDoMedico = (profissionalId) => {

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

    const getLocacoesDaSala = (salaId) => {
        axiosWithToken.get(`http://localhost:8080/locacao/buscar?medico=${salaId}`, {
            params: {
                sala: salaId
            }
        })

            .then((response) => {
                console.log(`teste: ${response.data}`)
                if (response.status === 200) {
                    const dadosCalendario = response.data.map((l) => ({
                        startDate: new Date(l.horaInicio),
                        endDate: new Date(l.horaFinal),
                        title: `${l.usuario.nome} `,
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
            getProfissional(profissionalId);
            getLocacoesDoMedico(profissionalId);
        } else if (salaId) {
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
    };

    return (
        <Layout>
            <div className='p-4'>
                {profissional || sala != null ? (
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
                                        <div className='bg-gray-50 rounded h-24 max-w-96 px-2 mx-2 border overflow-y-auto'>

                                            {sala.recursos.map((r) => (
                                                <div>
                                                    <div className='flex flex-row items-center' key={r.idRecurso}>
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
                                {profissionalId && showCustomTooltip && (
                                    <CriarLocacaoMedico
                                        appointmentMeta={null}
                                        onHide={handleCloseCustomTooltip}
                                        visible={showCustomTooltip}
                                        profissional={profissional}
                                        getLocacoes={getLocacoesDoMedico} // Passa a função getLocacoes
                                    />
                                )}
                                {salaId && showCustomTooltip && (
                                    <CriarLocacaoSala
                                        appointmentMeta={null}
                                        onHide={handleCloseCustomTooltip}
                                        visible={showCustomTooltip}
                                        sala={sala}
                                        getLocacoes={getLocacoesDaSala} // Passa a função getLocacoes
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
                                            <CriarLocacaoMedico
                                                {...props}


                                                profissional={profissional}
                                                getLocacoes={getLocacoesDoMedico} // Passa a função getLocacoes
                                            />
                                        )}
                                    // layoutComponent={(props) => (
                                    //     <CustomTooltipLayout {...props} profissional={profissional} 

                                    //     />
                                    // )}
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
