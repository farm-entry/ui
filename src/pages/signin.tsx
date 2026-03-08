import { SignInPage } from "@toolpad/core";
import { useNavigate } from "react-router";
import { Button, TextField } from "../components/inputs";
import { useAuth } from "../hooks/useAuth";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (_provider: any, formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      await login({ username, password, domain: null });

      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        navigate("/");
      }
      return { type: "CredentialsSignin" as const };
    } catch (error) {
      return {
        type: "CredentialsSignin" as const,
        error: error instanceof Error ? error.message : "Invalid credentials"
      };
    }
  };

  return (
    <SignInPage
      slots={{
        emailField: (props: any) => (
          <TextField label="Username or Email" placeholder="Enter username or email" name="username" {...props} />
        ),
        passwordField: (props: any) => (
          <TextField
            label="Password"
            placeholder="Enter password"
            type="password"
            name="password"
            {...props}
          />
        ),
        submitButton: (props: any) => (
          <Button type="submit" variant="contained" fullWidth {...props} sx={{ mt: 2 }}>
            Sign In
          </Button>
        )
      }}
      providers={[{ id: "credentials", name: "Sign In" }]}
      signIn={handleSignIn}
    />
  );
}
