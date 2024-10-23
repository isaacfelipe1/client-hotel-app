import { useEffect, useState } from 'react';
import axios from 'axios';
import FormFeedback from './FormFeedback'; 
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  pricePerNight: number;
  isOccupied: boolean;
}

const ListarQuartos = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | undefined>(undefined);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null); 
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5062/api/Rooms', {
          withCredentials: true,
        });
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar quartos.', error);
        setFeedbackMessage('Erro ao carregar a lista de quartos.');
        setFeedbackType('error');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5062/api/Rooms/${id}`, {
        withCredentials: true,
      });
      setFeedbackMessage('Quarto excluído com sucesso!');
      setFeedbackType('success');
      setRooms(rooms.filter((room) => room.id !== id));
    } catch (error) {
      setFeedbackMessage('Erro ao excluir o quarto.');
      setFeedbackType('error');
      console.error('Erro ao excluir o quarto:', error);
    } finally {
      setShowModal(false); 
    }
  };

  const confirmDeleteRoom = (room: Room) => {
    setRoomToDelete(room); 
    setShowModal(true); 
  };

  const cancelDelete = () => {
    setRoomToDelete(null); 
    setShowModal(false); 
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 border-2 border-gray-300 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-5">Lista de Quartos</h1>

      {feedbackMessage && feedbackType && (
        <FormFeedback message={feedbackMessage} type={feedbackType} />
      )}

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Número do Quarto</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Preço por Noite</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.id} className="bg-gray-100">
                <td className="border px-4 py-2">{room.id}</td>
                <td className="border px-4 py-2">{room.roomNumber}</td>
                <td className="border px-4 py-2">{room.type}</td>
                <td className="border px-4 py-2">R$ {room.pricePerNight.toFixed(2)}</td>
                <td className="border px-4 py-2">{room.isOccupied ? 'Ocupado' : 'Disponível'}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => confirmDeleteRoom(room)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">
                Nenhum quarto cadastrado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && roomToDelete && (
        <ConfirmDeleteModal
          message={`Tem certeza que deseja excluir o quarto ${roomToDelete.roomNumber}?`}
          onConfirm={() => handleDelete(roomToDelete.id)}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ListarQuartos;
