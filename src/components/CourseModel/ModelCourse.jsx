import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CourseModulesTable = () => {
  const [modules, setModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/coursemodel`);
        setModules(res.data);
      } catch (err) {
        console.error('Failed to fetch modules:', err);
      }
    };

    fetchModules();
  }, []);

  const filteredModules = modules.filter((module) =>
    module.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">All Course Modules</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by course name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md text-black"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-auto bg-[#0f172a] text-white">
          <thead className="bg-[#0f172a] border-b border-gray-700 text-sm text-left">
            <tr>
              <th className="px-4 py-3">COURSE</th>
              <th className="px-4 py-3">LECTURES</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-300">
                  No matching modules found.
                </td>
              </tr>
            ) : (
              filteredModules.map((module, index) => (
                <motion.tr
                  key={module._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="border-b border-gray-700 hover:bg-gray-800 transition-all"
                >
                  <td className="px-4 py-3">{module.courseName}</td>
                  <td className="px-4 py-3">{module.lectures.length}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <Link to={`/editmodel/${module._id}`} className="text-blue-400 hover:underline text-sm">Edit</Link>
                    <button className="text-red-400 hover:underline text-sm">Delete</button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseModulesTable;
