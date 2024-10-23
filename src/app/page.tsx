'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import nookies from 'nookies'; // Para gerenciar cookies
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    const cookies = nookies.get();
    const identityCookie = cookies['.AspNetCore.Identity.Application'];

    if (identityCookie) {
      // Redireciona automaticamente para o painel se o usuário já estiver autenticado
      router.push('/painel');
    } else {
      setIsClient(true); // Renderiza o formulário de login se o usuário não estiver autenticado
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
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
        credentials: 'include', // Inclui o cookie na requisição
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login bem-sucedido!', data);

        // Armazena o cookie de autenticação usando nookies
        nookies.set(null, '.AspNetCore.Identity.Application', data.token, {
          path: '/', // Garante que o cookie esteja disponível em todas as páginas
        });

        router.push('/painel'); // Redireciona para o painel após o login
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
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <form onSubmit={handleLogin}>
          <h2 className="text-center text-3xl font-bold text-[#084F9A] mb-8">
            Acesso ao Sistema
          </h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
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
    </div>
  );
}
