import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../common/Header";
import { toast } from "react-toastify";

const EditBlogcat = () => {
  const { id } = useParams(); // Get the category ID from the URL parameters
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [category, setCategory] = useState({
    categoryName: "",
    status: "Active", // Default status
    metaDescription: "",
    metaTitle: " ",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch category details
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setError("Category ID is missing");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/blogcate/${id}`
        );
        console.log("Fetched category:", response.data); // Log fetched category data
        setCategory(response.data);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to fetch category details.");
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };

    fetchCategory();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleCancel = () => {
    navigate("/blog-categories");
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/blogcate/${id}`,
        category
      );
      navigate("/blog-categories"); // Redirect to blog categories after successful edit
      toast.success("Blog category updated successfully!"); // Show success toast message
    } catch (err) {
      toast.error("Error updating category:", err);
      setError("Failed to update category.");
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>; // Loading state
  }

  return (
    <div className="w-full h-full overflow-auto">
      <Header />
      <div className=" w-full mx-auto bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md overflow-auto mt-10">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          Edit Blog Category
        </h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1" htmlFor="categoryName">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              value={category.categoryName}
              onChange={handleChange}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1" htmlFor="categoryName">
              Meta metaDescription
            </label>
            <input
              type="text"
              id="categoryName"
              name="metaDescription"
              value={category.metaDescription}
              onChange={handleChange}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1" htmlFor="categoryName">
              Meta Title
            </label>
            <input
              type="text"
              id="categoryName"
              name="metaTitle"
              value={category.metaTitle}
              onChange={handleChange}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1" htmlFor="categoryName">
              Meta shortDescription
            </label>
            <input
              type="text"
              id="categoryName"
              name="shortDescription"
              value={category.shortDescription}
              onChange={handleChange}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg p-2 w-full"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              Update Category
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogcat;
