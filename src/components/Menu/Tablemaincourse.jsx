import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Tablemaincourse = () => {
  const [courses, setCourses] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [viewType, setViewType] = useState(null);
  const [editData, setEditData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editCourse, setEditCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses data
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subCourse`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle toggle for expanding sections
  const handleToggle = (courseId, type) => {
    setExpandedCourseId(
      expandedCourseId === courseId && viewType === type ? null : courseId
    );
    setViewType(type);
  };

  // Handle edit button click
  const handleEditClick = (item, type, courseId) => {
    setEditData({ ...item, type, courseId });
    setSelectedImage(null);
  };

  const handleEditCourse = (course) => {
    setEditCourse({ ...course });
  };

  // Handle input change in edit form
  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleInputChangeupper = (e) => {
    setEditCourse({ ...editCourse, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Handle update submission
  const handleUpdate = async () => {
    if (!editData) return;

    const formData = new FormData();
    formData.append("name", editData.name);

    if (editData.type === "course") {
      formData.append("description", editData.description);
      if (selectedImage) {
        formData.append("course_image", selectedImage);
      }
    } else if (editData.type === "instructor") {
      formData.append("other_info", editData.other_info);
      if (selectedImage) {
        formData.append("photo", selectedImage);
      }
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/subCourse/update-sub-courses/${editData.courseId}/${editData._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Update Successful!");
        setEditData(null);
        setSelectedImage(null);
        fetchCourses(); // Refresh data
      } else {
        alert(`Update Failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editCourse) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/subCourse/update-sub-courses/${editCourse._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editCourse.name,
            description: editCourse.description,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Update Successful!");
        setEditCourse(null);
        fetchCourses(); // Refresh data
      } else {
        alert(`Update Failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDelete = async (courseId, itemId = null) => {
    const confirmDelete = window.confirm(
      itemId
        ? "Are you sure you want to delete this item?"
        : "Are you sure you want to delete this entire sub-course?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/subCourse/delete-category/${courseId}${
          itemId ? `/${itemId}` : ""
        }`,
        { method: "DELETE" }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Deleted Successfully!");
        fetchCourses(); // Refresh data
      } else {
        alert(`Delete Failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end px-4">
        <Link to='/addmainc' className="bg-blue-500 px-3 py-2">Add Categories</Link>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-white">Courses List</h2>
      <table className="min-w-full bg-gray-900 text-white border border-gray-300">
        <thead>
          <tr className="bg-gray-700 text-center">
            <th className="py-2 px-4 border">Category Name</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border text-center">Action</th>
            <th className="py-2 px-4 border text-center">Action</th>
            <th className="py-2 px-4 border">Action</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <React.Fragment key={course._id}>
              <tr>
                <td className="py-2 px-4 border">{course.name}</td>
                <td className="py-2 px-4 border">{course.description}</td>

                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => handleToggle(course._id, "courses")}
                    className="px-4 py-1 rounded-md text-white"
                  >
                    Categories
                  </button>
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => handleToggle(course._id, "instructors")}
                    className="px-4 py-1 rounded-md text-white"
                  >
                    Instructors
                  </button>
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => handleEditCourse(course)}
                   
                  >
                    Edit
                  </button>
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => handleDelete(course._id)}
                    
                  >
                    Delete
                  </button>
                </td>
              </tr>

              {/* Expand Courses */}
              {expandedCourseId === course._id && viewType === "courses" && (
                <tr>
                  <td colSpan="6" className="py-2 px-4 border">
                    <h4 className="text-lg font-semibold mb-2">Courses:</h4>
                    <table className="w-full bg-gray-800 border border-gray-600">
                      <tbody>
                        {course.category_courses.map((subCourse) => (
                          <tr key={subCourse._id} className="text-center">
                            <td className="py-2 px-4 border">
                              {subCourse.name}
                            </td>
                            <td className="py-2 px-4 border">
                              <img
                                src={`${import.meta.env.VITE_API_URL}/${subCourse.course_image}`}
                                alt={subCourse.name}
                                className="w-32 h-20 object-cover rounded-md"
                              />
                            </td>
                            <td className="py-2 px-4 border">
                              <button
                                onClick={() =>
                                  handleEditClick(
                                    subCourse,
                                    "course",
                                    course._id
                                  )
                                }
                              >
                                Edit
                              </button>
                            </td>
                            <td className="py-2 px-4 border">
                              <button
                                onClick={() =>
                                  handleDelete(course._id, subCourse._id)
                                }
                                
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}

              {/* Expand Instructors */}
              {expandedCourseId === course._id &&
                viewType === "instructors" && (
                  <tr>
                    <td colSpan="6" className="py-2 px-4 border">
                      <h4 className="text-lg font-semibold mb-2">
                        Instructors:
                      </h4>
                      <table className="w-full bg-gray-800 border border-gray-600">
                        <tbody>
                          {course.category_instructors.map((instructor) => (
                            <tr key={instructor._id} className="text-center">
                              <td className="py-2 px-4 border">
                                {instructor.name}
                              </td>
                              <td className="py-2 px-4 border">
                                <img
                                  src={`${import.meta.env.VITE_API_URL}/${instructor.photo}`}
                                  alt={instructor.name}
                                  className="w-16 h-16 object-cover"
                                />
                              </td>
                              <td className="py-2 px-4 border">
                                <button
                                  onClick={() =>
                                    handleEditClick(
                                      instructor,
                                      "instructor",
                                      course._id
                                    )
                                  }
                                >
                                  Edit
                                </button>
                              </td>
                              <td className="py-2 px-4 border">
                                <button
                                  onClick={() =>
                                    handleDelete(course._id, instructor._id)
                                  }
                                 
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Edit {editData.type === "course" ? "Course" : "Instructor"}
            </h3>

            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />

            <input type="file" onChange={handleImageChange} className="mt-2" />

            <button
              onClick={handleUpdate}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
      {/* Edit Course Modal */}
      {editCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-200 p-6 rounded-lg w-96">
            <h3 className="text-xl text-black font-semibold mb-4">Edit Course</h3>

            <label className="block text-gray-700">Course Name</label>
            <input
              type="text"
              name="name"
              value={editCourse.name}
              onChange={handleInputChangeupper}
              className="w-full px-3 py-2 border rounded-md text-black"
            />

            <label className="block text-gray-700 mt-2">Description</label>
            <textarea
              name="description"
              value={editCourse.description}
              onChange={handleInputChangeupper}
              className="w-full px-3 py-2 border rounded-md text-black"
            />

            <button
              onClick={handleUpdateCourse}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditCourse(null)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tablemaincourse;
