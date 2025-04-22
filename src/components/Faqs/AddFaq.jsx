// src/components/FaqPostPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function FaqPostPage() {
  const [category, setCategory] = useState({ name: ""});
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [faqImage, setFaqImage] = useState(null);

  const handleChange = (i, key, val) => {
    const updated = [...faqs];
    updated[i][key] = val;
    setFaqs(updated);
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", JSON.stringify(category));
    formData.append("faqs", JSON.stringify(faqs));
    if (faqImage) formData.append("faqImage", faqImage);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/faqs`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to post FAQ");
      alert("FAQ posted!");
      setCategory({ name: "", url_slug: "" });
      setFaqs([{ question: "", answer: "" }]);
      setFaqImage(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full mx-auto p-6 bg-gray-100  shadow-lg space-y-6 overflow-y-auto min-h-screen"
    >
      <h2 className="text-2xl font-bold text-gray-800">Create a FAQ</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            className="input input-bordered w-full p-3 rounded-lg border border-gray-300"
            required
          />
          {/* <input
            type="text"
            placeholder="Slug"
            value={category.url_slug}
            onChange={(e) =>
              setCategory({ ...category, url_slug: e.target.value })
            }
            className="input input-bordered w-full p-3 rounded-lg border border-gray-300"
            required
          /> */}
        </div>

        <input
          type="file"
          onChange={(e) => setFaqImage(e.target.files[0])}
          accept="image/*"
          className="block w-full mt-2"
        />

        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border p-4 rounded-lg"
          >
            <input
              type="text"
              placeholder="Question"
              value={faq.question}
              onChange={(e) => handleChange(i, "question", e.target.value)}
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => handleChange(i, "answer", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              required
            />
          </motion.div>
        ))}

        <button
          type="button"
          onClick={addFaq}
          className="text-blue-600 underline mt-2"
        >
          + Add another FAQ
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Submit FAQ
        </button>
      </form>
    </motion.div>
  );
}
