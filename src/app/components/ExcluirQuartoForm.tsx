import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import FormFeedback from './FormFeedback'; 

const ExcluirQuartoForm = () => {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | undefined>(undefined);

  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();

    if (!id) {
      setFeedbackMessage('Por favor, insira um ID válido.');
      setFeedbackType('error');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5062/api/Rooms/${id}`, {
        withCredentials: true,
      });
      setFeedbackMessage('Quarto excluído com sucesso!');
      setFeedbackType('success');
      setId('');
    } catch {
      setFeedbackMessage('Erro ao excluir quarto. Verifique o ID.');
      setFeedbackType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleDelete}
      className="max-w-4xl mx-auto mt-10 p-5 border-2 border-[#084F9A] rounded-lg shadow-lg"
    >
      <h1 className="text-2xl font-bold text-center mb-5 text-[#084F9A]">
        Excluir Quarto
      </h1>

      {feedbackMessage && feedbackType && (
        <FormFeedback message={feedbackMessage} type={feedbackType} />
      )}

      <div className="mb-4">
        <label className="block font-semibold text-[#084F9A]">ID do Quarto:</label>
        <input
          type="text"
          value={id}
          onChange={handleIdChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Digite o ID do quarto"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-500 text-white p-3 rounded mt-4 hover:bg-red-700"
        disabled={loading}
      >
        {loading ? 'Excluindo...' : 'Excluir Quarto'}
      </button>
    </form>
  );
};

export default ExcluirQuartoForm;
