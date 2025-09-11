import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/SimpleForm";
import { useToast } from "@/components/ui/SimpleToast";
import SimpleTextarea from "@/components/ui/SimpleTextarea";
import SimpleInput from "@/components/ui/SimpleInput";
import SimpleButton from "@/components/ui/SimpleButton";
import { ProfileUploader, Loader } from "@/components/shared";

import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useUpdateUser } from "@/hooks/useQueries";
import { useSimpleForm } from "@/hooks/useSimpleForm";
import { validateProfile } from "@/lib/validation/simple";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();

  // Queries
  const { data: currentUser } = useGetUserById(id || "");
  const { callApi: updateUser, isLoading: isLoadingUpdate } = useUpdateUser();

  const form = useSimpleForm({
    initialValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
    validate: validateProfile,
    onSubmit: async (values) => {
      try {
        const updatedUser = await updateUser({
          userId: currentUser?.id || "",
          name: values.name,
          bio: values.bio,
          file: [],
          imageUrl: currentUser?.imageUrl || "",
          imageId: currentUser?.imageId || "",
        });

        if (updatedUser) {
          setUser({
            ...user,
            name: updatedUser.name,
            bio: updatedUser.bio,
            imageUrl: updatedUser.imageUrl || "",
          });
          navigate(`/profile/${id}`);
        } else {
          toast({ title: "Update user failed. Please try again." });
        }
      } catch (error) {
        console.error('Update error:', error);
        toast({ title: "An error occurred. Please try again." });
      }
    }
  });

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Note: Form submission is handled in the useSimpleForm hook

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form onSubmit={form.handleSubmit}>
          <div className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <FormField name="file">
              {({ error }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={() => {}} // Profile uploader handles its own state
                      mediaUrl={currentUser?.imageUrl || ""}
                    />
                  </FormControl>
                  {error && <FormMessage>{error}</FormMessage>}
                </FormItem>
              )}
            </FormField>

            <FormField name="name">
              {({ error }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <SimpleInput
                      type="text"
                      value={form.values.name}
                      onChange={(e) => form.setValue('name', e.target.value)}
                      error={error}
                    />
                  </FormControl>
                  {error && <FormMessage>{error}</FormMessage>}
                </FormItem>
              )}
            </FormField>

            <FormField name="username">
              {({ error }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <SimpleInput
                      type="text"
                      value={form.values.username}
                      onChange={(e) => form.setValue('username', e.target.value)}
                      error={error}
                      disabled
                    />
                  </FormControl>
                  {error && <FormMessage>{error}</FormMessage>}
                </FormItem>
              )}
            </FormField>

            <FormField name="email">
              {({ error }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <SimpleInput
                      type="email"
                      value={form.values.email}
                      onChange={(e) => form.setValue('email', e.target.value)}
                      error={error}
                      disabled
                    />
                  </FormControl>
                  {error && <FormMessage>{error}</FormMessage>}
                </FormItem>
              )}
            </FormField>

            <FormField name="bio">
              {({ error }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <SimpleTextarea
                      value={form.values.bio}
                      onChange={(e) => form.setValue('bio', e.target.value)}
                      error={error}
                      className="custom-scrollbar"
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
                disabled={isLoadingUpdate || form.isSubmitting}>
                {isLoadingUpdate && <Loader />}
                Update Profile
              </SimpleButton>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
