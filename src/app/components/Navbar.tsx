'use client';

import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const router = useRouter();

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

  return (
    <nav className="w-full flex justify-between items-center bg-[#084F9A] text-white p-4 mb-8 shadow-md">
      <h1
        className="text-2xl font-bold cursor-pointer hover:text-[#4C8D68] transition"
        onClick={() => router.push('/painel')}
      >
        Painel de Gerenciamento
      </h1>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="text-sm bg-[#4C8D68] px-4 py-2 rounded hover:bg-[#084F9A] transition flex items-center"
        >
          <FaSignOutAlt className="mr-2" /> Sair
        </button>
      </div>
    </nav>
  );
}
