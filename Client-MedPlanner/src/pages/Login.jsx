import React, { useState } from 'react'
import logo from '../assets/logoMedPlanner.png'
import Input from '../components/Input'
import Label from '../components/Label'
import LinkStyled from '../components/LinkStyled'
import Button from '../components/Button'
import { useAuth } from '../lib/AuthProvider'
import { authenticate } from '../lib/Auth'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleClickEntrar = async (e) => {
        e.preventDefault();
        try {
            await authenticate(username, password).then((response) => {
                setToken(response.token);
                localStorage.setItem("usuario", response.usuario);
                navigate("/home", { replace: true });
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }


    return (
        <div className='h-screen w-screen bg-gray-200'>
            <div className="h-screen flex items-center justify-center">
                <div>
                    <form className="bg-white shadow-md rounded-lg px-16 pt-6 pb-8 mb-4">
                        <div className='w-full mb-8 mt-4'>
                            <img src={logo} alt="logo sga" className='w-48 mx-auto' />

                        </div>
                        <div className="mb-6">
                            <Label text="Usuário" />
                            <Input type="text" placeholder="" onChange={handleChangeUsername} />
                        </div>
                        <div className="mb-6">
                            <Label text="Senha" />
                            <Input type="password" placeholder="" onChange={handleChangePassword} />

                        </div>
                        <div className="flex items-center justify-between">
                            <LinkStyled to="#" text="Esqueceu sua senha?" />

                            <Button text="Entrar" onClick={handleClickEntrar} />

                        </div>
                    </form>


                </div>

            </div>

        </div>
    )
}

export default Login