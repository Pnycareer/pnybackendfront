import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../common/Header";
import { toast } from "react-toastify";

const EditGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize state for gallery fields
  const [galleryTitle, setGalleryTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isViewable, setIsViewable] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/gallery/${id}`)
      .then((response) => {
        const gallery = response.data;
        setGalleryTitle(gallery.galleryTitle);
        setCoverImage(gallery.coverImage);
        setIsViewable(gallery.isViewable);
        setNote(gallery.note);
      })
      .catch((error) => console.error("Error fetching gallery data:", error));
  }, [id]);

  const handleCancel = () => {
    navigate("/gallery");
  };
  const handleUpdate = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/gallery/${id}`, {
        galleryTitle,
        coverImage,
        isViewable,
        note,
      });
      navigate("/gallery"); // Redirect after update
      toast.success("update gallery successfully");
    } catch (error) {
      console.error("Error updating gallery:", error);
    }
  };

  return (
    <div className="overflow-auto w-full">
      <Header />
      <div className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg my-6 rounded-xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-gray-100 mb-5">
          Edit Gallery
        </h2>
        {/* Gallery Title Field */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Gallery Title</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
            value={galleryTitle}
            onChange={(e) => setGalleryTitle(e.target.value)}
          />
        </div>

        {/* Cover Image Field */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Cover Image URL</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>

        {/* Is Viewable Checkbox */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Is Viewable</label>
          <input
            type="checkbox"
            className="mr-2"
            checked={isViewable}
            onChange={(e) => setIsViewable(e.target.checked)}
          />
          <span className="text-gray-300">Yes</span>
        </div>

        {/* Note Field */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Note</label>
          <textarea
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGallery;
