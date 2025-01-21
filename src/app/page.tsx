'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import nookies from 'nookies';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import Notification from '../app/components/Notification'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = nookies.get();
    const identityCookie = cookies['.AspNetCore.Identity.Application'];

    if (identityCookie) {
      router.push('/painel');
    } else {
      setIsClient(true);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!isClient) return;

    try {
      const response = await fetch('http://localhost:5062/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        nookies.set(null, '.AspNetCore.Identity.Application', data.token, {
          path: '/',
        });
        router.push('/painel');
      } else {
        setError('Login falhou, verifique suas credenciais.');
      }
    } catch {
      setError('Erro no servidor. Tente novamente mais tarde.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isClient) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#084F9A] to-black">
      {error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setError('')}
        />
      )}
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <form onSubmit={handleLogin}>
            <h2 className="text-center text-3xl font-bold text-[#084F9A] mb-8">
              <Image
                src="/img/logo.png"
                alt="Acesso ao Sistema"
                width={120}
                height={120}
                className="mx-auto"
              />
            </h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Usuário
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-200 text-black p-2 pl-10 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#4C8D68]"
                  required
                />
              </div>
            </div>
            <div className="mb-6 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Senha
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-200 text-black p-2 pl-10 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#4C8D68]"
                  required
                />
                <span
                  className="absolute right-2 top-2.5 cursor-pointer text-gray-500 hover:text-black"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="bg-[#4C8D68] hover:bg-[#084F9A] text-white font-bold py-2 px-4 rounded w-full"
              >
                Conectar
              </button>
            </div>
          </form>
        </div>
        <div className="p-8 rounded-lg shadow-lg max-w-md w-full">
          <p className="text-white text-center">
            Nosso horário de atendimento é de Segunda a Sexta-feira das 8h às
            18h e aos sábados das 8h às 12h através de nosso whatsapp
            (92)99192-1009 ou pelo email: atendimento@example.com.
          </p>
        </div>
      </div>
    </div>
  );
}
