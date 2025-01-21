'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
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
  FaSignOutAlt,
  FaHome,
} from 'react-icons/fa';

export default function Painel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5062/api/Auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('username');
        router.push('/');
      } else {
        console.error('Erro ao fazer logout no backend');
      }
    } catch (error) {
      console.error('Erro ao tentar se desconectar:', error);
    }
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#084F9A] to-black text-white">
      <div className="absolute top-4 left-4 z-20 lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl p-2 bg-[#084F9A] rounded hover:bg-[#4C8D68] transition"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <aside
        className={`bg-[#084F9A] w-64 fixed top-0 left-0 h-full flex flex-col p-4 justify-between z-10 transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform lg:relative lg:translate-x-0`}
      >
        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <FaHome className="mr-2" /> Painel
          </h2>

          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-lg font-semibold focus:outline-none"
              onClick={() => toggleSection('clientes')}
            >
              <span className="flex items-center">
                <FaUserPlus className="mr-2" /> Clientes
              </span>
              {openSection === 'clientes' ? <FaChevronDown /> : <FaChevronRight />}
            </button>
            {openSection === 'clientes' && (
              <div className="flex flex-col space-y-2 mt-2">
                <button
                  className="flex items-center bg-[#4C8D68] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                  onClick={() => router.push('/cadastro')}
                >
                  <FaUserPlus className="mr-2" /> Cadastrar Cliente
                </button>
                <button
                  className="flex items-center bg-[#084F9A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  onClick={() => router.push('/lista-cliente')}
                >
                  <FaListAlt className="mr-2" /> Listar Clientes
                </button>
                <button
                  className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all"
                  onClick={() => router.push('/editar-cliente')}
                >
                  <FaEdit className="mr-2" /> Editar Cliente
                </button>
                <button
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                  onClick={() => router.push('/excluir-cliente')}
                >
                  <FaTrashAlt className="mr-2" /> Excluir Cliente
                </button>
              </div>
            )}
          </div>
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-lg font-semibold focus:outline-none"
              onClick={() => toggleSection('quartos')}
            >
              <span className="flex items-center">
                <FaBed className="mr-2" /> Quartos
              </span>
              {openSection === 'quartos' ? <FaChevronDown /> : <FaChevronRight />}
            </button>
            {openSection === 'quartos' && (
              <div className="flex flex-col space-y-2 mt-2">
                <button
                  className="flex items-center bg-[#4C8D68] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                  onClick={() => router.push('/cadastrar-quarto')}
                >
                  <FaBed className="mr-2" /> Cadastrar Quarto
                </button>
                <button
                  className="flex items-center bg-[#084F9A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  onClick={() => router.push('/listar-quartos')}
                >
                  <FaClipboardList className="mr-2" /> Listar Quartos
                </button>
                <button
                  className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all"
                  onClick={() => router.push('/editar-quarto')}
                >
                  <FaPencilAlt className="mr-2" /> Editar Quarto
                </button>
                <button
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                  onClick={() => router.push('/excluir-quarto')}
                >
                  <FaTrash className="mr-2" /> Excluir Quarto
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              className="flex items-center justify-between w-full text-lg font-semibold focus:outline-none"
              onClick={() => toggleSection('reservas')}
            >
              <span className="flex items-center">
                <FaCalendarPlus className="mr-2" /> Reservas
              </span>
              {openSection === 'reservas' ? <FaChevronDown /> : <FaChevronRight />}
            </button>
            {openSection === 'reservas' && (
              <div className="flex flex-col space-y-2 mt-2">
                <button
                  className="flex items-center bg-[#4C8D68] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                  onClick={() => router.push('/cadastrar-reserva')}
                >
                  <FaCalendarPlus className="mr-2" /> Cadastrar Reserva
                </button>
                <button
                  className="flex items-center bg-[#084F9A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  onClick={() => router.push('/listar-reservas')}
                >
                  <FaList className="mr-2" /> Listar Reservas
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm bg-[#4C8D68] px-4 py-2 rounded hover:bg-[#084F9A] transition flex items-center mt-6"
        >
          <FaSignOutAlt className="mr-2" /> Sair
        </button>
      </aside>

      <main className="flex-1 p-8 bg-white rounded-lg shadow-md mt-16 lg:mt-0">
        <h1 className="text-2xl font-bold text-black mb-4">Bem-vindo ao Painel</h1>
        <p className="text-gray-700">
          Selecione uma das opções no menu lateral para gerenciar os recursos do sistema.
        </p>
      </main>
    </div>
  );
}
