'use client';

import { auth, db } from "@/app/firebase/firebase-config";
import Loading from "@/components/loading";
import { addDoc, collection, DocumentData, getDocs, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// type CommentsType = {
//   comment: string,
//   userUid: string,
//   createdAt: string
// }

export default function BlogDetails({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<DocumentData | null>(null);
  const [newComment, setNewComment] = useState<string>('');

  const [allComments, setAllComments] = useState<DocumentData[] | []>([]);

  const route = useRouter();


  function formatDate(timestamp: { seconds: number; nanoseconds: number }): string {
    // Convert Firestore timestamp to milliseconds
    const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
    const date = new Date(milliseconds);

    // Helper function to pad single-digit numbers with leading zeros
    const pad = (num: number) => String(num).padStart(2, '0');

    // Extract date components
    const day = pad(date.getUTCDate());
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());

    // Format the date string
    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }

  const fetchBlog = async () => {
    if (params.slug) {
      try {
        const collectionRef = collection(db, 'blogs');
        const q = where('slug', '==', params.slug);
        const blogQ = query(collectionRef, q);

        const querySnapshot = await getDocs(blogQ);
        querySnapshot.forEach((doc) => {
          setBlog(doc.data())
        })
      } catch (e) {
        console.log('error: ', e)
      }
    };

  }

  const addNewComment = async () => {
    const collectionRef = collection(db, `blogs/${blog?.firebaseId}/comments`);
    const commentObj = {
      userUid: auth?.currentUser?.uid,
      comment: newComment,
      createdAt: formatCommentDate(new Date())
    }

    await addDoc(collectionRef, commentObj);
    setNewComment('');  
  }

  function formatCommentDate(date: Date) {
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) {
      return "Invalid Date"; // Handle invalid dates more clearly
    }
  
    // Create formatters for date and time
    const formatterDate = new Intl.DateTimeFormat(undefined, {
      weekday: 'long', // Day name (e.g., Tuesday)
      year: 'numeric', // Full year (e.g., 2024)
      month: 'long',   // Full month name (e.g., October)
      day: 'numeric',  // Day of the month (e.g., 18)
    }).format(validDate);
  
    const formatterTime = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',    // Hours (e.g., 4 PM)
      minute: 'numeric',  // Minutes (e.g., 30)
      hour12: true,       // 12-hour format (can remove for 24-hour format)
    }).format(validDate);
  
    // Return the formatted date and time as a single string
    return `${formatterDate}, ${formatterTime}`;
  }

  useEffect(() => {
    
    
      const collectionRef = collection(db, `blogs/${blog?.firebaseId}/comments`);
  const detachListener = onSnapshot(collectionRef, (snapShot) => {
    const dataArr: DocumentData[] = []
    snapShot.forEach((doc) => {
    const singleComment = doc.data();
    dataArr.push(singleComment);
    })
    setAllComments(dataArr);
  })

return () => detachListener();
}, [blog]);

  useEffect(() => {
    fetchBlog();
    console.log(blog);

  }, [params.slug, route])

  useEffect(() => console.log(blog, blog?.mark), [blog, auth.currentUser])
  useEffect(() => console.log(allComments), [allComments])
  

  return (
    <>
        <div  className="ml-16 t-8 fixed text-center flex">
          <Link href={'/home'} className="text-m font-bold"><img src="https://cdn-icons-png.flaticon.com/128/11519/11519951.png" alt="backtohome" className="w-10 h10 inline"/>Back to Home</Link>
          </div>

      {
        blog ? (
          <>
            <div className="max-w-4xl mx-auto px-2 py-8 mb-30">
              <img
                className="w-full rounded-lg shadow-md h-auto"
                src={blog.image}
                alt="Blog Image"
                width={550}
                height={550}
              />

              <h1 className="mt-6 text-4xl font-bold text-gray-900 text-center font-sans ">
                {blog.title}
              </h1>

              <div className="text-center mt-4 text-gray-600">
                <div className="mb-2">
                  
                  <span className="inline-flex items-center px-2 py-1 badge badge-neutral badge-outline bg-red-300 font-semibold ">
                    {blog.tag}
                  </span>
                </div>

                <div className="mb-4 prose">
                  <span className="font-bold ">Created At:</span>{" "}
                  <span className="font-medium italic">{`${formatDate(blog.dateCreated)}     `}</span>
                  {blog.editedDate ? (
                    <>
                      |<span className="font-bold">     Edited At:</span>{" "}
                      <span className="font-medium">{blog.editedDate && formatDate(blog.editedDate)}</span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="prose prose-lg text-gray-800">
                <ReactMarkdown  remarkPlugins={[remarkGfm]} className="prose">{blog.mark}</ReactMarkdown>
              </div>

            </div>
            <div className="max-w-4xl mx-auto px-4 py-10 flex place-items-center flex-col gap-4">
              <p className="text-2xl font-bold ">Comments:</p>
              {auth.currentUser ? (
                <>
                <textarea
                  placeholder="comment"
                  className="textarea textarea-error textarea-md w-full max-w-xs "
                  value={newComment}
                  onChange={(e) => {setNewComment(e.target.value)}}
                  ></textarea>
                  <button className="btn btn-outline btn-sm" onClick={addNewComment}>Add</button>
                  </>
              ) : (
                <textarea
                  placeholder="Account required to comment"
                  className="textarea textarea-bordered textarea-md w-full max-w-xs" disabled></textarea>
              )
              }

              {
                allComments.map(({comment, createdAt}) => (
                  <div key={comment + createdAt} className="chat chat-start w-2/5">
                    <div className="chat-bubble">
                    <p className="font-semibold text-sm">{formatCommentDate(createdAt)}</p>
                    <p>{comment}</p>
                  </div>
                  </div>
                ))
              }

            </div>
          </>


        ) : (
          <div className="flex justify-center width-full p-32">
            <Loading />
          </div>
        )
      }
    </>
  )
}