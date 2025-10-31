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
      const creds = await login({ username, password })
        .then((c) => {
          setUser({ domain: "moglerfarms", menuOptions: [], ...c.user });
          navigate("/");
        })
        .catch((e) => {
          throw new Error(e.message || "Unsuccessful Login.");
        });
      return { type: "CredentialsSignin" as const, creds };
    } catch (error) {
      return {
        type: "CredentialsSignin" as const,
        error: "Invalid credentials",
      };
    }
  };

  return (
    <SignInPage
      slots={{
        emailField: (props: any) => <TextField label="Username" {...register("username")} />,
        passwordField: (props: any) => <TextField label="Password" type="password" {...register("password")} />,
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
