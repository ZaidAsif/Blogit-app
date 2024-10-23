'use client';

import Link from "next/link";


export default function home() {


  return (
  <div className="w-full p-8">
    <div
  className="hero min-h-screen"
  style={{
    backgroundImage: "url(https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D)",
  }}>
  <div className="hero-overlay bg-opacity-60"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold">Welcome to <span className="text-red-500 font-bold">Blog</span><span className="text-black font-bold">it</span></h1>
      <p className="mb-5 text-m">
      Welcome to a Blogit where ideas flourish and stories unfold! Our blogging platform is more than just a collection of articles—it's a community of passionate voices sharing insights, experiences, and inspiration. From thought-provoking essays to lighthearted tales, there's something for everyone. Here, you can immerse yourself in a tapestry of creativity and knowledge, connecting with writers and readers who share your interests. Step in and let your curiosity lead the way; your next great adventure in reading starts here! 
      </p>
      <p className="font-bold text-xl">You can start even without an account</p>
      <Link href={'/home'} className="btn btn-error">Get Started</Link>
    </div>
  </div>
</div>
  </div>
  );
}

