import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditModel = () => {
  const { id } = useParams(); // This is your featureId
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/coursemodel/${id}`);
        setModuleData(res.data);
        setLectures(res.data.lectures);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching module:', err);
      }
    };

    fetchModule();
  }, [id]);

  const handleLectureChange = (index, field, value) => {
    const updatedLectures = [...lectures];
    updatedLectures[index][field] = value;
    setLectures(updatedLectures);
  };

  const handleDeleteLecture = async (lectureId) => {
    const confirm = window.confirm('Are you sure you want to delete this lecture?');
    if (!confirm) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/coursemodel/${id}/${lectureId}`);
      setLectures(res.data.courseFeature.lectures); // Update with new lectures list
      setMessage('✅ Lecture deleted successfully!');
    } catch (err) {
      console.error('Error deleting lecture:', err.response?.data || err.message);
      setMessage('❌ Failed to delete lecture');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/coursemodel/${id}`, {
        courseId: moduleData.courseId._id || moduleData.courseId,
        lectures,
      });
      setMessage('✅ Module updated successfully!');
      setTimeout(() => navigate('/coursemodel'), 1500);
    } catch (err) {
      console.error('Error updating module:', err.response?.data || err.message);
      setMessage('❌ Failed to update module');
    }
  };

  if (loading) return <div className="text-center text-white py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 mx-auto overflow-y-auto w-full">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Module for: {moduleData.courseName}</h2>

        {message && (
          <div className="mb-4 text-center text-sm font-medium text-green-600">{message}</div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          {lectures.map((lecture, index) => (
            <div key={lecture._id} className="border border-gray-300 p-4 rounded-md bg-gray-50 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-600">Lecture #{index + 1}</p>
                <button
                  type="button"
                  onClick={() => handleDeleteLecture(lecture._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="text-black px-3 py-2 border rounded-md"
                  placeholder="Title"
                  value={lecture.title}
                  onChange={(e) => handleLectureChange(index, 'title', e.target.value)}
                />
                <input
                  type="text"
                  className="text-black px-3 py-2 border rounded-md"
                  placeholder="Content"
                  value={lecture.content}
                  onChange={(e) => handleLectureChange(index, 'content', e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 mb-1">Topics</label>
                <ReactQuill
                  theme="snow"
                  value={lecture.topics}
                  onChange={(value) => handleLectureChange(index, 'topics', value)}
                  className="bg-white text-black"
                />
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Update Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModel;
