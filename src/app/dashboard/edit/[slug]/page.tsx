'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from '@/app/dashboard/edit/[slug]/slug.module.css'
import {  collection,  getDocs, query, where } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import {  db } from "@/app/firebase/firebase-config";
import {  CardData } from "@/types/blogCardType";
import { updateBlog } from "@/app/firebase/firestore";


export default function EditBlog({ params }: { params: { slug: string } }) {
    const router = useRouter();

    const [title, setTitle] = useState<string | undefined>();
    const [mark, setMark] = useState<string | undefined>();
    const [tag, setTag] = useState<string | undefined>();
    const [image, setImage] = useState<File | undefined>();
    const [pic, setPic] = useState<string | undefined>();
    const [blogData, setBlogData] = useState<CardData | undefined>();



    // function makeSlug(title: string) {
    //     if (!title) return

    //     return title
    //         .toLowerCase()
    //         .trim()
    //         .replace(/[^a-z0-9\s-]/g, '')
    //         .replace(/\s+/g, '-')
    //         .replace(/-+/g, '-');
    // }

    useEffect(() => {
        if (params.slug) {
            fetchBlog();
        }
    }, [params.slug])

    useEffect(() => {
        if (blogData) {
            console.log(blogData);
            setTitle(blogData.title);
            setMark(blogData.mark);
            setTag(blogData.tag);
            setPic(blogData.image);
        }
    }, [blogData])

    const fetchBlog = async () => {
        try {
            let collectionRef = collection(db, 'blogs');
            let q = where('slug', '==', params.slug);

            let blogQuery = query(collectionRef, q);

            const querySnapshot = await getDocs(blogQuery);
            querySnapshot.forEach((doc) => {
                setBlogData(doc.data() as CardData);
            })
        } catch (e) {
            console.error(e);
        }
    }


   

    return (
        <div className='flex w-5/5 justify-between '>
            <div className={`flex  flex-col justify-center items-center m-0 ${style.itemHeight}`}>
                <div
                    className={`card bg-base-100 shadow-xl flex p-5 ${style.itemHeight}`}
                    style={{ background: '#fff9f9' }}
                >
                    <h1 className={`${style.formh1}`}>Edit Blog</h1>

                    <br />

                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="text"
                            className="grow"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>

                    <br />


                    <textarea
                        className="textarea textarea-bordered h-96"
                        placeholder="Type content in markdown format"
                        value={mark}
                        onChange={(e) => setMark(e.target.value)}

                    />

                    <br />

                    <select
                        className="select w-full max-w-xs"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                    >
                        <option disabled selected>Tags</option>
                        <option value={'coding'}>Coding</option>
                        <option value={'education'}>Education</option>
                        <option value={'health'}>Health</option>
                        <option value={'sports'}>Sports</option>
                        <option value={'news'}>News</option>
                    </select>

                    <br />

                    <input
                        type="file"
                        className="file-input file-input-bordered w-full max-w-xs"
                        onChange={(e) => {
                            let files = e.target.files
                            if (files?.length) {
                                setImage(files[0]);
                            }
                        }}
                    />

                    <br />

{                 pic &&   <label htmlFor="previous-image">Previous Image:
                    <img src={pic} alt="previous-image" id="previous-image" height={150} width={150}/>
                    </label>
}
                    <br />

                    <button className="btn glass text-xl" onClick={() => {
                        updateBlog({title, tag, mark, editedDate: new Date, firebaseId: blogData?.firebaseId, image: image? image : undefined, pic}); 
                        router.push('/dashboard')
                }}>
                        Edit-Blog
                    </button>
                </div>
            </div>
            <div className={`flex  flex-col justify-center items-center ${style.itemHeight}`}>
                <div
                    className={`card bg-base-100 shadow-xl flex p-5 ${style.itemHeight}`}
                    style={{ background: '#fff9f9' }}
                >
                    <h1 className={`${style.formh1}`}>Preview</h1>

                    <br />

                    {/* <div> */}
                    <ReactMarkdown>{mark && mark}</ReactMarkdown>
                    {/* </div> */}

                </div>
            </div>
        </div>
    )
}