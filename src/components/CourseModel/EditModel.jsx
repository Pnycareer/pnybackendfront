import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [slug, setSlug] = useState("marketing");
  const [courseList, setCourseList] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [lectures, setLectures] = useState([
    { lectureNumber: "", title: "", content: "", topics: [""] },
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/courses/getoncategory/${slug}`
        );
        const data = await res.json();
        setCourseList(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchCourses();
  }, [slug]);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/coursemodel/${id}`
        );
        const model = res.data;

        // Set slug based on the course category (which drives course list)
        const modelSlug = model.courseId?.course_Category?.toLowerCase();
        if (modelSlug) setSlug(modelSlug);

        setLectures(
          model.lectures.length
            ? model.lectures
            : [{ lectureNumber: 1, title: "", content: "", topics: [""] }]
        );

        // Set courseId after courseList is loaded
        setTimeout(() => {
          setCourseId(model.courseId?._id || "");
        }, 500); // Wait for courseList to load
      } catch (err) {
        console.error("Error fetching course model:", err);
      }
    };

    fetchModel();
  }, [id]);

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
      { lectureNumber: "", title: "", content: "", topics: [""] },
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

    try {
      const data = {
        courseId,
        lectures,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/coursemodel/${id}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Course model updated successfully!");
      navigate("/coursemodel");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update model.");
    }
  };

  return (
    <div className="p-6 w-full mx-auto h-screen overflow-y-auto bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Edit Course Feature</h2>
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

        {/* Lecture UI */}
        {lectures.map((lecture, index) => (
          <div
            key={index}
            className="border border-gray-700 p-4 rounded bg-zinc-800"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-white">Lecture</h3>
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
              className="bg-zinc-900 border border-gray-700 p-2 w-full mb-2 text-white"
              required
            />
            <input
              type="text"
              value={lecture.title}
              onChange={(e) =>
                handleLectureChange(index, "title", e.target.value)
              }
              placeholder="Lecture Title"
              className="bg-zinc-900 border border-gray-700 p-2 w-full mb-2 text-white"
              required
            />
            <textarea
              value={lecture.content}
              onChange={(e) =>
                handleLectureChange(index, "content", e.target.value)
              }
              placeholder="Lecture Content"
              className="bg-zinc-900 border border-gray-700 p-2 w-full mb-2 text-white"
              required
            />

            {lecture.topics.map((topic, tIndex) => (
              <div key={tIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) =>
                    handleTopicChange(index, tIndex, e.target.value)
                  }
                  placeholder={`Topic ${tIndex + 1}`}
                  className="bg-zinc-900 border border-gray-700 p-2 w-full text-white"
                  required
                />
                {lecture.topics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopic(index, tIndex)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

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
          Update
        </button>
      </form>
    </div>
  );
};

export default EditModel;
