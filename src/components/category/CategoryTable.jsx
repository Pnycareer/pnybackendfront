import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/categories`
      );
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/categories/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories(); // Refresh list
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full">
     <div className="mt-6 text-end">
        <Link
          to="/add-categories"
          className="px-4 py-2 mb-5 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Category
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">All Categories</h2>
      <table className="w-full table-auto border border-gray-700 text-left">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Slug</th>
            <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">Position</th>
            <th className="px-4 py-2">View</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, i) => (
            <tr key={cat._id} className="border-t border-gray-600">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{cat.Category_Name}</td>
              <td className="px-4 py-2">{cat.url_Slug}</td>
              <td className="px-4 py-2">
                <i className={cat.Icon}></i>
              </td>
              <td className="px-4 py-2">{cat.position}</td>
              <td className="px-4 py-2">{cat.viewonweb ? "Yes" : "No"}</td>
              <td className="px-4 py-2 space-x-2">
                <Link
                  to={`/edit-category/${cat._id}`}
                  className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
