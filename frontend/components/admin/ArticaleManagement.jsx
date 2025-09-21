'use client'
import React, { useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import article1 from '@/public/Dashboard/article/article1.png';
import article2 from '@/public/Dashboard/article/article2.png';
import article3 from '@/public/Dashboard/article/article3.png';
import article4 from '@/public/Dashboard/article/article4.png';
import author from '@/public/Dashboard/article/author.png';
import Image from "next/image";
import WritingBlog from "./WritingBlog";

export default function ArticleManagement() {
  const [activeTab, setActiveTab] = useState("all");

  const [addNewArticle, setAddNewArticle] = useState(false)
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "From Side Hustle to Full-Time: My Freelance Journey in 6 Months",
      date: "1 April 2025",
      author: "MD Farhad",
      image: article1,
      status: "active",
    },
    {
      id: 2,
      title: "How to Write a Proposal That Gets Noticed",
      date: "1 April 2025",
      author: "MD Farhad",
      image: article2,
      status: "active",
    },
    {
      id: 3,
      title: "From Side Hustle to Full-Time: My Freelance Journey in 6 Months",
      date: "1 April 2025",
      author: "MD Farhad",
      image: article3,
      status: "inactive",
    },
    {
      id: 4,
      title: "5 Habits of Highly Successful Freelancers",
      date: "1 April 2025",
      author: "MD Farhad",
      image: article4,
      status: "inactive",
    },
  ]);

  const toggleArticleStatus = (id) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === id 
          ? { ...article, status: article.status === "active" ? "inactive" : "active" } 
          : article
      )
    );
  };

  const filteredArticles = articles.filter((a) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return a.status === "active";
    if (activeTab === "inactive") return a.status === "inactive";
    return true;
  });

  return (
 <div>
       <div className={`p-4 ${addNewArticle ? 'hidden': 'block'}  `}>
      {/* Tabs + Add Button */}
      <section className="lg:flex justify-between items-center">
        <ul className="p-2 bg-white rounded-full flex items-center gap-2 shadow-sm">
          <li
            className={`py-2 px-4 rounded-full cursor-pointer ${
              activeTab === "all" ? "bg-[#FF006A] text-white" : "text-[#555]"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All ({articles.length})
          </li>
          <li
            className={`py-2 px-4 rounded-full cursor-pointer ${
              activeTab === "active" ? "bg-[#FF006A] text-white" : "text-[#555]"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active ({articles.filter(a => a.status === "active").length})
          </li>
          <li
            className={`py-2 px-4 rounded-full cursor-pointer ${
              activeTab === "inactive"
                ? "bg-[#FF006A] text-white"
                : "text-[#555]"
            }`}
            onClick={() => setActiveTab("inactive")}
          >
            Inactive ({articles.filter(a => a.status === "inactive").length})
          </li>
        </ul>

        <button  onClick={()=>{setAddNewArticle(true)}} className="bg-[#FF006A] rounded-full mt-4 lg:mt-0 mx-auto lg:mx-0 px-5 py-3 cursor-pointer text-white flex items-center gap-2 shadow-md">
          <FiPlus className="text-lg" />
          <span>Add New Article</span>
        </button>
      </section>

      {/* Article List */}
      <section className="mt-6 space-y-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-2xl p-4 lg:flex items-center justify-between shadow"
          >
            {/* Left Side: Image + Info */}
            <div className="flex items-center gap-4">
              <Image
                src={article.image}
                alt={article.title}
                className="w-20 h-18 object-cover rounded-xl"
                width={200}
                height={200}
              />
              <div>
                <h3 className="font-semibold text-[#141414]">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {article.date} |{" "}
                  <span className="inline-flex items-center gap-1">
                    <Image
                      src={author}
                      alt="author"
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="mt-2">{article.author}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* Right Side: Status Toggle + Actions */}
            <div className="flex items-center gap-4">

                
              {/* Status Toggle Switch */}
              <div
                className={`${
                  article.status === "active" ? "bg-[#FF006A] " : "bg-[#3D3D3D]"
                } w-22 h-7 p-2 cursor-pointer rounded-2xl  transition-colors duration-300 relative`}
                onClick={() => toggleArticleStatus(article.id)}
              >
                         
              {
                article.status === 'active' &&   <span className="text-white ml-2 -mt-1 absolute text-sm mr-8">Active</span>
              }
                <div
                  className={`${
                    article.status === "active" ? "translate-x-7 -mt-[10px] mb-4 w-5 h-8 bg-white rounded-full ml-8 " : "translate-x-0 w-5 -mt-[10px]  h-8 bg-white rounded-full -ml-2 -mb-4"
                  }  transition-all duration-300`}
                  style={{boxShadow: "1px 2px 5px 2px rgb(0,0,0,0.1)"}}
                > 
                 {
                    article.status !== "active" && <span className="text-white absolute text-center ml-6 mr-8 text-sm mt-[4px] ">Inactive</span>
                 }
       
                </div>
              </div>
              
              {/* Status Label */}
              {/* {article.status === "active" ? (
                <span className="bg-[#FF006A] text-white text-xs px-3 py-1 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                  Inactive
                </span>
              )} */}

              {/* Edit + Delete */}
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FiEdit />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 text-red-500">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>

    {/* writing blog */}


    <section>


        {
            addNewArticle && <WritingBlog/>
        }
    </section>
 </div>
  );
}

