"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

export default function Page() {
  const [bannerUrl, setBannerUrl] = useState("");
  const fileRef = useRef(null);

  async function handleUpload(file) {
    // TODO: upload to your backend and get a real URL
    const url = URL.createObjectURL(file);
    setBannerUrl(url);
  }

  function handleRemove() {
    if (!bannerUrl) return;
    setBannerUrl("");
    if (fileRef.current) fileRef.current.value = "";
    // TODO: backend to delete
  }

  // Form State
  const [form, setForm] = useState({
    name: "",
    description: "",
    includes: ["", "", "", ""],
    faqs: [
      { q: "", a: "" },
      { q: "", a: "" },
    ],
  });

  const setInclude = (idx, val) =>
    setForm((p) => {
      const includes = [...p.includes];
      includes[idx] = val;
      return { ...p, includes };
    });

  const setFaq = (idx, key, val) =>
    setForm((p) => {
      const faqs = [...p.faqs];
      faqs[idx] = { ...faqs[idx], [key]: val };
      return { ...p, faqs };
    });

  const addFaq = () =>
    setForm((p) => ({ ...p, faqs: [...p.faqs, { q: "", a: "" }] }));

  function saveService(e) {
    e.preventDefault();
    const payload = { ...form, bannerUrl };
    // TODO: connect to API:
    // await fetch("/api/services", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) })
    console.log("SUBMIT", payload);
    alert("Service saved (see console). Wire your API in saveService().");
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f4f5]">
      {/* TOP NAV */}
      <div className="mx-auto max-w-7xl px-4 sm:px-5 pt-6">
        <div className="rounded-[24px] bg-white">
          {/* Stack on mobile, row on md+ */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 sm:px-6 sm:py-4">
            {/* Breadcrumb */}

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

            {/* Save button */}
            <button
              onClick={saveService}
              className="w-full md:w-auto rounded-full bg-[#FF006A] px-4 py-3 md:py-2.5 text-white text-sm font-medium shadow-sm hover:opacity-95 active:opacity-90 transition"
            >
              Save The Service
            </button>
          </div>
        </div>
      </div>

      {/* MAIN GRID  */}
      <main className="mx-auto max-w-7xl px-5 pb-14">
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/*  LEFT: FORM CARD  */}
          <form
            onSubmit={saveService}
            className="rounded-2xl bg-white py-8 px-8 lg:px-16"
          >
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
                className="w-full rounded-[24px] placeholder:text-[#3D3D3D]  placeholder:text- border border-[#EFE7EA] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#FF006A]"
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
                className="w-full h-44 resize-none placeholder:text-[#3D3D3D] rounded-[24px] border border-[#EFE7EA] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#FF006A]"
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
                    className="w-full rounded-[24px] placeholder:text-[#3D3D3D] border border-[#EFE7EA] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#FF006A]"
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

                    {/* grouped card with single border + inner divider */}
                    <div className="rounded-[20px] border border-[#EFE7EA] overflow-hidden bg-white">
                      <input
                        value={f.q}
                        onChange={(e) => setFaq(idx, "q", e.target.value)}
                        placeholder="Add Question"
                        className="block w-full px-4 py-3.5 text-sm placeholder:text-[#3D3D3D] outline-none focus:ring-2 focus:ring-[#FF006A] border-0 border-b border-[#F2EBEE]"
                      />
                      <input
                        value={f.a}
                        onChange={(e) => setFaq(idx, "a", e.target.value)}
                        placeholder="Add Answer"
                        className="block w-full px-4 py-3.5 text-sm placeholder:text-[#3D3D3D] outline-none focus:ring-2 focus:ring-[#FF006A] border-0"
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
          </form>

          {/*  RIGHT: BANNER CARD  */}
          <aside className="lg:pt-2">
            <div className="rounded-2xl bg-white p-4">
              <div className="text-[16px] font-semibold text-[#333333] mb-3">
                Add Service Page Banner
              </div>

              {/* Preview box */}
              <div className="relative rounded-[14px] border border-[#EFE7EA] h-[180px] overflow-hidden flex items-center justify-center bg-[#FBFAFC]">
                {bannerUrl ? (
                  <Image
                    src={bannerUrl}
                    alt="Service banner"
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="320px"
                    onError={() => setBannerUrl("")}
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
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                }}
              />

              {/* Change / Remove row — always visible (Figma) */}
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
                  disabled={!bannerUrl}
                  className={`text-[12px] ${
                    bannerUrl
                      ? "text-gray-600 hover:underline"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  aria-disabled={!bannerUrl}
                >
                  Remove
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
