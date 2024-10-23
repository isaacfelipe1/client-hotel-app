import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import FormFeedback from './FormFeedback';
import Navbar from './Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaTrashAlt, FaFilePdf } from 'react-icons/fa';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  pricePerNight: number;
  isOccupied: boolean;
}

interface Cliente {
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
  motivoViagem?: string;
  meioTransporte?: string;
  proximoDestino?: string;
}

interface Reserva {
  id: number;
  clienteId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  numeroDeAdultos: number;
  numeroDeCriancas0A5Anos: number;
  numeroDeCriancas: number;
  incluirCafeDaManha: boolean;
  totalPrice: number;
  cliente: Cliente;
  room: Room;
}

const ListarReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);

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

  const handleDelete = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReserva) return;

    try {
      await axios.delete(`http://localhost:5062/api/Reservations/${selectedReserva.id}`, {
        withCredentials: true,
      });

      setReservas(reservas.filter((reserva) => reserva.id !== selectedReserva.id));
      setSuccessMessage('Reserva excluída com sucesso!');
      setIsModalOpen(false);
      setSelectedReserva(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(
          'Erro ao excluir a reserva: ' +
            (error.response?.data?.message || 'Erro desconhecido')
        );
      } else {
        setErrorMessage('Erro desconhecido: ' + (error as Error).message);
      }
      setIsModalOpen(false);
    }
  };

  const gerarPDFPorCliente = (reserva: Reserva) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = new jsPDF();
    doc.setFontSize(14); 
    doc.setFont('helvetica', 'bold');
    doc.text(`Obrigada, ${reserva.cliente.nome}!`, 20, 20);

    doc.setFontSize(10); 
    doc.setFont('helvetica', 'normal');
    doc.text('Sua reserva está confirmada.', 20, 28);

    doc.line(20, 33, 190, 33); 

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes do Hóspede:', 20, 40);

    doc.autoTable({
      startY: 45,
      head: [['Campo', 'Detalhe']],
      body: [
        ['Nome', reserva.cliente.nome],
        ['CPF', reserva.cliente.cpf],
        ['E-mail', reserva.cliente.email || 'N/A'],
        ['Profissão', reserva.cliente.profissao || 'N/A'],
        ['Nacionalidade', reserva.cliente.nacionalidade || 'N/A'],
        ['RG', reserva.cliente.rg || 'N/A'],
        ['Residência', reserva.cliente.residencia || 'N/A'],
        ['CEP', reserva.cliente.cep || 'N/A'],
        ['Cidade', reserva.cliente.cidade || 'N/A'],
        ['País', reserva.cliente.pais || 'N/A'],
        ['Telefone Residencial', reserva.cliente.telefoneResidencial || 'N/A'],
        ['Telefone Comercial', reserva.cliente.telefoneComercial || 'N/A'],
        ['Sexo', reserva.cliente.sexo || 'N/A'],
        ['Data de Nascimento', reserva.cliente.dataNascimento || 'N/A'],
      ],
      theme: 'striped', 
      headStyles: { fillColor: [22, 160, 133] }, 
      styles: { fontSize: 8, cellPadding: 3 }, 
      alternateRowStyles: { fillColor: [240, 240, 240] }, 
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 90 }, 
      },
    });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes da Reserva:', 20, doc.lastAutoTable.finalY + 10);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Número da Reserva', 'Quarto', 'Preço Total', 'Check-in', 'Check-out']],
      body: [
        [
          reserva.id.toString(),
          `Quarto ${reserva.room.roomNumber} - ${reserva.room.type}`,
          `R$ ${reserva.totalPrice.toFixed(2)}`,
          `${new Date(reserva.checkInDate).toLocaleDateString('pt-BR')} às 12:00`,
          `${new Date(reserva.checkOutDate).toLocaleDateString('pt-BR')} às 12:00`,
        ],
      ],
      theme: 'grid',
      styles: {
        fontSize: 8, 
        halign: 'left',
        cellPadding: 2, 
      },
    });
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 5,
      head: [['Adultos', 'Crianças (0-5 anos)', 'Crianças (6+ anos)', 'Status', 'Café da Manhã']],
      body: [
        [
          reserva.numeroDeAdultos.toString(),
          reserva.numeroDeCriancas0A5Anos.toString(),
          reserva.numeroDeCriancas.toString(),
          reserva.status,
          reserva.incluirCafeDaManha ? 'Incluído' : 'Não Incluído',
        ],
      ],
      theme: 'grid',
      styles: {
        fontSize: 8, 
        halign: 'left',
        cellPadding: 2, 
      },
    });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Check-in e Check-out às 12:00 horas.', 20, doc.lastAutoTable.finalY + 10);

    doc.setFontSize(9); 
    doc.setFont('helvetica', 'normal');
    doc.text('Obrigado por reservar conosco!', 20, doc.lastAutoTable.finalY + 20);
    doc.text('Assinatura do Cliente:', 20, doc.lastAutoTable.finalY + 30);
    doc.line(60, doc.lastAutoTable.finalY + 30, 150, doc.lastAutoTable.finalY + 30);

  
    doc.save(`reserva_${reserva.cliente.nome}.pdf`);
  };

  const gerarPDF = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = new jsPDF();
    doc.text('Lista de Reservas', 20, 10);

    doc.autoTable({
      head: [
        [
          'Cliente',
          'CPF',
          'Quarto',
          'Preço Total',
          'Check-in',
          'Check-out',
          'Status',
          'Ocupação',
          'Adultos',
          'Crianças (0 a 5 anos)',
          'Crianças (A partir de 6 anos)',
          'Café da Manhã',
        ],
      ],
      body: reservas.map((reserva) => [
        reserva.cliente.nome,
        reserva.cliente.cpf,
        `Quarto ${reserva.room.roomNumber} - ${reserva.room.type}`,
        `R$ ${reserva.totalPrice.toFixed(2)}`,
        `${new Date(reserva.checkInDate).toLocaleDateString('pt-BR')} às 12:00`,
        `${new Date(reserva.checkOutDate).toLocaleDateString('pt-BR')} às 12:00`,
        reserva.status,
        reserva.room.isOccupied ? 'Ocupado' : 'Disponível',
        reserva.numeroDeAdultos,
        reserva.numeroDeCriancas0A5Anos,
        reserva.numeroDeCriancas,
        reserva.incluirCafeDaManha ? 'Incluído' : 'Não Incluído',
      ]),
    });

    doc.save('reservas.pdf');
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#084F9A] to-black">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">
          Lista de Reservas
        </h1>

        {errorMessage && <FormFeedback message={errorMessage} type="error" />}
        {successMessage && (
          <FormFeedback message={successMessage} type="success" />
        )}

        {reservas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Cliente</th>
                  <th className="py-2 px-4 border-b">CPF</th>
                  <th className="py-2 px-4 border-b">Quarto</th>
                  <th className="py-2 px-4 border-b">Preço Total</th>
                  <th className="py-2 px-4 border-b">Check-in</th>
                  <th className="py-2 px-4 border-b">Check-out</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Ocupação</th>
                  <th className="py-2 px-4 border-b">Adultos</th>
                  <th className="py-2 px-4 border-b">Crianças (0 a 5 anos)</th>
                  <th className="py-2 px-4 border-b">
                    Crianças (A partir de 6 anos)
                  </th>
                  <th className="py-2 px-4 border-b">Café da Manhã</th>
                  <th className="py-2 px-4 border-b">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td className="py-2 px-4 border-b">
                      {reserva.cliente.nome}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {reserva.cliente.cpf}
                    </td>
                    <td className="py-2 px-4 border-b">
                      Quarto {reserva.room.roomNumber} - {reserva.room.type}
                    </td>
                    <td className="py-2 px-4 border-b">
                      R$ {reserva.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(reserva.checkInDate).toLocaleDateString('pt-BR')} às 12:00
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(reserva.checkOutDate).toLocaleDateString('pt-BR')} às 12:00
                    </td>
                    <td className="py-2 px-4 border-b">{reserva.status}</td>
                    <td className="py-2 px-4 border-b">
                      {reserva.room.isOccupied ? 'Ocupado' : 'Disponível'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {reserva.numeroDeAdultos}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {reserva.numeroDeCriancas0A5Anos}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {reserva.numeroDeCriancas}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {reserva.incluirCafeDaManha ? 'Incluído' : 'Não Incluído'}
                    </td>
                    <td className="py-2 px-4 border-b flex space-x-2 justify-center">
                      <button
                        onClick={() => gerarPDFPorCliente(reserva)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaFilePdf size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(reserva)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhuma reserva encontrada.</p>
        )}

        <div className="text-center mt-5">
          <button
            onClick={gerarPDF}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Gerar PDF de Todas as Reservas
          </button>
        </div>
      </div>

      {isModalOpen && selectedReserva && (
        <ConfirmDeleteModal
          message={`Tem certeza que deseja excluir a reserva de ${selectedReserva.cliente.nome}?`}
          onConfirm={confirmDelete}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ListarReservas;
