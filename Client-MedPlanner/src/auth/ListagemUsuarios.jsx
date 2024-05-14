
import axiosWithToken from '../lib/RequestInterceptor';
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Layout from '../components/Layout';

const ListagemUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = () => {
        axiosWithToken.get('http://localhost:8080/usuario/listar')
            .then((response) => { setUsuarios(response.data) })
            .catch((error) => { console.log(error) })
    }

    return (
        <Layout>
            {<div className='p-4'>
                <h2 className='p-4 text-xl font-bold'>Usuários</h2>

                {usuarios.length > 0 ?

                    <div className='p-4'>
                        <div className="h-full w-full overflow-scroll">
                            {usuarios.map((u) => (
                                <div className='m-4 p-4 grid grid-cols-2 gap-8 border border-gray-100 rounded-lg shadow-md'>
                                    <div>
                                        <h2 className='text-xl font-bold'>{u.nome}</h2>
                                        <p>Administrador</p>
                                    </div>
                                    <div className='flex items-center text-sm justify-end h-9'>
                                        <Button onClick={() => navigate(`/usuario/${u.idUsuario}`)} text="Detalhes" />
                                    </div>
                                </div>

                            ))}

                        </div>
                    </div>
                    :

                    <div className='p-4'>

                        <div className='m-10'>

                            <p className='text-gray-400 text-center'>Nenhum registro encontrado</p>

                        </div>

                    </div>


                }
            </div >}
        </Layout >
    )

}

export default ListagemUsuarios