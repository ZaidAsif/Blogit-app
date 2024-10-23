export type BlogCardType = {
    blogImage?: string,
    title: string,
    mark: string,
    slug: string,
    tag: string
}

export type CardData = {
    dataCreated?:Date;
    firebaseId?: string;
    image?: string;
    title?: string;
    mark?: string;
    slug?: string;
    tag?: string;
  };