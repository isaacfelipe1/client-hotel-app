'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import FormFeedback from './FormFeedback';

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  pricePerNight: number;
  isOccupied: boolean;
}

const EditarQuartoForm = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<
    'success' | 'error' | undefined
  >(undefined);

  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const fetchRoom = async () => {
    setLoading(true);
    setFeedbackMessage('');
    try {
      const response = await axios.get(
        `http://localhost:5062/api/Rooms/${id}`,
        {
          withCredentials: true,
        }
      );
      setRoom(response.data);
      setFeedbackMessage('Quarto encontrado com sucesso!');
      setFeedbackType('success');
    } catch {
      setFeedbackMessage('Erro ao buscar quarto. Verifique o ID.');
      setFeedbackType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (room) {
      setRoom({
        ...room,
        [e.target.name]:
          e.target.name === 'pricePerNight'
            ? parseFloat(e.target.value)
            : e.target.name === 'isOccupied'
              ? e.target.value === 'true'
              : e.target.value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (room) {
        await axios.put(`http://localhost:5062/api/Rooms/${room.id}`, room, {
          withCredentials: true,
        });
        setFeedbackMessage('Quarto atualizado com sucesso!');
        setFeedbackType('success');
      }
    } catch {
      setFeedbackMessage('Erro ao atualizar o quarto.');
      setFeedbackType('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg bg-[#FEFEFC]">
      <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">
        Editar Quarto
      </h1>
      {feedbackMessage && feedbackType && (
        <FormFeedback message={feedbackMessage} type={feedbackType} />
      )}
      <div className="mb-4">
        <label className="block font-semibold text-[#084F9A]">
          ID do Quarto:
        </label>
        <input
          type="text"
          value={id}
          onChange={handleIdChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={fetchRoom}
          className="w-full bg-[#4C8D68] text-white p-2 rounded mt-4 hover:bg-[#084F9A]"
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar Quarto'}
        </button>
      </div>
      {room && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Número do Quarto:
              </label>
              <input
                type="text"
                name="roomNumber"
                value={room.roomNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Tipo de Quarto:
              </label>
              <select
                name="type"
                value={room.type}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Solteiro">Solteiro</option>
                <option value="Casal">Casal</option>
                <option value="Suíte">Suíte</option>
                <option value="Duplo">Duplo</option>
                <option value="Familiar">Familiar</option>
                <option value="Luxo">Luxo</option>
                <option value="Triplo">Triplo</option>
                <option value="Quádruplo">Quádruplo</option>
                <option value="Suíte com Café da Manhã Especial">
                  Suíte com Café da Manhã Especial
                </option>
                <option value="Suíte com Café da Manhã Simples">
                  Suíte com Café da Manhã Simples
                </option>
                <option value="Suíte Pernoite">Suíte Pernoite</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Preço por Noite:
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={room.pricePerNight}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#084F9A]">
                Ocupado?
              </label>
              <select
                name="isOccupied"
                value={room.isOccupied ? 'true' : 'false'}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </select>
            </div>
          </div>
          <button className="w-full bg-[#4C8D68] text-white p-3 rounded mt-4 hover:bg-[#084F9A]">
            Atualizar Quarto
          </button>
        </form>
      )}
    </div>
  );
};

export default EditarQuartoForm;
