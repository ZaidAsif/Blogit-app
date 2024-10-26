"use client";

import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { CardData } from "@/types/blogCardType";
import { db } from "../firebase/firebase-config";
import Loading from "@/components/loading";

export default function Dashboard() {
  const [cards, setCards] = useState<CardData[]>([]);
  const route = useRouter();

  const deleteBlog = async (firebaseId: string) => {
    await deleteDoc(doc(db, 'blogs', firebaseId));
  }

  useEffect(() => {
    const collectionRef = collection(db, "blogs");
      // const querySnapshot = await getDocs(collectionRef);
      // const dataArray: CardData[] = [];
      // querySnapshot.forEach((doc) => {
      //   dataArray.push(doc.data() as CardData);
      // });
      const detachListener = onSnapshot(collectionRef, (snapShot) => {
        const dataArr: CardData[] = []
        snapShot.forEach((doc) => {
          const singleBlog = doc.data();
        dataArr.push(singleBlog);
        })
        setCards(dataArr);
      })

    return () => detachListener();
  }, []);
  return (
    <>

     <div className="overflow-x-auto">
        <div className="text-center">
        <Link href={"/dashboard/addBlog"}  className="btn m-5 btn-outline">
            Add Blog
        </Link>
        </div>
        {cards.length !== 0 ? ( 
        <table className="table">
          <thead>
            <tr>
              <th>Blog Title</th>
              <th>Tag</th>
            </tr>
          </thead>
          <tbody>
          {cards.map(({ image, title, tag, slug, firebaseId }) => (
            <tr key={title}>
                  <th>
                    <div className="flex items-center gap-3 hover:cursor-pointer"
                     onClick={() => route.push(`/blog/${slug}`)}>
                      <div
                        className="avatar "
                        onClick={() => route.push(`/blog/${slug}`)}
                      >
                        <div className="mask mask-squircle h-20 w-20">
                          {image ? (
                            <img
                              src={image}
                              alt="image"
                              width={100}
                              height={100}
                            />
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-l">{title}</div>
                      </div>
                    </div>
                  </th>
                  <td>
                    <span className="badge badge-ghost badge-m">{tag}</span>
                  </td>
                  <th>
                  <button
                      className="btn btn-info  m:btn-xs lg:btn-sm"
                      onClick={() => {
                        route.push(`/dashboard/edit/${slug}`);
                      }}
                    >
                      Edit
                    </button>
                  </th>
                  <th>
                  <button
                      className="btn btn-error m:btn-xs lg:btn-sm"
                      onClick={() => {
                        deleteBlog(firebaseId as string);
                        toast.success("Deleted !")
                      }}
                    >
                      Delete
                    </button>
                  </th>
                </tr>
          ))}
          </tbody>
        </table>)
        : (
          <div className="w-full flex align-center justify-center">
        <Loading />
        </div>
        )
}
      </div>

      
    </>
  );
}