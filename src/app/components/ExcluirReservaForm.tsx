'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import FormFeedback from './FormFeedback';

interface Reserva {
  id: number;
  cliente: {
    nome: string;
  };
  room: {
    roomNumber: string;
    roomId: number;
  };
}

const EditarReservaForm = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await axios.get<Reserva[]>(
          'http://localhost:5062/api/Reservations',
          {
            withCredentials: true,
          }
        );
        setReservas(response.data);
        setLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          setErrorMessage(
            'Erro ao carregar as reservas: ' +
              (error.response?.data?.message || 'Erro desconhecido')
          );
        } else {
          setErrorMessage('Erro desconhecido: ' + (error as Error).message);
        }
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/editar-reserva/${id}`);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">
        Editar Reserva
      </h1>

      {errorMessage && <FormFeedback message={errorMessage} type="error" />}

      {reservas.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Cliente</th>
              <th className="py-2 px-4 border-b">Quarto</th>
              <th className="py-2 px-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td className="py-2 px-4 border-b">{reserva.cliente.nome}</td>
                <td className="py-2 px-4 border-b">
                  {reserva.room.roomNumber}
                </td>
                <td className="py-2 px-4 border-b flex space-x-2">
                  <button
                    onClick={() => handleEdit(reserva.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma reserva encontrada.</p>
      )}
    </div>
  );
};

export default EditarReservaForm;
