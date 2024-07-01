import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '../components/Button';
import Input from '../components/Input';
import AsyncSelectorSala from './AsyncSeletorSala';
import AsyncSelectorProfissional from './AsyncSelectorProfissional';
import Label from './Label';
import { format, isSameDay, isBefore } from 'date-fns';
import axiosWithToken from '../lib/RequestInterceptor';
import InputDisabled from './InputDisabled';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ButtonVermelho from './ButtonVermelho';

const CriarLocacaoMedico = ({ appointmentMeta, onHide, visible, profissional, getLocacoes }) => {
    const initialTitle = appointmentMeta?.data?.title || null;
    const initialStartDate = appointmentMeta?.data?.startDate
        ? format(new Date(appointmentMeta.data.startDate), 'yyyy-MM-dd\'T\'HH:mm')
        : '';
    const initialEndDate = appointmentMeta?.data?.endDate
        ? format(new Date(appointmentMeta.data.endDate), 'yyyy-MM-dd\'T\'HH:mm')
        : '';

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [selectedSala, setSelectedSala] = useState();
    const [selectedAla, setSelectedAla] = useState();
    const [selectedAlaId, setSelectedAlaId] = useState();
    const [respostaErro, setRespostaErro] = useState('');
    const [idLocacao, setIdLocacao] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [locacao, setLocacao] = useState(null);

    useEffect(() => {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);

        if (initialTitle != null) {
            getLocacaoId()
            getLocacao(idLocacao)
        }
    }, [appointmentMeta]);

    useEffect(() => {
    }, [appointmentMeta, profissional]);

    const handleCancel = () => {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
        // setSelectedSala(initialSelectedSala);
        // setSelectedAla(initialSelectedAla);
        onHide();
    };

    const handleSalaChange = (selectedSala) => {
        setSelectedSala(selectedSala);
        setSelectedAla(selectedSala.ala ? selectedSala.ala.nome : '');
    };

    const salvar = () => {

        console.log(`teste: vou tentar salvar`)
        // Verificar campos vazios
        if (!startDate || !endDate || !selectedSala) {
            setRespostaErro('Todos os campos são obrigatórios.');
            return;
        }

        // Verificar se as datas são no mesmo dia
        if (!isSameDay(new Date(startDate), new Date(endDate))) {
            setRespostaErro('As datas de início e fim devem estar no mesmo dia.');
            return;
        }

        // Verificar se a startDate é anterior à endDate
        if (!isBefore(new Date(startDate), new Date(endDate))) {
            setRespostaErro('O horário de início deve ser anterior ao horário de fim.');
            return;
        }

        console.log(`teste: passou pelas validacoes do front`)
        console.log(selectedSala)

        const data = {
            idUsuario: profissional.idUsuario,
            horaInicio: startDate,
            horaFinal: endDate,
            dia: format(new Date(startDate), 'yyyy-MM-dd'),
            sala: selectedSala.value,
            ala: selectedSala.ala.idAla,
            idLocacao: parseInt(idLocacao)
        };

        console.log(`teste: data: ${data}`)
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
                console.error('Erro ao salvar locacao:', error.message);
            });
    };

    const getLocacaoId = () => {
        if (initialTitle != null && initialTitle.includes("#")) {
            let id = initialTitle.split('#')[1].trim();
            setIdLocacao(id)
        }

    }

    const getLocacao = (idLocacao) => {
        console.log(`getLocacao:${idLocacao}`)
        axiosWithToken.get(`http://localhost:8080/locacao/buscar?id=${idLocacao}`)
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    console.log(response.data)
                    setSelectedSala({ label: response.data.sala.nomeSala, value: response.data.sala.idSala, ala: response.data.sala.ala })
                    setSelectedAla(response.data.sala.ala.nome)
                    setSelectedAlaId(response.data.sala.ala.idAla)
                } else {
                    console.error(`Falha ao obter locacoes: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter locacoes:', error.message);
            });
    }

    const openDeleteModal = (locacao) => {
        setLocacao(locacao);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setLocacao(null);
    };

    const confirmDelete = () => {
        console.log(`deletar locacao`)
        console.log(`http://localhost:8080/locacao/delete/${idLocacao}`)
        if (idLocacao) {
            axiosWithToken.delete(`http://localhost:8080/locacao/delete/${idLocacao}`)
                .then((response) => {
                    console.log(response.data);
                    getLocacoes();
                    closeDeleteModal();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };


    return (
        <Dialog open={visible} onClose={onHide}>
            {/* <DialogTitle>Locação</DialogTitle> */}
            <DialogContent>
                {/* <p>id: {idLocacao}</p> */}
                {/* <p>sala: {selectedSala.value}</p> */}
                {/* <p>ala: {selectedAla}</p> */}
                <div className='flex flex-row justify-between'>
                    <div className='mb-4'>
                        <p className='font-semibold text-xl mb-2'>Locação</p>
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

                    {idLocacao &&
                        <div className='h-10'>
                            <ButtonVermelho onClick={() => openDeleteModal()} text="Excluir" />
                        </div>
                    }
                </div>

                <div className='flex flex-row my-4 gap-4'>
                    <div className='w-80'>
                        <Label text='Sala' />
                        <div className='my-2'>
                            <AsyncSelectorSala onSelectionChange={handleSalaChange} defaultValue={selectedSala} />
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
                {idLocacao && <ConfirmDeleteModal
                    isOpen={deleteModalOpen}
                    onCancel={closeDeleteModal}
                    onConfirm={confirmDelete}
                    text={locacao != null ? `Tem certeza que deseja excluir a locacao ${locacao.nome}?` : "Tem certeza que deseja excluir a locação?"}
                />}
            </DialogActions>
        </Dialog>
    );
};

export { CriarLocacaoMedico };
