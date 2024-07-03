import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import Button from '../components/Button';
import Input from '../components/Input';
import SelectorSala from './SelectorSala';
import SelectorProfissional from './SelectorProfissional';
import Label from './Label';
import { format, isSameDay, isBefore } from 'date-fns';
import axiosWithToken from '../lib/RequestInterceptor';
import InputDisabled from './InputDisabled';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ButtonVermelho from './ButtonVermelho';

const CriarLocacao = ({ appointmentMeta, onHide, visible, entity, getLocacoes, type }) => {
    const initialTitle = appointmentMeta?.data?.title || null;
    const initialStartDate = appointmentMeta?.data?.startDate
        ? format(new Date(appointmentMeta.data.startDate), 'yyyy-MM-dd\'T\'HH:mm')
        : '';
    const initialEndDate = appointmentMeta?.data?.endDate
        ? format(new Date(appointmentMeta.data.endDate), 'yyyy-MM-dd\'T\'HH:mm')
        : '';

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [selectedSala, setSelectedSala] = useState(null);
    const [selectedMedico, setSelectedMedico] = useState(null);
    const [selectedAla, setSelectedAla] = useState('');
    const [respostaErro, setRespostaErro] = useState('');
    const [idLocacao, setIdLocacao] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [locacao, setLocacao] = useState(null);

    useEffect(() => {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);

        if (initialTitle) {
            getLocacaoId();
            getLocacao(idLocacao);
        }
    }, [appointmentMeta, visible]);

    const handleCancel = () => {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
        setSelectedSala(null);
        setSelectedMedico(null);
        onHide();
    };

    const salvar = () => {
        if (!startDate || !endDate || (!selectedSala && !selectedMedico)) {
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
            idUsuario: type === 'medico' ? entity.idUsuario : selectedMedico.value,
            horaInicio: startDate,
            horaFinal: endDate,
            dia: format(new Date(startDate), 'yyyy-MM-dd'),
            sala: type === 'medico' ? selectedSala.value : entity.idSala,
            ala: type === 'medico' ? selectedSala.ala.idAla : entity.ala.idAla,
            idLocacao: parseInt(idLocacao)
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
                console.error('Erro ao salvar locação:', error.message);
            });
    };

    const getLocacaoId = () => {
        if (initialTitle && initialTitle.includes("#")) {
            let id = initialTitle.split('#')[1].trim();
            setIdLocacao(id);
        }
    };

    const getLocacao = (idLocacao) => {
        axiosWithToken.get(`http://localhost:8080/locacao/buscar?id=${idLocacao}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data)
                    const { sala, profissional } = response.data;
                    if (type === 'medico') {
                        setSelectedSala({ label: sala.nomeSala, value: sala.idSala, ala: sala.ala });
                        setSelectedAla(sala.ala.nome);
                    } else {
                        setSelectedMedico({ label: profissional.nome, value: profissional.idUsuario });
                    }
                }
            })
            .catch((error) => {
                console.error('Erro ao obter locação:', error.message);
            });
    };

    const openDeleteModal = () => {
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const confirmDelete = () => {
        if (idLocacao) {
            axiosWithToken.delete(`http://localhost:8080/locacao/delete/${idLocacao}`)
                .then((response) => {
                    closeDeleteModal();
                    handleCancel()

                })
                .catch((error) => {
                    console.error('Erro ao excluir locação:', error.message);
                });
        }
    };

    const handleSalaChange = (selectedSala) => {
        setSelectedSala(selectedSala);
        setSelectedAla(selectedSala.ala ? selectedSala.ala.nome : '');
    };

    const handleProfissionalSelection = (data) => {
        setSelectedMedico(data);
    };

    return (
        <Dialog open={visible} onClose={onHide}>
            <DialogContent>
                <div className='flex flex-row justify-between'>
                    <div className='mb-4'>
                        {initialTitle ? <p className='font-semibold text-xl mb-2'>Editar Locação</p> : <p className='font-semibold text-xl mb-2'>Nova Locação</p>}
                        {initialTitle && initialTitle.includes("#") && <p className='font-semibold text-lg'>{initialTitle.split('#')[0].trim()}</p>}
                        {type === 'medico' && (
                            <>
                                <p className='font-semibold text-lg'>{entity.nome}</p>
                                <div className='flex flex-row'>
                                    <p className='font-semibold mr-1'>CRM: </p>
                                    <p>{entity.numCrm}</p>
                                    <p>{`/${entity.ufCrm}`}</p>
                                </div>
                                <div className='flex flex-row'>
                                    <p className='font-semibold mr-1'>E-mail: </p>
                                    <p>{entity.username}</p>
                                </div>
                            </>
                        )}
                        {type === 'sala' && (
                            <>
                                <p className='font-semibold text-lg'>{entity.nomeSala}</p>
                                <div className='flex flex-row'>
                                    <p className='font-semibold mr-1'>Ala: </p>
                                    <p>{entity.ala.nome}</p>
                                </div>
                                <div className='flex flex-row'>
                                    <p className='font-semibold mr-1'>Andar: </p>
                                    <p>{entity.andar}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {idLocacao && (
                        <div className='h-10'>
                            <ButtonVermelho onClick={() => openDeleteModal()} text="Excluir" />
                        </div>
                    )}
                </div>

                {type === 'medico' && (
                    <>
                        <div className='flex flex-row my-4 gap-4'>
                            <div className='w-80'>
                                <Label text='Sala' />
                                <div className='my-2'>
                                    <SelectorSala onSelectionChange={handleSalaChange} defaultValue={selectedSala} />  {/* Atualizado aqui */}
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
                    </>
                )}

                {type === 'sala' && (
                    <>
                        <div>
                            <Label text='Médico' />
                            <SelectorProfissional onSelectionChange={handleProfissionalSelection} />
                        </div>
                    </>
                )}

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
                {respostaErro && (
                    <div className='bg-red-200 rounded m-2 p-2'>{respostaErro}</div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} text='Cancelar' />
                <Button onClick={salvar} color='primary' text='Salvar' />
                {idLocacao && (
                    <ConfirmDeleteModal
                        isOpen={deleteModalOpen}
                        onCancel={closeDeleteModal}
                        onConfirm={confirmDelete}
                    />
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CriarLocacao;
