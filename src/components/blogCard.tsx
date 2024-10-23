'use client'

import { BlogCardType } from "@/types/blogCardType";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function BlogCard({blogImage, title, mark, slug, tag} : BlogCardType) {
    const route = useRouter();

  return (
    <div className="max-w-96 h-auto rounded-lg overflow-hidden shadow-lg border border-neutral-300 bg-white text-black relative">
      <figure className="relative h-48">
        {blogImage ? (
          <img
            src={blogImage}
            alt="blog image"
            className="object-cover w-full h-full"
            width={350}
            height={350}
          />
        ) : null}
      </figure>
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-2 line-clamp-1 ">{title}</h2>
        <div className="flex justify-center flex-wrap gap-2 mb-3">
          <div className="badge badge-neutral badge-outline bg-red-100">{tag}</div>
        </div>
        <div className="text-center line-clamp-4 mb-4">
          {<ReactMarkdown>{mark}</ReactMarkdown>}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => route.push(`/blog/${slug}`)}
            className="btn btn-neutral flex items-center"
          >
            Read blog 
          </button>
        </div>
      </div>
    </div>
  );
}