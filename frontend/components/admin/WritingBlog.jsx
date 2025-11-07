"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import SubTitle from "../shared/typography/SubTitle";
import QuillEditor from "./QuillEditor";
import { useRouter } from "next/navigation";
import { useAddBlogMutation, useUpdateBlogMutation } from "@/features/blogApi";

export default function WritingBlog({ initialData, onClose }) {
  // ---- form state ----
  const [title, setTitle] = useState("");
  const [editorData, setEditorData] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const router = useRouter();

  // ---- thumbnail state ----
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imgError, setImgError] = useState("");

  // RTK Query mutation hooks
  const [addBlog, { isLoading: adding }] = useAddBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();

  const isLoading = adding || updating;

  // Prefill fields when editing
useEffect(() => {
  if (initialData) {


    setTitle(initialData.title || "");
    setEditorData(initialData.content || "");
    
    // Ensure tags are always an array of strings
    if (Array.isArray(initialData.tags)) {
      setTags(initialData.tags);
    } else if (typeof initialData.tags === "string") {
      setTags(initialData.tags.split(",").map((t) => t.trim()));
    } else {
      setTags([]);
    }

    setPreview(initialData.thumbnailUrl || initialData.image || null);
  }
}, [initialData]);

  const openPicker = () => fileInputRef.current?.click();

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/jpe?g$/i.test(f.name) && f.type !== "image/jpeg") {
      setImgError("Please select a JPEG (.jpg / .jpeg) file.");
      setFile(null);
      setPreview(null);
      return;
    }
    setImgError("");
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const clearImage = () => {
    if (preview && typeof preview === "string") URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setImgError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---- tags helpers ----
  const addTag = (raw) => {
    const t = raw.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const onTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  // helper: upload to ImgBB
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=08dd2c25fadca9984c9fe58a66d619e7`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "ImgBB upload failed");

    return data.data.url;
  };

  // ---- submit ----
  const onPost = async () => {
    if (isLoading) return;

    try {
      let imageUrl = preview;
      if (file) {
        imageUrl = await uploadToImgBB(file);
      }

      const payload = {
        title: title.trim(),
        content: editorData.trim(),
        tags,
        thumbnailUrl: imageUrl,
        ...(initialData?.status && { status: initialData.status }),
      };

      if (initialData) {
        // Edit existing blog
        await updateBlog({ id: initialData._id, ...payload }).unwrap();
      } else {
        // Create new blog
        await addBlog(payload).unwrap();
      }

      if (onClose) {
        onClose();
      } else {
        router.push("/blog");
      }
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to save. Please try again.");
    }
  };

  return (
    <div>
      {/* Header row */}
      <section className="lg:flex-row flex flex-col gap-8 justify-between">
        <div className="flex-1">
          <div className="flex justify-between bg-white rounded-3xl p-6 shadow-sm">
            <h4 className="font-medium text-3xl">
              {initialData ? "Edit Blog" : "Writing Blog"}
            </h4>
            <button
              onClick={onPost}
              className="bg-[#FF006A] text-white py-2 px-6 rounded-full"
              disabled={isLoading}
            >
              {isLoading
                ? initialData
                  ? "Updating..."
                  : "Posting..."
                : initialData
                ? "Update"
                : "Post"}
            </button>
          </div>

          {/* Title */}
          <div>
            <h4 className="font-medium text-[18px] py-4">Title</h4>
            <div className="bg-white p-6 rounded-3xl shadow-sm">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write an engaging blog title…"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF006A]"
              />
            </div>
          </div>

          {/* Editor */}
          <div className="mt-8">
            <QuillEditor
              initialText={editorData}
              onChange={(val) => setEditorData(val)}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:w-[30%]">
          {/* Thumbnail card */}
          <section className="bg-white rounded-3xl shadow-sm">
            <div className="px-6 pt-6">
              <div
                className="relative mx-auto w-[80%] aspect-[16/9] rounded-2xl overflow-hidden ring-1 ring-gray-200 bg-[#F6F4F5] flex items-center justify-center"
                onClick={openPicker}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" || e.key === " " ? openPicker() : null
                }
              >
                {preview ? (
                  <Image
                    alt="Thumbnail preview"
                    src={preview}
                    fill
                    className="object-cover"
                    sizes="(min-width:1024px) 24rem, 80vw"
                    priority
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 select-none">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm grid place-items-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="#111827"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Add Thumbnail</span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6">
              <SubTitle
                text={"Please Use JPEG Format With Non Transparent Background."}
              />
              {imgError && (
                <p className="mt-2 text-sm text-red-600">{imgError}</p>
              )}
            </div>

            <div className="px-8 flex w-full pb-8 pt-4 justify-between">
              <button
                onClick={openPicker}
                className="bg-[#FF006A] hover:opacity-90 transition text-white py-2 px-6 rounded-full"
              >
                Add Thumbnail
              </button>
              <button
                onClick={clearImage}
                className="bg-[#F6F4F5] hover:bg-[#eee] text-black py-2 px-6 rounded-full disabled:opacity-50"
                disabled={!preview}
              >
                Remove
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,.jpg,.jpeg"
                onChange={onPickFile}
                className="hidden"
              />
            </div>
          </section>

          {/* Tags card */}
          <section className="bg-white rounded-3xl mt-8 shadow-sm">
            <div>
              <h4 className="font-medium text-3xl p-6">Add tags</h4>
            </div>

            <div className="px-6">
              <SubTitle
                text={"Add multiple tags to help categorize your blog."}
              />
            </div>

            <div className="px-6 pb-8">
              <div className="mt-4 w-full rounded-2xl border border-gray-200 p-3 focus-within:ring-2 focus-within:ring-[#FF006A]">
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-3 py-1 text-sm"
                    >
                      {t}
                      <button
                        onClick={() => removeTag(t)}
                        className="rounded-full w-5 h-5 grid place-items-center text-gray-500 hover:text-black"
                        aria-label={`Remove ${t}`}
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={onTagKeyDown}
                    placeholder=""
                    className="flex-1 min-w-[120px] outline-none text-sm py-1"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
