import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/news`)
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/news/${id}`, {
      method: "DELETE",
    });
    setNews(news.filter((item) => item._id !== id));
  };

  return (
    <div className="min-h-screen w-full p-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        All News
      </h1>
      <div className="mt-6 text-end">
        <Link
          to="/addnews"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add News
        </Link>
      </div>
      <div className="overflow-x-auto bg-[#111827] p-6 rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-[#1f2937] text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Course
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr
                key={item._id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="px-6 py-4 font-medium text-white">
                  {item.title}
                </td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">{item.date}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-4">
                  <Link
                    to={`/editnews/${item._id}`}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
