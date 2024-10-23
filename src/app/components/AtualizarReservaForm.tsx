import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import FormFeedback from './FormFeedback';

interface Cliente {
  id: number;
  nome: string;
}

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  isOccupied: boolean;
  pricePerNight: number;
}

interface Reserva {
  id: number;
  clienteId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  numeroDeAdultos: number;
  numeroDeCriancas0A5Anos: number;
  numeroDeCriancas: number;
  incluirCafeDaManha: boolean;
  totalPrice: number;
}

interface EditarReservaFormProps {
  reservaId: number;
}

const AtualizarReservaForm : React.FC<EditarReservaFormProps> = ({ reservaId }) => {
  const [reserva, setReserva] = useState<Reserva>({
    id: reservaId,
    clienteId: 0,
    roomId: 0,
    checkInDate: '',
    checkOutDate: '',
    status: '',
    numeroDeAdultos: 1,
    numeroDeCriancas0A5Anos: 0,
    numeroDeCriancas: 0,
    incluirCafeDaManha: false,
    totalPrice: 0,
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchNome, setSearchNome] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReserva();
    fetchAvailableRooms();
  }, [reservaId]);

  const fetchReserva = async () => {
    try {
      const response = await axios.get<Reserva>(`http://localhost:5062/api/Reservations/${reservaId}`, {
        withCredentials: true,
      });
      setReserva(response.data);
      fetchClienteNome(response.data.clienteId);
    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      setFeedbackMessage('Erro ao carregar os dados da reserva.');
      setFeedbackType('error');
    }
  };

  const fetchClienteNome = async (clienteId: number) => {
    try {
      const response = await axios.get<Cliente>(`http://localhost:5062/api/Clientes/${clienteId}`, {
        withCredentials: true,
      });
      setSearchNome(response.data.nome);
    } catch (error) {
      console.error('Erro ao buscar nome do cliente:', error);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get<Room[]>('http://localhost:5062/api/Rooms', {
        withCredentials: true,
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Erro ao buscar quartos:', error);
    }
  };

  const buscarClientePorNome = async (nome: string) => {
    try {
      const response = await axios.get<Cliente[]>(`http://localhost:5062/api/Clientes?nome=${nome}`, {
        withCredentials: true,
      });
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReserva({
      ...reserva,
      [name]: name === 'incluirCafeDaManha' ? value === 'true' : value,
    });
  };

  const handleClienteSelect = (cliente: Cliente) => {
    setReserva({ ...reserva, clienteId: cliente.id });
    setSearchNome(cliente.nome);
    setClientes([]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:5062/api/Reservations/${reservaId}`, reserva, {
        withCredentials: true,
      });
      setFeedbackMessage('Reserva atualizada com sucesso!');
      setFeedbackType('success');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Erro ao atualizar reserva:', error.response?.data);
        setFeedbackMessage(error.response?.data || 'Erro ao atualizar a reserva. Verifique os dados e tente novamente.');
        setFeedbackType('error');
      } else {
        console.error('Erro desconhecido:', error);
        setFeedbackMessage('Ocorreu um erro desconhecido.');
        setFeedbackType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">Editar Reserva</h1>

      {feedbackMessage && feedbackType && (
        <FormFeedback message={feedbackMessage} type={feedbackType} />
      )}

      {loading && (
        <p className="text-center text-[#084F9A]">Atualizando reserva...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold text-[#084F9A]">Nome do Cliente:</label>
          <input
            type="text"
            value={searchNome}
            onChange={handleNomeChange}
            className="w-full p-2 border border-[#084F9A] rounded"
            placeholder="Digite o nome do cliente"
            disabled={loading}
          />
          {clientes.length > 0 && (
            <ul className="border border-gray-300 rounded mt-2">
              {clientes.map((cliente) => (
                <li
                  key={cliente.id}
                  onClick={() => handleClienteSelect(cliente)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {cliente.nome}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">ID do Cliente:</label>
          <input
            type="number"
            name="clienteId"
            value={reserva.clienteId}
            readOnly
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">ID do Quarto:</label>
          <select
            name="roomId"
            value={reserva.roomId}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#084F9A] rounded"
            disabled={loading}
          >
            <option value="">Selecione um quarto</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.roomNumber} - {room.type} - R$ {room.pricePerNight}/noite
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Data de Check-in:</label>
          <input
            type="date"
            name="checkInDate"
            value={reserva.checkInDate.split('T')[0]}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#084F9A] rounded"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Data de Check-out:</label>
          <input
            type="date"
            name="checkOutDate"
            value={reserva.checkOutDate.split('T')[0]}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#084F9A] rounded"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Número de Adultos:</label>
          <input
            type="number"
            name="numeroDeAdultos"
            value={reserva.numeroDeAdultos}
            onChange={handleChange}
            min={1}
            className="w-full p-2 border border-[#084F9A] rounded"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Crianças (0 a 5 anos):</label>
          <input
            type="number"
            name="numeroDeCriancas0A5Anos"
            value={reserva.numeroDeCriancas0A5Anos}
            onChange={handleChange}
            min={0}
            className="w-full p-2 border border-[#084F9A] rounded"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Crianças (A partir de 6 anos):</label>
          <input
            type="number"
            name="numeroDeCriancas"
            value={reserva.numeroDeCriancas}
            onChange={handleChange}
            min={0}
            className="w-full p-2 border border-[#084F9A] rounded"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Incluir Café da Manhã?</label>
          <select
            name="incluirCafeDaManha"
            value={reserva.incluirCafeDaManha ? 'true' : 'false'}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#084F9A] rounded"
            disabled={loading}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Status da Reserva:</label>
          <select
            name="status"
            value={reserva.status}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#084F9A] rounded"
            disabled={loading}
          >
            <option value="">Selecione</option>
            <option value="Ativa">Ativa</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Preço Total:</label>
          <input
            type="number"
            name="totalPrice"
            value={reserva.totalPrice}
            readOnly
            className="w-full p-2 border border-[#084F9A] rounded bg-gray-100"
          />
        </div>
      </div>

      <button
        type="submit"
        className={`w-full bg-[#084F9A] text-white p-3 rounded mt-4 hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Atualizando...' : 'Atualizar Reserva'}
      </button>
    </form>
  );
};

export default AtualizarReservaForm;