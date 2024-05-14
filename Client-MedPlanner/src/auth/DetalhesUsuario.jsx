
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom'
import axiosWithToken from '../lib/RequestInterceptor';

const DetalhesUsuario = () => {
    const { usuarioId } = useParams()
    const [usuario, setUsuario] = useState([]);

    useEffect(() => {
        getUsuario();
    }, []);

    useEffect(() => {
        getUsuario(usuarioId);
    }, []);

    const getUsuario = (usuarioId) => {
        axiosWithToken.get(`http://localhost:8080/usuario/buscar?id=${usuarioId}`)
            .then((response) => { setUsuario(response.data) })
            .catch((error) => { console.log(error) })
    }

    return (
        <Layout>
            {<div className='p-4'>
                <h2 className='p-4 text-xl font-bold'>Usuários</h2>
                <p>{usuario.nome}</p>
            </div >}
        </Layout >
    )

}

export default DetalhesUsuario