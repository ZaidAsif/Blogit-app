'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import style from '@/app/dashboard/addBlog/addBlog.module.css';
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "@/app/firebase/firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ReactMarkdown from "react-markdown";


export default function AddBlog() {
    const router = useRouter();

    const [title, setTitle] = useState<string | undefined>();
    const [mark, setMark] = useState<string | undefined>();
    const [tag, setTag] = useState<string | undefined>();
    const [image, setImage] = useState<File | undefined>();

    function makeSlug(title: string) {
        if (!title) return

        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }


    const addBlog = async () => {
        if (!title || !mark || !tag || !image) return

        const slug = makeSlug(title as string)

        const date = new Date

        const uid = auth?.currentUser?.uid;



        const collectionRef = collection(db, 'blogs');

        try {
            const uploadImage = async () => {
                if (!image) {
                    console.error('error: upload image')
                    return null
                }

                const imageRef = ref(storage, `images/blog-${Date.now()}-${image.name}`);

                const uploadTask = uploadBytesResumable(imageRef, image);

                return await new Promise((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Upload is ${progress}% done`);
                        },
                        (error) => {
                            console.error("Error during file upload:", error);
                            reject(error);
                        },
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log("File available at", downloadURL);
                            resolve(downloadURL);
                        }
                    );
                })



            }

            const imageUrl = await uploadImage();

            const blogObj = {
                title,
                slug,
                tag,
                mark,
                image: imageUrl,
                uid,
                dateCreated: date
            }

            const docRef = await addDoc(collectionRef, blogObj);

            const docUpdateRef = doc(db, 'blogs', docRef.id);

            await updateDoc(docUpdateRef, {firebaseId: docRef.id,})

            router.push('/dashboard')
            

        } catch (e) {
            console.error('error:', e);
        }


    }

    return (
        <div className='flex w-5/5 justify-between '>
            <div className={`flex  flex-col justify-center items-center ${style.itemHeight}`}>
                <div
                    className={`card bg-base-100 shadow-xl flex p-5 ${style.itemHeight}`}
                    style={{ background: '#fff9f9' }}
                >
                    <h1 className={`${style.formh1}`}>Add Blog</h1>

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

                    <button className="btn glass text-xl" onClick={addBlog}>
                        Add-Blog
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