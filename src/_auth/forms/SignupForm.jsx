import { Link, useNavigate } from "react-router-dom";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/SimpleForm";
import SimpleInput from "@/components/ui/SimpleInput";
import SimpleButton from "@/components/ui/SimpleButton";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/SimpleToast";

import { useCreateUserAccount, useSignInAccount } from "@/hooks/useQueries";
import { validateSignup } from "@/lib/validation/simple";
import { useUserContext } from "@/context/AuthContext";
import { useSimpleForm } from "@/hooks/useSimpleForm";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Queries
  const { callApi: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { callApi: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  const form = useSimpleForm({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      password_confirm: "",
    },
    validate: validateSignup,
    onSubmit: async (user) => {
      try {
        const newUser = await createUserAccount(user);

        if (!newUser) {
          toast({ title: "Sign up failed. Please try again." });
          return;
        }

        const session = await signInAccount({
          email: user.email,
          password: user.password,
        });

        if (!session) {
          toast({ title: "Something went wrong. Please login your new account" });
          navigate("/sign-in");
          return;
        }

        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
          form.reset();
          navigate("/");
        } else {
          toast({ title: "Login failed. Please try again." });
        }
      } catch (error) {
        console.log({ error });
        toast({ title: "An error occurred. Please try again." });
      }
    }
  });

  return (
    <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/logo.svg" alt="logo" />

      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Create a new account
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        To use snapgram, Please enter your details
      </p>

      <Form onSubmit={form.handleSubmit}>
        <div className="flex flex-col gap-5 w-full mt-4">
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
                  />
                </FormControl>
                {error && <FormMessage>{error}</FormMessage>}
              </FormItem>
            )}
          </FormField>

          <FormField name="password">
            {({ error }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <SimpleInput
                    type="password"
                    value={form.values.password}
                    onChange={(e) => form.setValue('password', e.target.value)}
                    error={error}
                  />
                </FormControl>
                {error && <FormMessage>{error}</FormMessage>}
              </FormItem>
            )}
          </FormField>

          <FormField name="password_confirm">
            {({ error }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <SimpleInput
                    type="password"
                    value={form.values.password_confirm}
                    onChange={(e) => form.setValue('password_confirm', e.target.value)}
                    error={error}
                  />
                </FormControl>
                {error && <FormMessage>{error}</FormMessage>}
              </FormItem>
            )}
          </FormField>

          <SimpleButton type="submit" disabled={form.isSubmitting}>
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </SimpleButton>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default SignupForm;
