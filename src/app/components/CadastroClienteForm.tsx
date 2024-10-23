'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import FormFeedback from './FormFeedback';

interface Cliente {
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
  motivoViagem?: string;
  meioTransporte?: string;
  proximoDestino?: string;
}

const CadastroClienteForm = () => {
  const [cliente, setCliente] = useState<Cliente>({
    nome: '',
    cpf: '',
    email: '',
    motivoViagem: '',
    meioTransporte: '',
    proximoDestino: '',
  });

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | undefined>(undefined);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5062/api/Clientes',
        cliente,
        {
          withCredentials: true,
        }
      );
      console.log('Cliente inserido com sucesso:', response.data);

      setFeedbackMessage('Cliente cadastrado com sucesso!');
      setFeedbackType('success');

      setCliente({
        nome: '',
        cpf: '',
        email: '',
        motivoViagem: '',
        meioTransporte: '',
        proximoDestino: '',
      });
    } catch (error) {
      console.error('Erro ao inserir cliente:', error);

      setFeedbackMessage('Erro ao cadastrar cliente. Por favor, tente novamente.');
      setFeedbackType('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg"
    >
      <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">
        Ficha Cadastral de Clientes - Hotel
      </h1>

      {feedbackMessage && feedbackType && (
        <FormFeedback message={feedbackMessage} type={feedbackType} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block font-semibold text-[#084F9A]">Nome:</label>
          <input
            type="text"
            name="nome"
            value={cliente.nome}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold text-[#084F9A]">Email:</label>
          <input
            type="email"
            name="email"
            value={cliente.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block font-semibold text-[#084F9A]">Profissão:</label>
          <input
            type="text"
            name="profissao"
            value={cliente.profissao || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Nacionalidade:</label>
          <input
            type="text"
            name="nacionalidade"
            value={cliente.nacionalidade || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">RG:</label>
          <input
            type="text"
            name="rg"
            value={cliente.rg || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">CPF:</label>
          <input
            type="text"
            name="cpf"
            value={cliente.cpf}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block font-semibold text-[#084F9A]">Residência:</label>
          <input
            type="text"
            name="residencia"
            value={cliente.residencia || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">CEP:</label>
          <input
            type="text"
            name="cep"
            value={cliente.cep || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Cidade:</label>
          <input
            type="text"
            name="cidade"
            value={cliente.cidade || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">País:</label>
          <input
            type="text"
            name="pais"
            value={cliente.pais || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <div>
          <label className="block font-semibold text-[#084F9A]">Sexo:</label>
          <select
            name="sexo"
            value={cliente.sexo || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block font-semibold text-[#084F9A]">
            Data de Nascimento:
          </label>
          <input
            type="date"
            name="dataNascimento"
            value={cliente.dataNascimento || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block font-semibold text-[#084F9A]">
            Telefone Residencial:
          </label>
          <input
            type="text"
            name="telefoneResidencial"
            value={cliente.telefoneResidencial || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
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
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block font-semibold text-[#084F9A]">Motivo da Viagem:</label>
          <select
            name="motivoViagem"
            value={cliente.motivoViagem || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          >
            <option value="">Selecione</option>
            <option value="negocio">Negócio</option>
            <option value="convencao">Convenção</option>
            <option value="turismo">Turismo</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Meio de Transporte:</label>
          <select
            name="meioTransporte"
            value={cliente.meioTransporte || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          >
            <option value="">Selecione</option>
            <option value="carro">Carro</option>
            <option value="aviao">Avião</option>
            <option value="onibus">Ônibus</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Próximo Destino:</label>
          <input
            type="text"
            name="proximoDestino"
            value={cliente.proximoDestino || ''}
            onChange={handleChange}
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
      </div>

      <button className="w-full bg-[#084F9A] text-white p-3 rounded mt-4 hover:bg-blue-700">
        Cadastrar Cliente
      </button>
    </form>
  );
};

export default CadastroClienteForm;
