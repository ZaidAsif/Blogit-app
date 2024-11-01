export type blogType = {
    title: string | undefined;
    file: File | null | undefined;
    tag: string | undefined;
    mark: string | undefined;
    slug: string | undefined;
    firebaseId?: string
    pic?: string
    image?: File,
    createdDate: Date;
    editedDate?: Date;
  };

export type bc = {
  title: string | undefined; tag: string | undefined; mark: string | undefined; editedDate: Date; firebaseId: string | undefined; image: File | undefined; pic: string | undefined; uid?: string | undefined
}