export const authenticate = async (username, password) => {
    try {
        const response = await fetch('http://127.0.0.1:8080/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "username": username, "password": password }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else if (response.status === 401) {
            throw new Error("Usuário ou senha incorretos!");
        } else {
            throw new Error("Dados incorretos ou não cadastrados!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


export const create = async (nome, senha) => {
    try {
        const response = await fetch('http://localhost:8080/usuario/salvar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "nome": nome, "senha": senha }),
        });

        if (response.ok) {
            const usuario = await response.text();
            return usuario;
        } else {
            throw new Error("Usuário inválido");
        }
    } catch (error) {
        throw new Error('Erro ao autenticar:' + error);
    }
}

