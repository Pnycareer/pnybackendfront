import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const FaqList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchFaqs = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/faqs`);
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/faqs/${id}`, {
      method: "DELETE",
    });
    setData(data.filter((item) => item._id !== id));
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-900 text-white p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6">FAQ Categories</h2>
        <div className="flex justify-end">
            <Link className="bg-blue-500 px-4 py-2 hover:bg-blue-700" to='/addfaqs'>Add Faqs</Link>
        </div>
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead className="bg-gray-800 text-sm uppercase">
            <tr>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">FAQs Count</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((faq) => (
              <tr
                key={faq._id}
                className="bg-gray-800 hover:bg-gray-700 transition-all rounded"
              >
                <td className="px-4 py-3">{faq.category.name}</td>
                <td className="px-4 py-3">
                  {faq.category.category_image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${
                        faq.category.category_image
                      }`}
                      alt="category"
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-600 rounded" />
                  )}
                </td>
                <td className="px-4 py-3">{faq.faqs.length}</td>
                <td className="px-4 py-3">
                  <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
                    Active
                  </span>
                </td>
                <td className="px-4 py-3 space-x-4">
                  <button
                    onClick={() => navigate(`/editfaq/${faq._id}`)}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No FAQs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FaqList;
