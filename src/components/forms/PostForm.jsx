import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/SimpleForm";
import SimpleButton from "@/components/ui/SimpleButton";
import SimpleInput from "@/components/ui/SimpleInput";
import SimpleTextarea from "@/components/ui/SimpleTextarea";
import { validatePost } from "@/lib/validation/simple";
import { useToast } from "@/components/ui/SimpleToast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/hooks/useQueries";
import { useSimpleForm } from "@/hooks/useSimpleForm";

const PostForm = ({ post, action }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();

  // Query
  const { callApi: createPost, isLoading: isLoadingCreate } = useCreatePost();
  const { callApi: updatePost, isLoading: isLoadingUpdate } = useUpdatePost();

  const form = useSimpleForm({
    initialValues: {
      caption: post ? post?.caption : "",
      location: post ? post.location : "",
      tags: post ? post.tags?.join(",") : "",
    },
    validate: validatePost,
    onSubmit: async (values) => {
      try {
        // ACTION = UPDATE
        if (post && action === "Update") {
          const updatedPost = await updatePost({
            ...values,
            postId: post.id,
            imageId: post.imageId,
            imageUrl: post.imageUrl,
            file: [], // Add empty file array for update
          });

          if (updatedPost) {
            navigate(`/posts/${post.id}`);
          } else {
            toast({ title: `${action} post failed. Please try again.` });
          }
          return;
        }

        // ACTION = CREATE
        const newPost = await createPost({
          ...values,
          userId: user.id,
          file: [], // Add empty file array for create
        });

        if (newPost) {
          navigate("/home");
        } else {
          toast({ title: `${action} post failed. Please try again.` });
        }
      } catch (error) {
        console.error('Post submission error:', error);
        toast({ title: "An error occurred. Please try again." });
      }
    }
  });

  // Note: Form submission is handled in the useSimpleForm hook

  return (
    <Form onSubmit={form.handleSubmit}>
      <div className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField name="caption">
          {({ error }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <SimpleTextarea
                  value={form.values.caption}
                  onChange={(e) => form.setValue('caption', e.target.value)}
                  error={error}
                  className="custom-scrollbar"
                />
              </FormControl>
              {error && <FormMessage>{error}</FormMessage>}
            </FormItem>
          )}
        </FormField>

        <FormField name="file">
          {({ error }) => (
            <FormItem>
              <FormLabel>Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={() => {}} // File uploader handles its own state
                  mediaUrl={post?.imageUrl || ""}
                />
              </FormControl>
              {error && <FormMessage>{error}</FormMessage>}
            </FormItem>
          )}
        </FormField>

        <FormField name="location">
          {({ error }) => (
            <FormItem>
              <FormLabel>Add Location</FormLabel>
              <FormControl>
                <SimpleInput
                  type="text"
                  value={form.values.location}
                  onChange={(e) => form.setValue('location', e.target.value)}
                  error={error}
                />
              </FormControl>
              {error && <FormMessage>{error}</FormMessage>}
            </FormItem>
          )}
        </FormField>

        <FormField name="tags">
          {({ error }) => (
            <FormItem>
              <FormLabel>
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <SimpleInput
                  placeholder="Art, Expression, Learn"
                  type="text"
                  value={form.values.tags}
                  onChange={(e) => form.setValue('tags', e.target.value)}
                  error={error}
                />
              </FormControl>
              {error && <FormMessage>{error}</FormMessage>}
            </FormItem>
          )}
        </FormField>

        <div className="flex gap-4 items-center justify-end">
          <SimpleButton
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}>
            Cancel
          </SimpleButton>
          <SimpleButton
            type="submit"
            className="whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate || form.isSubmitting}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </SimpleButton>
        </div>
      </div>
    </Form>
  );
};

export default PostForm;
