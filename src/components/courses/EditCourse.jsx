import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../common/Header";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState({
    course_Name: "",
    Short_Description: "",
    course_Image: "",
    status: " ",
    Admission_Fee: "",
    Brochure: "",
    Course_Description: "",
    Custom_Canonical_Url: "",
    Duration_Day: "",
    Duration_Months: "",
    In_Sitemap: false,
    Instructor: "",
    Meta_Description: "",
    Meta_Title: "",
    Monthly_Fee: "",
    Page_Index: false,
    Skill_Level: "",
    View_On_Web: false,
    url_Slug: "",
    video_Id: "",
    course_Category: "",
    featured_Option: "",
  });
  const [categories, setCategories] = useState([]);
  const [brochureFile, setBrochureFile] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, categoriesResponse, instructorsResponse] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/courses/${id}`),
            axios.get(`${import.meta.env.VITE_API_URL}/api/v1/categories`),
            axios.get(
              `${import.meta.env.VITE_API_URL}/api/instructors/get-instructor`
            ),
          ]);
        const fetchedCourse = courseResponse.data;
        // Ensure all keys in the state exist in the fetched course
        const updatedCourse = { ...course };
        for (const key in updatedCourse) {
          if (!(key in fetchedCourse)) {
            fetchedCourse[key] = updatedCourse[key];
          }
        }
        setCourse(fetchedCourse);
        setCategories(categoriesResponse.data);
        setInstructors(instructorsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in course) {
      if (key === "course_Category") {
        formData.append(
          key,
          course.course_Category._id || course.course_Category
        );
      } else if (
        key === "course_Image" &&
        course.course_Image instanceof File
      ) {
        formData.append(key, course.course_Image);
      } else {
        formData.append(key, course[key]);
      }
    }

    if (brochureFile) formData.append("Brochure", brochureFile);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/courses/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Course updated successfully!");
      navigate("/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course");
    }
  };

  const handleCancel = () => {
    navigate("/courses");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/courses/get-course`
        );
        setCategories(response.data); // Assuming response contains an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="w-full overflow-auto">
      <Header />
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border my-10 border-gray-700 mx-auto w-full">
        <h2 className="text-2xl font-semibold text-gray-100 mb-5">
          Edit Course
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Course Name */}
          <div className="mb-4">
            <label className="block text-gray-300">Course Name</label>
            <input
              type="text"
              name="course_Name"
              value={course.course_Name}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* URL Slug */}
          <div className="mb-4">
            <label className="block text-gray-300">URL Slug</label>
            <input
              type="text"
              name="url_Slug"
              value={course.url_Slug}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* Featured Option */}
          <div className="mb-4">
            <label className="block text-gray-300">
              Enable Featured Option?
            </label>
            <select
              name="featured_Option"
              value={course.featured_Option ? "yes" : "no"}
              onChange={(e) =>
                setCourse((prev) => ({
                  ...prev,
                  featured_Option: e.target.value === "yes",
                }))
              }
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Course Image */}
          <div className="mb-4">
            <label className="block text-gray-300">Upload Course Image</label>
            <input
              type="file"
              name="course_Image"
              onChange={(e) =>
                setCourse((prev) => ({
                  ...prev,
                  course_Image: e.target.files[0],
                }))
              }
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="my-2">
            <label>Video ID</label>
            <input
              className="w-full p-2 rounded bg-gray-700 text-white"
              type="text"
              name="video_Id"
              value={course.video_Id}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Course Category*</label>
            <select
              name="course_Category"
              value={course.course_Category}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="" disabled>
                Select Course Category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.url_Slug}>
                  {category.Category_Name}{" "}
                  {/* Adjust according to API response */}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Level */}
          <div className="mb-4">
            <label className="block text-gray-300">Skill Level</label>
            <select
              name="Skill_Level"
              value={course.Skill_Level}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="" disabled>
                Select Skill Level
              </option>{" "}
              {/* Default Placeholder */}
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Short Description */}
          <div className="mb-4">
            <label className="block text-gray-300">Short Description</label>
            <textarea
              name="Short_Description"
              value={course.Short_Description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* Course Description */}
          <div className="mb-4">
            <label className="block text-gray-300">Course Description</label>
            <ReactQuill
              value={course.Course_Description}
              onChange={(content) =>
                setCourse((prev) => ({ ...prev, Course_Description: content }))
              }
              theme="snow"
              className="text-gray-700 bg-white rounded-md"
            />
          </div>

          {/* Instructor */}
          <div className="mb-4">
            <label className="block text-gray-300">Instructor</label>
            <select
              name="Instructor"
              value={course.Instructor}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Select an Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Monthly_Fee</label>
            <input
              type="number"
              name="Monthly_Fee"
              value={course.Monthly_Fee}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* Admission Fee */}
          <div className="mb-4">
            <label className="block text-gray-300">Admission Fee</label>
            <input
              type="number"
              name="Admission_Fee"
              value={course.Admission_Fee}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Duration_Months</label>
            <input
              type="number"
              name="Duration_Months"
              value={course.Duration_Months}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Duration_Day</label>
            <input
              type="number"
              name="Duration_Day"
              value={course.Duration_Day}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Meta_Title</label>
            <input
              type="text"
              name="Meta_Title"
              value={course.Meta_Title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Meta_Description</label>
            <input
              type="text"
              name="Meta_Description"
              value={course.Meta_Description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* Brochure */}
          <div className="mb-4">
            <label className="block text-gray-300">Upload Brochure</label>
            <input
              type="file"
              onChange={(e) => setBrochureFile(e.target.files[0])}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Status</label>
            <select
              name="status"
              value={course.status}
              onChange={(e) =>
                setCourse((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label>View on Web</label>
            <input
              type="checkbox"
              name="View_On_Web"
              checked={course.View_On_Web}
              onChange={(e) =>
                setCourse({ ...course, View_On_Web: e.target.checked })
              }
            />
          </div>

          <div className="my-2">
            <label>In_Sitemap</label>
            <input
              type="checkbox"
              name="In_Sitemap"
              checked={course.In_Sitemap}
              onChange={(e) =>
                setCourse({ ...course, In_Sitemap: e.target.checked })
              }
            />
          </div>

          <div className="my-2">
            <label>Page Index</label>
            <input
              type="checkbox"
              name="Page_Index"
              checked={course.Page_Index}
              onChange={(e) =>
                setCourse({ ...course, Page_Index: e.target.checked })
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Custom_Canonical_Url</label>
            <input
              type="text"
              name="Custom_Canonical_Url"
              value={course.Custom_Canonical_Url}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Update Course
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

export default EditCourse;
