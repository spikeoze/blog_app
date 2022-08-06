export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: [object];
  comment: Comment[];
}

export interface Comment {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: string;
  approved: boolean;
  email: string;
  name: string;
  comment: string;
  post: {
    _ref: string;
    _type: string;
  };
}
