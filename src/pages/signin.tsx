import { SignInPage } from "@toolpad/core";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button, TextField } from "../components/inputs";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../store/userStore";

export default function SignIn() {
  const { login } = useAuth();
  const { register } = useForm();
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const handleSignIn = async (provider: any, formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await login({ username, password });
      // Session cookie is automatically set by the browser from the response
      setUser({
        username: response.user.username,
        name: response.user.name,
        loginTime: response.user.loginTime,
        domain: "moglerfarms",
        menuOptions: [],
      });
      
      // Check for stored redirect URL and navigate there, or default to home
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin'); // Clean up
        navigate(redirectUrl);
      } else {
        navigate("/");
      }
      return { type: "CredentialsSignin" as const };
    } catch (error) {
      return {
        type: "CredentialsSignin" as const,
        error: error instanceof Error ? error.message : "Invalid credentials",
      };
    }
  };

  return (
    <SignInPage
      slots={{
        emailField: (props: any) => <TextField label="Username" placeholder="Enter username" {...register("username")} />,
        passwordField: (props: any) => <TextField label="Password" placeholder="Enter password" type="password" {...register("password")} />,
        submitButton: (props: any) => (
          <Button type="submit" variant="contained" fullWidth {...props} sx={{ mt: 2 }}>
            Sign In
          </Button>
        ),
      }}
      providers={[{ id: "credentials", name: "Sign In" }]}
      signIn={handleSignIn}
    />
  );
}
