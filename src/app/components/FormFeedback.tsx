interface FormFeedbackProps {
  message: string;
  type: 'success' | 'error';
}

const FormFeedback = ({ message, type }: FormFeedbackProps) => {
  const bgColor = type === 'success' ? 'bg-[#4C8D68]' : 'bg-red-500';

  return (
    <div className={`text-white p-4 mb-4 rounded ${bgColor}`}>{message}</div>
  );
};

export default FormFeedback;
