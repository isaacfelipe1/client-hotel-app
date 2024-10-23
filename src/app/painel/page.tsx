'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaUserPlus,
  FaListAlt,
  FaEdit,
  FaTrashAlt,
  FaBed,
  FaClipboardList,
  FaPencilAlt,
  FaTrash,
  FaCalendarPlus,
  FaList,
} from 'react-icons/fa';
import Navbar from '../components/Navbar';

export default function Painel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5062/api/Auth/check-auth', {
          credentials: 'include',
        });
        const data = await res.json();

        if (!data.isAuthenticated) {
          router.push('/');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao verificar a autenticação:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-r from-[#084F9A] to-black p-0">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 w-full max-w-4xl p-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Gerenciamento de Clientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center bg-[#084F9A] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/cadastro')}
            >
              <FaUserPlus className="mr-2" /> Cadastrar Cliente
            </button>

            <button
              className="flex items-center justify-center bg-[#4C8D68] text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/lista-cliente')}
            >
              <FaListAlt className="mr-2" /> Listar Clientes
            </button>

            <button
              className="flex items-center justify-center bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/editar-cliente')}
            >
              <FaEdit className="mr-2" /> Editar Cliente
            </button>

            <button
              className="flex items-center justify-center bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/excluir-cliente')}
            >
              <FaTrashAlt className="mr-2" /> Excluir Cliente
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Gerenciamento de Quartos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center bg-[#084F9A] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/cadastrar-quarto')}
            >
              <FaBed className="mr-2" /> Cadastrar Quarto
            </button>

            <button
              className="flex items-center justify-center bg-[#4C8D68] text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/listar-quartos')}
            >
              <FaClipboardList className="mr-2" /> Listar Quartos
            </button>

            <button
              className="flex items-center justify-center bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/editar-quarto')}
            >
              <FaPencilAlt className="mr-2" /> Editar Quarto
            </button>

            <button
              className="flex items-center justify-center bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/excluir-quarto')}
            >
              <FaTrash className="mr-2" /> Excluir Quarto
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Gerenciamento de Reservas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center bg-[#084F9A] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/cadastrar-reserva')}
            >
              <FaCalendarPlus className="mr-2" /> Cadastrar Reserva
            </button>

            <button
              className="flex items-center justify-center bg-[#4C8D68] text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/listar-reservas')}
            >
              <FaList className="mr-2" /> Listar Reservas
            </button>

            <button
              className="flex items-center justify-center  bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-700  transition-all transform hover:scale-105 shadow-md"
              onClick={() => router.push('/excluir-reserva')}
            >
              <FaTrash className="mr-2" /> Editar Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
