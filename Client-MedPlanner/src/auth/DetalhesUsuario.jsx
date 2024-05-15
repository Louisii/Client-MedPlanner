
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom'
import axiosWithToken from '../lib/RequestInterceptor';
import Button from '../components/Button';

const DetalhesUsuario = () => {
    const { usuarioId } = useParams()
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        getUsuario(usuarioId);
    }, [usuarioId]);

    const getUsuario = (usuarioId) => {
        axiosWithToken.get(`http://localhost:8080/usuario/buscar?id=${usuarioId}`)
            .then((response) => {
                if (response.status === 200) {
                    setUsuario(response.data[0]);
                } else {
                    console.error(`Falha ao obter usuário: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter usuário:', error.message);
                // Aqui você pode adicionar lógica para exibir uma mensagem de erro para o usuário
            });
    }

    return (
        <Layout>
            {usuario != null ?
                <div className='p-4'>
                    <h2 className='p-4 text-xl font-bold'>Detalhes do Usuário</h2>


                    <div className='m-4 p-4'>
                        {/* <h2 className='text-md font-bold'>{usuario.nome}</h2> */}
                        <p>Username: {usuario.nome}</p>
                        <p>Função: Administrador</p>
                        <p>Username: {usuario.username}</p>
                        <p>CPF: {usuario.cpf}</p>
                        <p>Situação: {usuario.situacao}</p>
                    </div>
                    <div className='flex items-center text-sm  h-9 gap-4 m-4 p-4'>
                        <Button onClick={() => navigate(`/listagem-usuario`)} text="Voltar" />
                        <Button onClick={() => navigate(`/edicao-usuario/${usuarioId}`)} text="Editar" />
                    </div>


                </div>
                :
                <p></p>
            }
        </Layout >
    )

}

export default DetalhesUsuario