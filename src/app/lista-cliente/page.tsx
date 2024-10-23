'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email?: string;
  profissao?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  sexo?: string;
  rg?: string;
  residencia?: string;
  cep?: string;
  cidade?: string;
  pais?: string;
  telefoneResidencial?: string;
  telefoneComercial?: string;
}

const ListaClientes = () => {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchNome, setSearchNome] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchClientes = async () => {
        try {
          const response = await axios.get(
            'http://localhost:5062/api/Clientes',
            {
              withCredentials: true,
            }
          );
          setClientes(response.data);
          setFilteredClientes(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao buscar clientes.', error);
          setLoading(false);
        }
      };

      fetchClientes();
    }
  }, [isAuthenticated]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value.toLowerCase();
    setSearchNome(nome);
    const clientesFiltrados = clientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(nome)
    );
    setFilteredClientes(clientesFiltrados);
  };

  const gerarPDFPorCliente = (cliente: Cliente) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = new jsPDF();

    doc.text(`Dados do Cliente: ${cliente.nome}`, 20, 10);
    doc.autoTable({
      head: [['Campo', 'Informação']],
      body: [
        ['Nome', cliente.nome],
        ['CPF', cliente.cpf],
        ['Email', cliente.email || '-'],
        ['Profissão', cliente.profissao || '-'],
        ['Nacionalidade', cliente.nacionalidade || '-'],
        ['Data de Nascimento', cliente.dataNascimento || '-'],
        ['Sexo', cliente.sexo || '-'],
        ['RG', cliente.rg || '-'],
        ['Residência', cliente.residencia || '-'],
        ['CEP', cliente.cep || '-'],
        ['Cidade', cliente.cidade || '-'],
        ['País', cliente.pais || '-'],
        ['Telefone Residencial', cliente.telefoneResidencial || '-'],
        ['Telefone Comercial', cliente.telefoneComercial || '-'],
      ],
    });
    doc.save(`cliente_${cliente.nome}.pdf`);
  };

  if (isAuthLoading || loading) {
    return <p className="text-center text-[#084F9A]">Carregando...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FEFEFC]">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">
          Lista de Clientes Cadastrados
        </h1>
        <div className="mb-5">
          <input
            type="text"
            value={searchNome}
            onChange={handleSearchChange}
            className="w-full p-2 border border-[#084F9A] rounded"
            placeholder="Pesquisar por nome"
          />
        </div>

        <div className="overflow-x-auto touch-pan-x">
          {' '}
       
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#084F9A] text-white">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">CPF</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Profissão</th>
                <th className="px-4 py-2">Nacionalidade</th>
                <th className="px-4 py-2">Data de Nascimento</th>
                <th className="px-4 py-2">Sexo</th>
                <th className="px-4 py-2">RG</th>
                <th className="px-4 py-2">Residência</th>
                <th className="px-4 py-2">CEP</th>
                <th className="px-4 py-2">Cidade</th>
                <th className="px-4 py-2">País</th>
                <th className="px-4 py-2">Telefone Residencial</th>
                <th className="px-4 py-2">Telefone Comercial</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.length > 0 ? (
                filteredClientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="bg-[#FEFEFC] border border-[#084F9A]"
                  >
                    <td className="px-4 py-2">{cliente.id}</td>
                    <td className="px-4 py-2">{cliente.nome}</td>
                    <td className="px-4 py-2">{cliente.cpf}</td>
                    <td className="px-4 py-2">{cliente.email || '-'}</td>
                    <td className="px-4 py-2">{cliente.profissao || '-'}</td>
                    <td className="px-4 py-2">
                      {cliente.nacionalidade || '-'}
                    </td>
                    <td className="px-4 py-2">
                      {cliente.dataNascimento || '-'}
                    </td>
                    <td className="px-4 py-2">{cliente.sexo || '-'}</td>
                    <td className="px-4 py-2">{cliente.rg || '-'}</td>
                    <td className="px-4 py-2">{cliente.residencia || '-'}</td>
                    <td className="px-4 py-2">{cliente.cep || '-'}</td>
                    <td className="px-4 py-2">{cliente.cidade || '-'}</td>
                    <td className="px-4 py-2">{cliente.pais || '-'}</td>
                    <td className="px-4 py-2">
                      {cliente.telefoneResidencial || '-'}
                    </td>
                    <td className="px-4 py-2">
                      {cliente.telefoneComercial || '-'}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => gerarPDFPorCliente(cliente)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Gerar PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={16} className="text-center p-4 text-[#084F9A]">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListaClientes;
