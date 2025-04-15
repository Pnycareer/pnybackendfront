import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
const AddCourse = () => {
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedCourseImage, setSelectedCourseImage] = useState(null); // State for course image file
  const [selectedBrochure, setSelectedBrochure] = useState(null); // State for brochure file
  const [courseType, setCourseType] = useState("main"); // default is "main"

  const cityOptions = [
    "lahore",
    "multan",
    "karachi",
    "islamabad",
    "rawalpindi",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [courseDescription, setCourseDescription] = useState(""); // State for course description
  const [brochure, setBrochure] = useState(null); // State for brochure file
  // Fetch categories
  const fetchCategories = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  };
  // Fetch instructors
  const fetchInstructors = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/instructors/get-instructor`)
      .then((response) => response.json())
      .then((data) => setInstructors(data))
      .catch((error) => console.error("Error fetching instructors:", error));
  };
  useEffect(() => {
    fetchCategories();
    fetchInstructors();
  }, []);
  const onSubmit = async (data) => {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "string") {
        data[key] = data[key].trim();
      }
    });

    if (data.url_Slug) {
      data.url_Slug = data.url_Slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove special characters
        .replace(/\s+/g, "-") // replace spaces with dash
        .replace(/-+/g, "-"); // replace multiple dashes with single dash
    }
    const formData = new FormData();
    formData.append("course_Name", data.course_Name);
    formData.append("url_Slug", data.url_Slug);
    formData.append("featured_Option", data.featured_Option);
    formData.append("video_Id", data.video_Id);
    formData.append("course_Category", data.course_Category); // Ensure it's a valid ObjectId
    formData.append("category_Description", data.category_Description || "");
    formData.append("Skill_Level", data.Skill_Level);
    formData.append("Short_Description", data.Short_Description);
    formData.append("Course_Description", courseDescription); // From ReactQuill
    formData.append("Instructor", data.instructor); // Ensure it's a valid ObjectId
    formData.append("Monthly_Fee", data.Monthly_Fee);
    formData.append("Admission_Fee", data.Admission_Fee);
    formData.append("Duration_Months", data.Duration_Months);
    formData.append("Duration_Day", data.Duration_Day);
    formData.append("Meta_Title", data.Meta_Title);
    formData.append("Meta_Description", data.Meta_Description);
    formData.append("Status", data.Status);
    formData.append("View_On_Web", data.View_On_Web);
    formData.append("In_Sitemap", data.In_Sitemap);
    formData.append("Page_Index", data.Page_Index);
    formData.append("Custom_Canonical_Url", data.Custom_Canonical_Url);
    // Append files if they exist
    if (selectedCourseImage) {
      formData.append("course_Image", selectedCourseImage);
    }
    if (selectedBrochure) {
      formData.append("Brochure", selectedBrochure);
    }
    // Log the FormData before sending
    console.log("FormData Entries:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/courses/add-course`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response Data:", response.data); // Log full response
      toast.success("Course added successfully!");
      navigate("/courses");
    } catch (error) {
      console.error("Error adding course:", error.response || error.message);
      toast.error(
        "Error adding course:",
        error.response?.data || error.message
      );
    }
  };

  console.log(categories, "addcourse");
  return (
    <div className="w-full overflow-y-auto">
      <Header />
      <div className="p-6 bg-gray-800 rounded-lg shadow-md m-full mx-auto mt-10">
        <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">
          Add Course
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">
              Select Course Type*
            </label>
            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
              required
            >
              <option value="main">Main Course</option>
              <option value="city">City Course</option>
            </select>
          </div>

          {/* Course Name */}

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Course Name*</label>
            <input
              type="text"
              {...register("course_Name", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter course name"
            />
            {errors.courseName && (
              <span className="text-red-500">Course Name is required</span>
            )}
          </div>
          {/* URL Slug */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">URL Slug*</label>
            <input
              type="text"
              {...register("url_Slug", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter URL slug"
            />
            {errors.urlSlug && (
              <span className="text-red-500">URL Slug is required</span>
            )}
          </div>

          {courseType === "main" && (
            <>
              {/* Featured Option */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Featured*</label>
                <select
                  {...register("featured_Option", { required: true })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.featured && (
                  <span className="text-red-500">
                    Featured option is required
                  </span>
                )}
              </div>

              {/* Video ID */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Video ID*</label>
                <input
                  type="text"
                  {...register("video_Id", { required: true })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  placeholder="Enter Video ID"
                />
                {errors.videoID && (
                  <span className="text-red-500">Video ID is required</span>
                )}
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Course Category*</label>
            <select
              {...register("course_Category", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
            >
              {courseType === "main"
                ? categories.map((cat) => (
                    <option key={cat._id} value={cat.url_Slug}>
                      {cat.Category_Name}
                    </option>
                  ))
                : cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city.charAt(0).toUpperCase() + city.slice(1)}
                    </option>
                  ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">
              Category Description (Optional)
            </label>
            <input
              type="text"
              {...register("category_Description")}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter description for the category"
            />
          </div>

          {courseType === "main" && (
            <>
              {/* Skill Level */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Skill Level*</label>
                <select
                  {...register("Skill_Level", { required: true })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="all">Appropriate for All</option>
                </select>
                {errors.skillLevel && (
                  <span className="text-red-500">Skill Level is required</span>
                )}
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Instructor*</label>
            <select
              {...register("instructor", { required: true })} // Changed "Instructor" to "instructor"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
            >
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </option>
              ))}
            </select>
            {errors.instructor && (
              <span className="text-red-500">Instructor is required</span>
            )}
          </div>

          {courseType === "main" && (
            <>
              {/* Monthly Fee */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Monthly Fee*</label>
                <input
                  type="number"
                  {...register("Monthly_Fee", { required: true })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  placeholder="Enter monthly fee"
                />
                {errors.monthlyFee && (
                  <span className="text-red-500">Monthly Fee is required</span>
                )}
              </div>

              {/* Admission Fee */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  Admission Fee*
                </label>
                <input
                  type="number"
                  {...register("Admission_Fee", { required: true })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  placeholder="Enter admission fee"
                />
                {errors.admissionFee && (
                  <span className="text-red-500">
                    Admission Fee is required
                  </span>
                )}
              </div>

              {/* Duration Months */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  Duration Months*
                </label>
                <input
                  type="number"
                  {...register("Duration_Months", { required: true })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  placeholder="Enter duration in months"
                />
                {errors.durationMonths && (
                  <span className="text-red-500">
                    Duration in Months is required
                  </span>
                )}
              </div>

              {/* Duration Days */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  Duration Days*
                </label>
                <input
                  type="number"
                  {...register("Duration_Day", { required: true })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  placeholder="Enter duration in days"
                />
                {errors.durationDays && (
                  <span className="text-red-500">
                    Duration in Days is required
                  </span>
                )}
              </div>

              {/* Brochure */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Brochure*</label>
                <input
                  type="file"
                  {...register("Brochure", { required: true })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  accept=".pdf"
                  onChange={(e) => setSelectedBrochure(e.target.files[0])}
                />
                {errors.brochure && (
                  <span className="text-red-500">Brochure is required</span>
                )}
              </div>
            </>
          )}

          {/* Status */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Status*</label>
            <select
              {...register("Status", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.Status && (
              <span className="text-red-500">Status is required</span>
            )}
          </div>

          {/* Is View on Web? */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Is View on Web?*</label>
            <select
              {...register("View_On_Web", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.isViewOnWeb && (
              <span className="text-red-500">Selection is required</span>
            )}
          </div>

          {/* In Sitemap */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">In Sitemap?*</label>
            <select
              {...register("In_Sitemap", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.inSitemap && (
              <span className="text-red-500">Selection is required</span>
            )}
          </div>

          {/* Page Index */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Page Index?*</label>
            <select
              {...register("Page_Index", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.pageIndex && (
              <span className="text-red-500">Selection is required</span>
            )}
          </div>
          {/* Custom Canonical URL */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">
              Custom Canonical URL
            </label>
            <input
              type="text"
              {...register("Custom_Canonical_Url")}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter custom canonical URL"
            />
          </div>

          {/* Course Image */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Course Image*</label>
            <input
              type="file"
              {...register("course_Image", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
              accept="image/*"
              placeholder="jpg,png,jpeg, gif size : 5mb"
              onChange={(e) => setSelectedCourseImage(e.target.files[0])}
            />
            {errors.courseImage && (
              <span className="text-red-500">Course Image is required</span>
            )}
          </div>

          {/* Short Description */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">
              Short Description*
            </label>
            <textarea
              {...register("Short_Description", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter short description"
            />
            {errors.shortDescription && (
              <span className="text-red-500">
                Short Description is required
              </span>
            )}
          </div>
          {/* Course Description (CKEditor) */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Course Description*
            </label>
            <ReactQuill
              value={courseDescription}
              onChange={setCourseDescription}
              theme="snow"
              className="bg-white text-black rounded-md"
            />
            {errors.courseDescription && (
              <span className="text-red-500">
                Course Description is required
              </span>
            )}
          </div>

          {/* Meta Title */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Meta Title*</label>
            <input
              type="text"
              {...register("Meta_Title", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter meta title"
            />
            {errors.metaTitle && (
              <span className="text-red-500">Meta Title is required</span>
            )}
          </div>
          {/* Meta Description */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">
              Meta Description*
            </label>
            <textarea
              {...register("Meta_Description", { required: true })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter meta description"
            />
            {errors.metaDescription && (
              <span className="text-red-500">Meta Description is required</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
