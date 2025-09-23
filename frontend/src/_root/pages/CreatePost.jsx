import PostForm from "@/components/PostForm";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex-start gap-3 justify-start w-full mb-6">
            <img
              src="/assets/icons/add-post.svg"
              width={36}
              height={36}
              alt="add"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
          </div>

          <PostForm action="Create" />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
