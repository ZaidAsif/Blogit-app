'use client';

import { collection, onSnapshot } from 'firebase/firestore';


import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase-config';
import BlogCard from '@/components/blogCard';
import Loading from '@/components/loading';

type allBlogsType = {
    title: string;
    image?: string;
    tag: string;
    mark: string;
    slug: string;
    createdDate: Date;
}

export default function ShowBlogs() {

  const [allBlogs, setAllBlogs] = useState<allBlogsType[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  useEffect(() => {
    const collectionRef = collection(db, "blogs");

    const detachDataListener = onSnapshot(collectionRef, (querySnapshot) => {
      const dataArray: allBlogsType[] = [];
      querySnapshot.forEach((doc) => {
        dataArray.push(doc.data() as allBlogsType);
      });
      setAllBlogs(dataArray);
    });

    return () => detachDataListener();
  }, []);


  const filteredBlogs = selectedTag
    ? allBlogs.filter((blog: { tag: string; }) => blog.tag === selectedTag)
    : allBlogs;

  useEffect(() => {console.log(filteredBlogs) }, [filteredBlogs])
  return (
    <div className='width-full flex justify-around p-8 items-center'>
      <div className='width-5/5 flex justify-around flex-col'>
        <div className='flex justify-center'>
          <select 
            className="select select-bordered w-full max-w-xs  mb-8"
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            {/* <option disabled selected>Tag</option> */}
            <option value={''}>All</option>
            <option value={'coding'}>Coding</option>
            <option value={'education'}>Education</option>
            <option value={'health'}>Health</option>
            <option value={'sports'}>Sports</option>
            <option value={'news'}>News</option>
          </select>
        </div>

        <div>
          <div className='flex gap-8 flex-row flex-wrap justify-evenly'>
            {allBlogs.length > 0?
            filteredBlogs.map(({image, mark, slug, tag, title}) => (
              <BlogCard 
                key={slug + tag + title} 
                blogImage={image} 
                title={title}
                mark={mark} 
                slug={slug} 
                tag={tag} 
              />
            )): 
            <div className="flex justify-center width-full p-32">
            <Loading />
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}


