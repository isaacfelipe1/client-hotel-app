'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AtualizarReservaForm from '../../components/AtualizarReservaForm';
import Navbar from '../../components/Navbar';

interface EditarReservaPageProps {
  params: {
    id: string;
  };
}

export default function EditarReservaPage({ params }: EditarReservaPageProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const reservaId = parseInt(params.id);

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

  if (isNaN(reservaId)) {
    return <p>Erro: ID da reserva inválido.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#084F9A] to-black">
      <Navbar />

      <div className="container mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg bg-white">
        <AtualizarReservaForm reservaId={reservaId} />
      </div>
    </div>
  );
}
