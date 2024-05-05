
import axiosWithToken from '../lib/RequestInterceptor';
import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import { FaEdit } from 'react-icons/fa';
import Button from '../components/Button';
import logo from '../assets/logo2.png'
import { Card, Typography } from "@material-tailwind/react";
import MenuLateral from '../components/MenuLateral';
import Layout from '../components/Layout';

const ListagemDePacientes = () => {
    const [pacientes, setPacientes] = useState([]);

    let pacientesExHead = [
        'Prontuário', 'Nome', 'CPF', 'Nome da Mãe', 'Ação'
    ];

    useEffect(() => {
        getPacientes();
    }, []);

    const getPacientes = () => {
        axiosWithToken.get('http://localhost:8080/paciente/listar')
            .then((response) => { setPacientes(response.data) })
            .catch((error) => { console.log(error) })
    }

    return (
        <Layout>
            {<div className='p-4'>
                <h2 className='p-4'>Pacientes</h2>

                {pacientes.length > 0 ?

                    <div className='p-4'>
                        <Card className="h-full w-full overflow-scroll">
                            <table className="w-full min-w-max table-auto text-left p-0">
                                <thead className='bg-gray-300 rounded-t-md m-0 '>
                                    <tr>
                                        {pacientesExHead.map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-gray-50 p-4">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/*  
                            barras de pesquisa para filtrar os pacientes, será implementado para a entrega do tcs
                                <tr key={'a'} className="even:bg-blue-gray-50/50">
                                    <td className="p-4">
                                        <Input placeholder="" type="text" />
                                    </td>
                                    <td className="p-4">
                                        <Input placeholder="" type="text" />
                                    </td>
                                    <td className="p-4">
                                        <Input placeholder="" type="text" />
                                    </td><td className="p-4">
                                        <Input placeholder="" type="text" />
                                    </td>
                                    <td className="p-4">

                                    </td>
                                </tr> 
                            */}

                                    {pacientes.map((p, i) => (
                                        <tr key={p.idPaciente} className="even:bg-gray-100 px-2">
                                            <td className="px-4 py-2">
                                                <Typography variant="small" color="gray" className="font-normal">
                                                    {p.idPaciente}
                                                </Typography>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {p.nome}
                                                </Typography>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {p.cpf}
                                                </Typography>
                                            </td><td className="px-4 py-2">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {p.nomeMae}
                                                </Typography>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Button text={<FaEdit />} onClick={() => { }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                    :

                    <div className='p-4'>
                        <Card className="h-full w-full overflow-scroll">
                            <table className="w-full min-w-max table-auto text-left p-0">
                                <thead className='bg-gray-300 rounded-t-md m-0 '>
                                    <tr>
                                        {pacientesExHead.map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-gray-50 p-4">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70">
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </Card>
                        <div className='m-10'>

                            <p className='text-gray-400 text-center'>Nenhum registro encontrado</p>

                        </div>

                    </div>


                }
            </div>}
        </Layout>
    )

}

export default ListagemDePacientes