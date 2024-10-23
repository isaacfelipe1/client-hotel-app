'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import FormFeedback from './FormFeedback';
import React from 'react';

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email?: string;
  profissao?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  sexo?: string;
  rg?: string;
  residencia?: string;
  cep?: string;
  cidade?: string;
  pais?: string;
  telefoneResidencial?: string;
  telefoneComercial?: string;
}

const EditarClienteForm = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchNome, setSearchNome] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<
    'success' | 'error' | undefined
  >(undefined);

  const buscarClientePorNome = async (nome: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5062/api/Clientes?nome=${nome}`,
        {
          withCredentials: true,
        }
      );
      setClientes(response.data);
      setFeedbackMessage('Clientes encontrados com sucesso!');
      setFeedbackType('success');
    } catch {
      setFeedbackMessage('Erro ao buscar clientes. Verifique o nome.');
      setFeedbackType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value;
    setSearchNome(nome);
    if (nome.length > 2) {
      buscarClientePorNome(nome);
    } else {
      setClientes([]);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (cliente) {
      setCliente({
        ...cliente,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleClienteSelect = (clienteSelecionado: Cliente) => {
    setCliente(clienteSelecionado);
    setClientes([]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (cliente) {
        await axios.put(
          `http://localhost:5062/api/Clientes/${cliente.id}`,
          cliente,
          {
            withCredentials: true,
          }
        );
        setFeedbackMessage('Cliente atualizado com sucesso!');
        setFeedbackType('success');
      }
    } catch {
      setFeedbackMessage('Erro ao atualizar cliente.');
      setFeedbackType('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg bg-[#FEFEFC]">
      <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">
        Editar Cliente
      </h1>

      {feedbackMessage && feedbackType && (
        <FormFeedback message={feedbackMessage} type={feedbackType} />
      )}

      <div className="mb-4">
        <label className="block font-semibold text-[#084F9A]">
          Nome do Cliente:
        </label>
        <input
          type="text"
          value={searchNome}
          onChange={handleNomeChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Digite o nome do cliente"
        />
        {clientes.length > 0 && (
          <ul className="border border-gray-300 rounded mt-2">
            {clientes.map((cliente) => (
              <li
                key={cliente.id}
                onClick={() => handleClienteSelect(cliente)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {cliente.nome} - CPF: {cliente.cpf}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && (
        <p className="text-[#084F9A]">Carregando dados do cliente...</p>
      )}

      {cliente && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block font-semibold text-[#084F9A]">
                Nome:
              </label>
              <input
                type="text"
                name="nome"
                value={cliente.nome}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Profissão:
              </label>
              <input
                type="text"
                name="profissao"
                value={cliente.profissao || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Nacionalidade:
              </label>
              <input
                type="text"
                name="nacionalidade"
                value={cliente.nacionalidade || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block font-semibold text-[#084F9A]">CPF:</label>
              <input
                type="text"
                name="cpf"
                value={cliente.cpf}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={cliente.email || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Cidade:
              </label>
              <input
                type="text"
                name="cidade"
                value={cliente.cidade || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                País:
              </label>
              <input
                type="text"
                name="pais"
                value={cliente.pais || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Data de Nascimento:
              </label>
              <input
                type="date"
                name="dataNascimento"
                value={cliente.dataNascimento || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Sexo:
              </label>
              <select
                name="sexo"
                value={cliente.sexo || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">RG:</label>
              <input
                type="text"
                name="rg"
                value={cliente.rg || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Residência:
              </label>
              <input
                type="text"
                name="residencia"
                value={cliente.residencia || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block font-semibold text-[#084F9A]">CEP:</label>
              <input
                type="text"
                name="cep"
                value={cliente.cep || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Telefone Residencial:
              </label>
              <input
                type="text"
                name="telefoneResidencial"
                value={cliente.telefoneResidencial || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Telefone Comercial:
              </label>
              <input
                type="text"
                name="telefoneComercial"
                value={cliente.telefoneComercial || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <button className="w-full bg-[#4C8D68] text-white p-3 rounded mt-4 hover:bg-[#084F9A]">
            Atualizar Cliente
          </button>
        </form>
      )}
    </div>
  );
};

export default EditarClienteForm;
