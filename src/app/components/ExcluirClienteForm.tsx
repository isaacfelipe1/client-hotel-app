'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import FormFeedback from './FormFeedback';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
}

const ExcluirClienteForm = () => {
  const [id, setId] = useState('');
  const [searchNome, setSearchNome] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const buscarClientePorNome = async (nome: string) => {
    try {
      const response = await axios.get<Cliente[]>(
        `http://localhost:5062/api/Clientes?nome=${nome}`,
        {
          withCredentials: true,
        }
      );
      setClientes(response.data);
    } catch {
      console.error('Erro ao buscar clientes.');
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

  const handleClienteSelect = (clienteSelecionado: Cliente) => {
    setId(clienteSelecionado.id.toString());
    setSearchNome(clienteSelecionado.nome);
    setClientes([]);
  };
  const handleDelete = (e: FormEvent) => {
    e.preventDefault();

    if (!id) {
      setFeedbackMessage('Por favor, insira um ID válido.');
      setFeedbackType('error');
      return;
    }

    setIsModalOpen(true); 
  };
  const confirmDelete = async () => {
    setLoading(true);
    setIsModalOpen(false); 
    try {
      await axios.delete(`http://localhost:5062/api/Clientes/${id}`, {
        withCredentials: true,
      });
      setFeedbackMessage('Cliente excluído com sucesso!');
      setFeedbackType('success');
      setId('');
      setSearchNome('');
    } catch {
      setFeedbackMessage('Erro ao excluir cliente. Verifique o ID.');
      setFeedbackType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg bg-[#FEFEFC]">
      <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">
        Excluir Cliente
      </h1>

      {feedbackMessage && feedbackType && (
        <FormFeedback message={feedbackMessage} type={feedbackType} />
      )}

      <form onSubmit={handleDelete}>
        <div className="mb-4">
          <label className="block font-semibold text-[#084F9A]">
            Nome do Cliente:
          </label>
          <input
            type="text"
            value={searchNome}
            onChange={handleNomeChange}
            className="w-full p-2 border border-[#084F9A] rounded"
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

        <div className="mb-4">
          <label className="block font-semibold text-[#084F9A]">
            ID do Cliente:
          </label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full p-2 border border-[#084F9A] rounded"
            placeholder="Digite ou selecione o ID do cliente"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white p-3 rounded mt-4 hover:bg-red-700"
          disabled={loading}
        >
          {loading ? 'Excluindo...' : 'Excluir Cliente'}
        </button>
      </form>

      {isModalOpen && (
        <ConfirmDeleteModal
          message="Tem certeza que deseja excluir este cliente?"
          onConfirm={confirmDelete}
          onCancel={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ExcluirClienteForm;
