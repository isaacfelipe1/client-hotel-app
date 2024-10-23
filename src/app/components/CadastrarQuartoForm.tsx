import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Room {
  roomNumber: string;
  type: string;
  pricePerNight: number;
  isOccupied: boolean;
}

const CadastrarQuartoForm = () => {
  const [room, setRoom] = useState<Room>({
    roomNumber: '',
    type: 'Solteiro',
    pricePerNight: 0,
    isOccupied: false,
  });

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | undefined>(undefined);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRoom((prevRoom) => ({
      ...prevRoom,
      [name]:
        name === 'pricePerNight'
          ? parseFloat(value)
          : name === 'isOccupied'
            ? value === 'true'
            : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5062/api/Rooms',
        room,
        {
          withCredentials: true,
        }
      );
      console.log('Quarto cadastrado com sucesso:', response.data);
      setFeedbackMessage('Quarto cadastrado com sucesso!');
      setFeedbackType('success');
      setRoom({
        roomNumber: '',
        type: 'Solteiro',
        pricePerNight: 0,
        isOccupied: false,
      });
    } catch (error) {
      console.error('Erro ao cadastrar o quarto:', error);
      setFeedbackMessage(
        'Erro ao cadastrar o quarto. Por favor, tente novamente.'
      );
      setFeedbackType('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg"
    >
      <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">
        Cadastro de Quarto
      </h1>

      {feedbackMessage && feedbackType && (
        <div
          className={`text-center p-2 mb-4 text-${feedbackType === 'success' ? 'green-500' : 'red-500'}`}
        >
          {feedbackMessage}
        </div>
      )}

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
            className="w-full p-2 border border-[#084F9A] rounded"
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
            className="w-full p-2 border border-[#084F9A] rounded"
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
            className="w-full p-2 border border-[#084F9A] rounded"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#084F9A]">Ocupado?</label>
          <select
            name="isOccupied"
            value={room.isOccupied ? 'true' : 'false'}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#084F9A] rounded"
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>
      </div>
      <button className="w-full bg-[#084F9A] text-white p-3 rounded mt-4 hover:bg-blue-700">
        Cadastrar Quarto
      </button>
    </form>
  );
};

export default CadastrarQuartoForm;
