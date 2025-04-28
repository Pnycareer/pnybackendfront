import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditNews() {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', date: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/news/${id}`)
      .then(res => res.json())
      .then(data => setFormData(data));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md backdrop-blur-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Edit News</h2>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="block w-full mb-4 p-3 border rounded text-black"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="block w-full mb-4 p-3 border rounded text-black"
          required
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="block w-full mb-4 p-3 border rounded text-black"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600">
          Update
        </button>
      </form>
    </div>
  );
}
