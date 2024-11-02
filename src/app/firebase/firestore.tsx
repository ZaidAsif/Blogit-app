
  

import { bc } from "@/types/blogType";
import { auth, db, storage } from "./firebase-config";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

type newBlogType = {
    title?: string,
    tag?: string,
    mark?: string,
    uid?: string,
    editedDate?: Date,
    image?: string
}

export async function updateBlog({
    title,
    tag,
    mark,
    editedDate,
    firebaseId,
    image,
}: bc) {
    const uid = auth.currentUser?.uid;

    if (!uid) {
        toast.error("User is not authenticated!");
        return;
    }

    if (!firebaseId) {
        toast.error("Invalid blog ID!");
        return;
    }

    try {
        const newBlog: newBlogType = {
            title,
            tag,
            mark,
            uid,
            editedDate,
        };

        // Upload image only if a new file is provided
        if (image) {
            const imageURL = await uploadImage(image);
            if (imageURL) {
                newBlog.image = imageURL; // Store the URL instead of the file
            }
        }

        const collectionRef = doc(db, "blogs", firebaseId);
        await updateDoc(collectionRef, newBlog);


        toast.success("Blog edited successfully!");
    } catch (error) {
        console.error("Error updating blog:", error);
        toast.error("Failed to edit the blog.");
    }
}

async function uploadImage(image: File) {
    const imageRef = ref(storage, `uploads/images/${Date.now()}-${image.name}`);
    const uploadTask = uploadBytesResumable(imageRef, image);

    return new Promise<string>((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
            },
            (error) => {
                console.error("Upload error: ", error);
                reject(error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log("File available at", downloadURL);
                resolve(downloadURL);
            }
        );
    });
}
