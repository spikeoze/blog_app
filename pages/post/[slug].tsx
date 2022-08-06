/* eslint-disable @next/next/no-img-element */
import { GetStaticProps } from "next";
import React, { useState } from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { spawn } from "child_process";

interface Props {
  post: Post;
}

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

function Slug({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  console.log(post._createdAt);

  return (
    <main>
      <Header />

      <img
        className="w-full h-40 object-cover "
        src={urlFor(post?.mainImage).url()!}
        alt="main image"
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-4xl mt-10 mb-3 capitalize "> {post.title}</h1>
        <h3 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h3>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={urlFor(post?.author.image).url()!}
            alt="author image"
          />
          <p className="font-extralight text-sm capitalize">
            blog post by{" "}
            <span className="text-green-500 font-medium">
              {post.author.name}
            </span>{" "}
            - published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            content={post.body}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),

              links: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          ></PortableText>
        </div>
      </article>
      <hr className="max-w-xl my-5 mx-auto border border-yellow-500" />

      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 max-w-2xl mx-auto text-white">
          <h3 className="font-bold text-3xl ">Thank you for your comment</h3>
          <p>Once its approved it will appear below</p>
        </div>
      ) : (
        <form
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-sm text-yellow-500">Enjoyed the article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-2 mt-2" />

          <input
            type="hidden"
            name="_id"
            value={post._id}
            {...register("_id")}
          />

          <label htmlFor="name" className="block mb-5 ">
            <span className="text-gray-700">Name</span>
            <input
              autoComplete="no"
              {...register("name", { required: true })}
              className="shadow-md border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="John Doe"
              type="text"
            />
          </label>

          <label htmlFor="email" className="block mb-5 ">
            <span className="text-gray-700">Email</span>
            <input
              autoComplete="no"
              {...register("email", { required: true })}
              className="shadow-md border rounded py-2 px-3 form-input  mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="John@email"
              type="email"
            />
          </label>

          <label htmlFor="name" className="block mb-5 ">
            <span className="text-gray-700">Comment</span>
            <textarea
              autoComplete="off"
              {...register("comment", { required: true })}
              className="shadow-md border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring "
              placeholder="Comment..."
              rows={8}
            />
          </label>

          <div>
            {errors?.name && (
              <span className="text-red-400 block">Name field is required</span>
            )}
            {errors?.email && (
              <span className="text-red-400 block">
                Email field is required
              </span>
            )}
            {errors?.comment && (
              <span className="text-red-400 block">
                Comment field is required
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 outline-none hover:bg-yellow-400
           text-white cursor-pointer py-2 px-3 rounded-sm
            font-bold mt-2 focus:shadow-lg shadow"
          >
            Submit
          </button>
        </form>
      )}

      {/* Comments */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-3">
        <h3 className="text-4xl font-bold">Comments</h3>
        <hr className="pb-2" />
        {post.comment?.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500 font-semibold">
                {comment.name}
              </span>
              : {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Slug;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{_id, slug{current}}`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    description,
    _createdAt,
    mainImage,
    slug,
    author-> {
      name,
      image
  },
  body,
  "comment":*[
    _type =="comment" && 
    post._ref == ^._id &&
    approved == true
  ]
  }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: { post },
    revalidate: 60,
  };
};
