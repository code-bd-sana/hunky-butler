"use client";

import React, { useRef, useState } from "react";
import { useAddServiceMutation } from "@/features/services/servicesApi";
import Image from "next/image";

export default function Page() {
  const fileRef = useRef(null);
  const [addService] = useAddServiceMutation();

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    includes: ["", "", "", ""],
    faqs: [
      { q: "", a: "" },
      { q: "", a: "" },
    ],
    bannerFile: null, // local file
    bannerPreview: "", // ImgBB URL
  });

  // Handle includes and FAQ updates
  const setInclude = (idx, val) => {
    setForm((p) => {
      const includes = [...p.includes];
      includes[idx] = val;
      return { ...p, includes };
    });
  };

  const setFaq = (idx, key, val) => {
    setForm((p) => {
      const faqs = [...p.faqs];
      faqs[idx] = { ...faqs[idx], [key]: val };
      return { ...p, faqs };
    });
  };

  const addFaq = () => {
    setForm((p) => ({ ...p, faqs: [...p.faqs, { q: "", a: "" }] }));
  };

  // Upload banner to ImgBB
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=08dd2c25fadca9984c9fe58a66d619e7`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) {
        setForm((p) => ({
          ...p,
          bannerFile: file,
          bannerPreview: data.data.url,
        }));
        console.log("Image uploaded to ImgBB:", data.data.url);
      } else {
        alert("Image upload failed!");
      }
    } catch (err) {
      console.error("ImgBB upload error:", err);
      alert("Image upload failed!");
    }
  };

  const handleRemove = () => {
    setForm((p) => ({ ...p, bannerFile: null, bannerPreview: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  // Save service
  const saveService = async (e) => {
    e.preventDefault();

    console.log("Submitting Form Data:");
    console.log(form);

    const payload = {
      name: form.name,
      description: form.description,
      includes: form.includes,
      faqs: form.faqs,
      bannerUrl: form.bannerPreview,
    };

    try {
      const res = await addService(payload).unwrap();
      console.log("Service saved:", res);
      alert("Service successfully saved!");
      // Reset form
      setForm({
        name: "",
        description: "",
        includes: ["", "", "", ""],
        faqs: [
          { q: "", a: "" },
          { q: "", a: "" },
        ],
        bannerFile: null,
        bannerPreview: "",
      });
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Error saving service.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f4f5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 pt-6">
        <div className="rounded-[24px] bg-white">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 sm:px-6 sm:py-4">
            <div>
              <h1 className="text-[#141414] font-medium text-[24px]">
                Add New Service
              </h1>
              <div className="text-[12px] sm:text-sm text-[#333333] flex items-center min-w-0">
                <span className="shrink-0">Services</span>
                <span className="mx-2 shrink-0">›</span>
                <span className="truncate">Add New Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 pb-14">
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <form
            onSubmit={saveService}
            className="max-w-7xl mx-auto rounded-2xl bg-white py-8 px-8 lg:px-16 lg:col-span-2 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6"
          >
            {/* LEFT: Inputs */}
            <div>
              {/* Service Name */}
              <label className="block">
                <div className="text-[18px] font-medium text-[#141414] mb-2">
                  Service Name
                </div>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Enter Your Service Name"
                  className="w-full rounded-[24px] border border-[#EFE7EA] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#FF006A]"
                />
              </label>

              {/* Description */}
              <div className="mt-6">
                <div className="text-[18px] font-medium text-[#141414] mb-2">
                  Description
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Describe How Your Service Works"
                  className="w-full h-44 resize-none rounded-[24px] border border-[#EFE7EA] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#FF006A]"
                />
              </div>

              {/* Includes */}
              <div className="mt-6">
                <div className="text-[18px] font-medium text-[#141414] mb-3">
                  What Is Included In This Service?
                </div>
                <div className="space-y-3">
                  {form.includes.map((val, i) => (
                    <input
                      key={i}
                      value={val}
                      onChange={(e) => setInclude(i, e.target.value)}
                      placeholder="Click To Write Here"
                      className="w-full rounded-[24px] border border-[#EFE7EA] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#FF006A]"
                    />
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-8">
                <div className="text-[18px] font-medium text-[#141414] mb-3">
                  FAQ’s
                </div>
                <div className="space-y-5">
                  {form.faqs.map((f, idx) => (
                    <div key={idx}>
                      <div className="text-[11px] text-[#9A9497] mb-1">{`FAQ-${
                        idx + 1
                      }`}</div>
                      <div className="rounded-[20px] border border-[#EFE7EA] overflow-hidden bg-white">
                        <input
                          value={f.q}
                          onChange={(e) => setFaq(idx, "q", e.target.value)}
                          placeholder="Add Question"
                          className="block w-full px-4 py-3.5 text-sm outline-none border-b border-[#F2EBEE]"
                        />
                        <input
                          value={f.a}
                          onChange={(e) => setFaq(idx, "a", e.target.value)}
                          placeholder="Add Answer"
                          className="block w-full px-4 py-3.5 text-sm outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="mt-4 text-[16px] font-semibold text-[#FF006A] hover:underline"
                >
                  Add New FAQ
                </button>
              </div>
            </div>

            {/* RIGHT: Banner upload */}
            <aside className="lg:pt-2">
              <div className="rounded-2xl bg-white p-4">
                <div className="text-[16px] font-semibold text-[#333333] mb-3">
                  Add Service Page Banner
                </div>

                {/* Preview box */}
                <div className="relative rounded-[14px] border border-[#EFE7EA] h-[180px] overflow-hidden flex items-center justify-center bg-[#FBFAFC]">
                  {form.bannerPreview ? (
                    <Image
                      src={form.bannerPreview}
                      alt="Service banner"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <div className="text-xl leading-none">＋</div>
                      <div className="mt-2 text-[11px] text-gray-500">
                        Click To Add Image
                      </div>
                    </button>
                  )}
                </div>

                {/* Hidden file picker */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />

                {/* Change / Remove */}
                <div className="mt-3 flex items-center justify-around px-1">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-[12px] font-semibold text-[#FF2E8B] hover:underline"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={!form.bannerPreview}
                    className={`text-[12px] ${
                      form.bannerPreview
                        ? "text-gray-600 hover:underline"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Save button */}
              <button
                type="submit"
                className="mt-4 ml-5 rounded-full bg-[#FF006A] px-4 py-3 text-white text-sm font-medium shadow-sm hover:opacity-95 active:opacity-90 transition"
              >
                Save The Service
              </button>
            </aside>
          </form>
        </div>
      </main>
    </div>
  );
}
