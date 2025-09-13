import { useParams } from "react-router-dom";

import { Loader } from "@/components/shared";
import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/hooks/useQueries";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isLoading, error } = useGetPostById(id);


  if (isLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center w-full h-full">
        <div className="text-center">
          <p className="text-light-1 mb-4">Error loading post: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-center w-full h-full">
        <div className="text-center">
          <p className="text-light-1 mb-4">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex-start gap-3 justify-start w-full mb-6">
            <img
              src="/assets/icons/edit.svg"
              width={36}
              height={36}
              alt="edit"
              className="invert-white"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
          </div>

          <PostForm action="Update" post={post} />
        </div>
      </div>
    </div>
  );
};

export default EditPost;
