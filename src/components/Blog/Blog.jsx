import React, { useState } from "react";
import axios from "axios";

const Blog = () => {
  const [formData, setFormData] = useState({
    blogName: "",
    shortDescription: "",
    blogCategory: "",
    blogDescription: "",
    publishDate: "",
    authorName: "",
    authorBio: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [blogImage, setBlogImage] = useState(null);
  const [authorProfileImage, setAuthorProfileImage] = useState(null); // ✅
  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);

  const categories = [
    "All",
    "Technology",
    "Marketing",
    "Software",
    "Education",
    "Short Courses in Islamabad",
    "Short Courses in Faisalabad",
    "IT Softwares",
    "SEO",
    "Design",
    "Photography",
  ];

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlogImageChange = (e) => {
    setBlogImage(e.target.files[0]);
  };

  const handleAuthorImageChange = (e) => {
    setAuthorProfileImage(e.target.files[0]);
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Trim all form fields
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (typeof value === "string") {
        data.append(key, value.trim());
      } else {
        data.append(key, value);
      }
    });

    // Generate URL Slug from blogName
    const urlSlug = generateSlug(formData.blogName);
    data.append("url_slug", urlSlug);

    if (blogImage) {
      data.append("blogImage", blogImage);
    }

    if (authorProfileImage) {
      data.append("authorProfileImage", authorProfileImage);
    }

    // Trim social links too
    const socialLinksObject = {};
    socialLinks.forEach(({ platform, url }) => {
      const trimmedPlatform = platform.trim();
      const trimmedUrl = url.trim();
      if (trimmedPlatform && trimmedUrl) {
        socialLinksObject[trimmedPlatform] = trimmedUrl;
      }
    });

    data.append("socialLinks", JSON.stringify(socialLinksObject));

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
      alert("Blog posted successfully!");

      // ===== Reset Form After Success =====
      setFormData({
        blogName: "",
        shortDescription: "",
        blogCategory: "",
        blogDescription: "",
        publishDate: "",
        authorName: "",
        authorBio: "",
        tags: "",
        metaTitle: "",
        metaDescription: "",
      });
      setBlogImage(null);
      setAuthorProfileImage(null);
      setSocialLinks([{ platform: "", url: "" }]);
    } catch (error) {
      console.error(error);
      alert("Failed to post blog.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Create a Blog</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Blog Name */}
        <div className="flex flex-col">
          <label className="font-semibold">Blog Name</label>
          <input
            type="text"
            name="blogName"
            value={formData.blogName}
            onChange={handleChange}
            className="border p-2 rounded text-black"
            required
          />
        </div>

        {/* Short Description */}
        <div className="flex flex-col">
          <label className="font-semibold">Short Description</label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="border p-2 rounded text-black"
            required
          />
        </div>

        {/* Blog Category */}
        <div className="flex flex-col">
          <label className="font-semibold">Blog Category</label>
          <select
            name="blogCategory"
            value={formData.blogCategory}
            onChange={handleChange}
            className="border p-2 rounded text-black"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Blog Description */}
        <div className="flex flex-col">
          <label className="font-semibold">Blog Description</label>
          <textarea
            name="blogDescription"
            value={formData.blogDescription}
            onChange={handleChange}
            className="border p-2 rounded min-h-[120px] text-black"
            required
          />
        </div>

        {/* Publish Date */}
        <div className="flex flex-col">
          <label className="font-semibold">Publish Date</label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className="border p-2 rounded text-black"
          />
        </div>

        {/* Author Details */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Author Information</label>

          <input
            type="text"
            name="authorName"
            placeholder="Author Name"
            value={formData.authorName}
            onChange={handleChange}
            className="border p-2 rounded text-black"
            required
          />

          <input
            type="text"
            name="authorBio"
            placeholder="Author Bio"
            value={formData.authorBio}
            onChange={handleChange}
            className="border p-2 rounded text-black"
          />

          {/* Upload Author Profile Image */}
          <input
            type="file"
            name="authorProfileImage"
            onChange={handleAuthorImageChange}
            className="border p-2 rounded text-black"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col">
          <label className="font-semibold">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="border p-2 rounded text-black"
          />
        </div>

        {/* Meta Title */}
        <div className="flex flex-col">
          <label className="font-semibold">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            className="border p-2 rounded text-black"
            required
          />
        </div>

        {/* Meta Description */}
        <div className="flex flex-col">
          <label className="font-semibold">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            className="border p-2 rounded min-h-[80px] text-black"
            required
          />
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Social Links</label>

          {socialLinks.map((link, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                placeholder="Platform (e.g., Facebook)"
                value={link.platform}
                onChange={(e) =>
                  handleSocialLinkChange(index, "platform", e.target.value)
                }
                className="border p-2 rounded flex-1 text-black"
                required
              />
              <input
                type="text"
                placeholder="URL"
                value={link.url}
                onChange={(e) =>
                  handleSocialLinkChange(index, "url", e.target.value)
                }
                className="border p-2 rounded flex-1 text-black"
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addSocialLink}
            className="mt-2 text-blue-600 hover:underline self-start"
          >
            + Add More
          </button>
        </div>

        {/* Blog Image Upload */}
        <div className="flex flex-col">
          <label className="font-semibold">Blog Image</label>
          <input
            type="file"
            name="blogImage"
            onChange={handleBlogImageChange}
            className="border p-2 rounded text-black"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Post Blog
        </button>
      </form>
    </div>
  );
};

export default Blog;
