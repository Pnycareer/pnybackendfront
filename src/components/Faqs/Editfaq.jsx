import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditFaq = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/faqs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryName(data.category.name);
        setPreviewImage(`${import.meta.env.VITE_API_URL}/${data.category.category_image}`);
        setFaqs(data.faqs);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '', status: '1' }]);
  };

  const removeFaq = (index) => {
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFaqs(updatedFaqs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', JSON.stringify({ name: categoryName }));
    formData.append('faqs', JSON.stringify(faqs));
    if (categoryImage) {
      formData.append('faqImage', categoryImage);
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/faqs/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      alert('FAQ updated!');
      navigate('/faqs');
    } else {
      alert('Failed to update FAQ');
    }
  };

  return (
    <div className="min-h-screen w-full mx-auto overflow-y-auto bg-gray-100 py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit FAQ Category</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Category Name */}
          <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-700">Category Name:</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-700">Category Image:</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Current"
                className="mb-2 h-24 rounded shadow"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCategoryImage(e.target.files[0])}
              className="block w-full text-black"
            />
          </div>

          {/* FAQs */}
          <h3 className="text-lg font-semibold text-gray-700 mb-2">FAQs</h3>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border border-gray-300 rounded-md p-4 bg-gray-50">
              <input
                type="text"
                placeholder="Question"
                value={faq.question}
                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                required
                className="w-full mb-2 px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md text-black resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="mt-2 text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addFaq}
            className="mb-6 text-blue-600 hover:underline font-medium text-sm"
          >
            + Add FAQ
          </button>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFaq;
