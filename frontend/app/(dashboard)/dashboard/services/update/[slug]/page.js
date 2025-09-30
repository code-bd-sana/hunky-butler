"use client";

import {
  useGetServiceQuery,
  useUpdateServiceMutation,
} from "@/features/services/servicesApi";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const UpdateService = ({ params }) => {
  const { slug } = params;
  const { data: service, isLoading, isError } = useGetServiceQuery(slug);
  const [updateService] = useUpdateServiceMutation();

  const fileRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    includes: ["", "", "", ""],
    faqs: [{ question: "", answer: "" }],
    bannerFile: null,
    bannerPreview: "",
  });

  // যখন service আসবে তখন form এ সেট করো
  useEffect(() => {
    if (service) {
      // Ensure every FAQ has question and answer keys
      const normalizedFaqs = service.faqs?.map((f) => ({
        question: f.question || f.q || "",
        answer: f.answer || f.a || "",
      })) || [
        { question: "", answer: "" },
        { question: "", answer: "" },
      ];

      setForm({
        name: service.name || "",
        description: service.description || "",
        includes: service.included?.length
          ? service.included
          : ["", "", "", ""],
        faqs: normalizedFaqs,
        bannerFile: null,
        bannerPreview: service.banner || "",
      });
    }
  }, [service]);

  // // Handle includes update
  // const setInclude = (idx, val) => {
  //   setForm((p) => {
  //     const includes = [...p.includes];
  //     includes[idx] = val;
  //     return { ...p, includes };
  //   });
  // };

  // // Handle FAQ update
  // const setFaq = (idx, key, val) => {
  //   setForm((p) => {
  //     const faqs = [...p.faqs];
  //     faqs[idx] = { ...faqs[idx], [key]: val };
  //     return { ...p, faqs };
  //   });
  // };

  const addFaq = () => {
    setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));
  };

  const handleRemove = () => {
    setForm((p) => ({ ...p, bannerFile: null, bannerPreview: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleIncludeChange = (index, value) => {
    const updated = [...form.includes];
    updated[index] = value;
    setForm({ ...form, includes: updated });
  };

  const handleFaqChange = (index, key, value) => {
    const updated = [...form.faqs];
    updated[index][key] = value;
    setForm({ ...form, faqs: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("slug", service.slug);
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("includes", JSON.stringify(form.includes));
      formData.append("faqs", JSON.stringify(form.faqs));

      if (form.bannerFile) {
        formData.append("banner", form.bannerFile); // actual file
      }

      const updated = await updateService(formData).unwrap();
      console.log("Updated service:", updated);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f4f5]">
      <main className="mx-auto max-w-7xl px-5 pb-14">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 bg-white p-8 rounded-2xl"
        >
          {/* LEFT: Inputs */}
          <div>
            {/* Service Name */}
            <label className="block">
              <div className="text-[18px] font-medium mb-2">Service Name</div>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Enter Your Service Name"
                className="w-full rounded-[24px] border px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#FF006A]"
              />
            </label>

            {/* Description */}
            <div className="mt-6">
              <div className="text-[18px] font-medium mb-2">Description</div>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe How Your Service Works"
                className="w-full h-44 resize-none rounded-[24px] border px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#FF006A]"
              />
            </div>

            {/* Includes */}
            <div className="mt-6">
              <div className="text-[18px] font-medium mb-3">
                What Is Included In This Service?
              </div>
              <div className="space-y-3">
                {form.includes.map((val, i) => (
                  <input
                    key={i}
                    value={val}
                    onChange={(e) => handleIncludeChange(i, e.target.value)}
                    placeholder="Click To Write Here"
                    className="w-full rounded-[24px] border px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#FF006A]"
                  />
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="mt-8">
              <div className="text-[18px] font-medium mb-3">FAQ’s</div>
              <div className="space-y-5">
                {form.faqs.map((faq, index) => (
                  <div key={index} className="mb-4 border p-2 rounded">
                    <input
                      type="text"
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) =>
                        handleFaqChange(index, "question", e.target.value)
                      }
                      className="border p-2 w-full mb-2"
                    />
                    <textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) =>
                        handleFaqChange(index, "answer", e.target.value)
                      }
                      className="border p-2 w-full"
                    />
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
          <aside>
            <div className="rounded-2xl bg-white p-4">
              <div className="text-[16px] font-semibold mb-3">
                Add Service Page Banner
              </div>
              <div className="relative rounded-[14px] border h-[180px] flex items-center justify-center bg-[#FBFAFC]">
                {form.bannerPreview ? (
                  <Image
                    src={form.bannerPreview}
                    alt="Service banner"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="text-gray-500">No Banner</div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setForm((p) => ({
                      ...p,
                      bannerFile: file,
                      bannerPreview: URL.createObjectURL(file), // <-- show preview
                    }));
                  }
                }}
              />

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

            <button
              type="submit"
              className="mt-4 ml-5 rounded-full bg-[#FF006A] px-4 py-3 text-white text-sm font-medium shadow-sm hover:opacity-95 active:opacity-90 transition"
            >
              Update The Service
            </button>
          </aside>
        </form>
      </main>
    </div>
  );
};

export default UpdateService;
