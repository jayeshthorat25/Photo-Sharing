import { Link, useNavigate } from "react-router-dom";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/SimpleForm";
import SimpleInput from "@/components/ui/SimpleInput";
import SimpleButton from "@/components/ui/SimpleButton";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/SimpleToast";

import { validateSignin } from "@/lib/validation/simple";
import { useSignInAccount } from "@/hooks/useQueries";
import { useUserContext } from "@/context/AuthContext";
import { useSimpleForm } from "@/hooks/useSimpleForm";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Query
  const { callApi: signInAccount, isLoading } = useSignInAccount();

  const form = useSimpleForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateSignin,
    onSubmit: async (user) => {
      try {
        const session = await signInAccount(user);

        if (!session) {
          toast({ title: "Login failed. Please try again." });
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
        console.error('Sign in error:', error);
        toast({ title: "An error occurred. Please try again." });
      }
    }
  });

  return (
    <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/logo.svg" alt="logo" />

      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Log in to your account
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        Welcome back! Please enter your details.
      </p>
      
      <Form onSubmit={form.handleSubmit}>
        <div className="flex flex-col gap-5 w-full mt-4">
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

          <SimpleButton type="submit" disabled={form.isSubmitting}>
            {isLoading || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </SimpleButton>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default SigninForm;
