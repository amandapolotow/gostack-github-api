import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repositories, Error } from './styles';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storageRepositories){
            return JSON.parse(storageRepositories);
        }else{
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
        event.preventDefault();
        if(!newRepo){
            setInputError('Digite autor/nome do repositório');
            return;
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;

            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');
        } catch (error) {
            setInputError('Repositório não encontrado');
        }
    }

    return (
        <>
        <img src={logoImg} alt="Github Explorer" />
    <Title>Explore Repositórios no Github</Title>
    <Form hasError={!!inputError} onSubmit={handleAddRepository} >
        <input
            value={newRepo}
            onChange={(e) => setNewRepo(e.target.value)}
            placeholder="Digite aqui o nome do reposítório"
        />
        <button type="submit" >Pesquisar</button>
    </Form>
    {inputError && <Error>{inputError}</Error>}
    <Repositories>
        {repositories.map(repository => (
            <Link key={repository.full_name} to={`/repository/${repository.full_name}`} >
                <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
                />
                <div>
                    <strong>{repository.full_name}</strong>
                    <p>{repository.description}</p>
                </div>
                <FiChevronRight size={20} />
            </Link>
        ))}
    </Repositories>
    </>
    );
}

export default Dashboard;
