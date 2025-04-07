import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const AddModel = () => {
  const [slug, setSlug] = useState("marketing"); // Default slug
  const [courseList, setCourseList] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [lectures, setLectures] = useState([
    { lectureNumber: 1, title: "", content: "", topics: "" },
  ]);

  // Fetch courses when slug changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/courses/getoncategory/${slug}`
        );
        const data = await res.json();
        setCourseList(data);
        setCourseId(data[0]?._id || ""); // Auto-select first course
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchCourses();
  }, [slug]);

  // --- rest of your lecture-handling functions (no changes) ---

  const handleLectureChange = (index, field, value) => {
    const updatedLectures = [...lectures];
    updatedLectures[index][field] = value;
    setLectures(updatedLectures);
  };

  const handleTopicChange = (lectureIndex, topicIndex, value) => {
    const updatedLectures = [...lectures];
    updatedLectures[lectureIndex].topics[topicIndex] = value;
    setLectures(updatedLectures);
  };

  const addLecture = () => {
    setLectures([
      ...lectures,
      {
        lectureNumber: lectures.length + 1,
        title: "",
        content: "",
        topics: "",
      },
    ]);
  };

  const removeLecture = (index) => {
    if (lectures.length === 1) return;
    const updatedLectures = lectures.filter((_, i) => i !== index);
    setLectures(updatedLectures);
  };

  const addTopic = (lectureIndex) => {
    const updatedLectures = [...lectures];
    updatedLectures[lectureIndex].topics.push("");
    setLectures(updatedLectures);
  };

  const removeTopic = (lectureIndex, topicIndex) => {
    const updatedLectures = [...lectures];
    if (updatedLectures[lectureIndex].topics.length === 1) return;
    updatedLectures[lectureIndex].topics.splice(topicIndex, 1);
    setLectures(updatedLectures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      courseId,
      lectures,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/coursemodel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      console.log("Response:", result);
      alert("Course Feature Created!");

      setCourseId("");
      setLectures([{ lectureNumber: 1, title: "", content: "", topics: "" }]);
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form.");
    }
  };

  return (
    <div className="p-6 w-full mx-auto h-screen overflow-y-auto bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Add Course Feature</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Slug Dropdown */}
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="bg-zinc-900 border border-gray-700 p-2 w-full text-white"
        >
          <option value="marketing">Marketing</option>
          <option value="designing">Designing</option>
          <option value="diploma">Diploma</option>
          <option value="development">Development</option>
          <option value="business">Business</option>
          <option value="multimedia">Multimedia</option>
          <option value="lahore">lahore</option>
        </select>

        {/* Course Dropdown */}
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="bg-zinc-900 border border-gray-700 p-2 w-full text-white"
          required
        >
          <option value="">Select a Course</option>
          {courseList.map((course) => (
            <option key={course._id} value={course._id}>
              {course.course_Name}
            </option>
          ))}
        </select>

        {/* Lectures UI (same as before) */}
        {lectures.map((lecture, index) => (
          <div
            key={index}
            className="border border-gray-700 p-4 rounded bg-zinc-800"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-white">
                Lecture {lecture.lectureNumber}
              </h3>
              {lectures.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLecture(index)}
                  className="text-red-500 text-sm"
                >
                  🗑 Remove Lecture
                </button>
              )}
            </div>

            <input
              type="number"
              value={lecture.lectureNumber}
              onChange={(e) =>
                handleLectureChange(
                  index,
                  "lectureNumber",
                  parseInt(e.target.value)
                )
              }
              placeholder="Lecture Number"
              className="bg-zinc-900 border border-gray-700 p-2 w-full mb-2 text-white placeholder-gray-400"
              required
            />
            <input
              type="text"
              value={lecture.title}
              onChange={(e) =>
                handleLectureChange(index, "title", e.target.value)
              }
              placeholder="Lecture Title"
              className="bg-zinc-900 border border-gray-700 p-2 w-full mb-2 text-white placeholder-gray-400"
              required
            />
            <textarea
              value={lecture.content}
              onChange={(e) =>
                handleLectureChange(index, "content", e.target.value)
              }
              placeholder="Lecture Content"
              className="bg-zinc-900 border border-gray-700 p-2 w-full mb-2 text-white placeholder-gray-400"
              required
            />

            <div className="mb-4">
              <label className="block mb-2">Lecture Topics:</label>
              <ReactQuill
                theme="snow"
                value={lecture.topics}
                onChange={(value) =>
                  handleLectureChange(index, "topics", value)
                }
                className="bg-white text-black"
              />
            </div>
            <button
              type="button"
              onClick={() => addTopic(index)}
              className="text-sm text-blue-400 hover:underline"
            >
              + Add Topic
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addLecture}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          + Add Lecture
        </button>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddModel;
