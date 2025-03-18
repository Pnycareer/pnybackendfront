import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Zoom } from "react-toastify";

function App() {
  // -----------------------------
  // 1. Subcategory fields
  // -----------------------------
  const [name, setName] = useState("");
  const [urlSlug, setUrlSlug] = useState("");
  const [description, setDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For loader

  const slugOptions = [
    "diploma",
    "marketing",
    "development",
    "designing",
    "business",
    "multimedia",
  ];
  // -----------------------------
  // 2. Courses (array)
  // -----------------------------
  const [courses, setCourses] = useState([
    {
      name: "",
      course_image: "",
      monthly_tution_fee: "",
      url_slug: "",
      description: "",
    },
  ]);

  // Add a new empty course
  const handleAddCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        name: "",
        course_image: "",
        monthly_tution_fee: "",
        url_slug: "",
        description: "",
      },
    ]);
  };

  // Remove a course by index
  const handleRemoveCourse = (index) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a particular course field
  const handleCourseChange = (index, field, value) => {
    setCourses((prev) => {
      const updatedCourses = [...prev];
      updatedCourses[index][field] = value;
      return updatedCourses;
    });
  };

  // -----------------------------
  // 3. Instructors (array)
  // -----------------------------
  const [instructors, setInstructors] = useState([
    {
      name: "",
      other_info: "",
      photo: "",
    },
  ]);

  // Add a new empty instructor
  const handleAddInstructor = () => {
    setInstructors((prev) => [
      ...prev,
      {
        name: "",
        other_info: "",
        photo: "",
      },
    ]);
  };

  // Remove an instructor by index
  const handleRemoveInstructor = (index) => {
    setInstructors((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a particular instructor field
  const handleInstructorChange = (index, field, value) => {
    setInstructors((prev) => {
      const updatedInstructors = [...prev];
      updatedInstructors[index][field] = value;
      return updatedInstructors;
    });
  };

  const handleSlugChange = async (e) => {
    const selectedSlug = e.target.value;
    setUrlSlug(selectedSlug);

    if (!selectedSlug) return;

    setIsLoading(true); // Start loader

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/subCourse/getsubcourses/${selectedSlug}`
      );
      const data = await response.json();

      if (response.ok) {
        // Populate only upper fields (not courses & instructors)
        setName(data.name);
        setDescription(data.description);
        setMetaTitle(data.meta_title);
        setMetaDescription(data.meta_description);
      } else {
        toast.success("Subcategory not found!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Zoom,
        });
      }
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      toast("Failed to fetch subcategory.");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/instructors/get-instructor`
        );
        const data = await response.json();
        if (response.ok) {
          setInstructorOptions(data);
        } else {
          console.error("Error fetching instructors");
        }
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/courses/get-course`
        );
        const data = await response.json();
        if (response.ok) {
          setCourseOptions(data); // Set course options
        } else {
          console.error("Error fetching courses");
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      name,
      url_slug: urlSlug,
      description,
      meta_title: metaTitle,
      meta_description: metaDescription,
      category_courses: courses,
      category_instructors: instructors,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/subCourse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Success! " + data.message);
        console.log("Response data:", data);
      } else {
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Form submission failed. Check console for details.");
    }
  };

  return (
    <div className="w-full mx-auto p-6 h-92 overflow-y-auto bg-gray-700">
      <h1 className="text-2xl font-bold mb-6">Create / Update Subcategory</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* =====================
            Subcategory Fields
            ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Name:</label>
            <input
              type="text"
              className="border rounded w-full p-2 text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block font-semibold">Select Slug:</label>
            <select
              className="border rounded w-full p-2 text-black"
              value={urlSlug}
              onChange={handleSlugChange}
            >
              <option value="">Select a subcategory</option>
              {slugOptions.map((slug) => (
                <option key={slug} value={slug}>
                  {slug}
                </option>
              ))}
            </select>

            {/* Loader */}
            {isLoading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0l4 4-4 4V4a8 8 0 00-8 8H4z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold">Description Short:</label>
          <input
            type="text"
            className="border rounded w-full p-2 text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Meta Title:</label>
            <input
              type="text"
              className="border rounded w-full p-2 text-black"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Meta Description:</label>
            <input
              type="text"
              className="border rounded w-full p-2 text-black"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              required
            />
          </div>
        </div>

        {/* =====================
            Courses Section
            ===================== */}
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          {courses.map((course, index) => (
            <div key={index} className="p-4 mb-4 border rounded-md relative">
              <button
                type="button"
                onClick={() => handleRemoveCourse(index)}
                className="absolute top-2 right-2 text-red-600 font-bold"
              >
                X
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course name */}
                <div>
                  <label className="block font-semibold">Course Name:</label>
                  <select
                    className="border rounded w-full p-2 text-black"
                    value={course.name}
                    onChange={(e) => {
                      const selectedCourse = courseOptions.find(
                        (course) => course.course_Name === e.target.value
                      );
                      if (selectedCourse) {
                        handleCourseChange(
                          index,
                          "name",
                          selectedCourse.course_Name
                        );
                        handleCourseChange(
                          index,
                          "url_slug",
                          selectedCourse.url_Slug
                        );
                        handleCourseChange(
                          index,
                          "course_image",
                          selectedCourse.course_Image
                        );
                        handleCourseChange(
                          index,
                          "description",
                          selectedCourse.Short_Description
                        );
                      }
                    }}
                    required
                  >
                    <option value="">Select a course</option>
                    {courseOptions.map((course) => (
                      <option key={course._id} value={course.course_Name}>
                        {course.course_Name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* URL Slug */}
                <div>
                  <label className="block font-semibold">
                    Course URL Slug:
                  </label>
                  <input
                    type="text"
                    className="border rounded w-full p-2 text-black"
                    value={course.url_slug}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                {/* Teacher Name */}
                <div>
                  <label className="block font-semibold">Description:</label>
                  <input
                    type="text"
                    className="border rounded w-full p-2 text-black"
                    value={course.description}
                    readOnly
                  />
                </div>
              </div>

              {/* Course Image */}
              <div className="mt-4">
                <label className="block font-semibold">Course Image:</label>
                <input
                  type="text"
                  className="border rounded w-full p-2 text-black hidden"
                  value={course.course_image}
                  readOnly
                />
                <img
                  src={`http://localhost:8080/${course.course_image}`}
                  alt="Course Image"
                  className="w-24 h-24 rounded-md mt-2"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCourse}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Add Another Course
          </button>
        </div>

        {/* =====================
            Instructors Section
            ===================== */}
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-4">Instructors</h2>
          {instructors.map((inst, index) => (
            <div key={index} className="p-4 mb-4 border rounded-md relative">
              <button
                type="button"
                onClick={() => handleRemoveInstructor(index)}
                className="absolute top-2 right-2 text-red-600 font-bold"
              >
                X
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Instructor name */}
                <div>
                  <label className="block font-semibold">Select:</label>
                  <select
                    className="border rounded w-full p-2 text-black"
                    value={inst.name} // ✅ Use inst.name to keep the selected instructor
                    onChange={(e) => {
                      const selectedInstructor = instructorOptions.find(
                        (inst) => inst.name === e.target.value
                      );
                      if (selectedInstructor) {
                        handleInstructorChange(
                          index,
                          "name",
                          selectedInstructor.name
                        );
                        handleInstructorChange(
                          index,
                          "other_info",
                          selectedInstructor.other_info
                        );
                        handleInstructorChange(
                          index,
                          "photo",
                          selectedInstructor.photo
                        );
                      }
                    }}
                  >
                    <option value="">Select an instructor</option>
                    {instructorOptions.map((instructor) => (
                      <option key={instructor._id} value={instructor.name}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Other Info */}
                <div>
                  <label className="block font-semibold">Other Info:</label>
                  <input
                    type="text"
                    className="border rounded w-full p-2 text-black"
                    value={inst.other_info}
                    readOnly
                  />
                </div>

                <div>
                  {/* Instructor Photo */}
                  <input
                    type="text"
                    className="border rounded w-full p-2 text-black hidden"
                    value={inst.photo || ""}
                    readOnly // Prevent manual editing
                  />
                  <img
                    src={
                      inst.photo
                        ? `http://localhost:8080/${inst.photo}`
                        : "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png"
                    }
                    alt="Instructor"
                    className="w-24 h-24 rounded-md mt-2"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddInstructor}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Add Another Instructor
          </button>
        </div>

        {/* =====================
            Submit
            ===================== */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
