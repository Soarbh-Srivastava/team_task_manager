import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { login, signup } from "../../store/authStore";
import type { AuthUser } from "../../types";

type Props = {
  mode: "login" | "signup";
  onSuccess?: (user: AuthUser) => void;
};

export default function AuthForm({ mode, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response =
        mode === "login"
          ? await login({ email, password })
          : await signup({ email, password, fullName });

      onSuccess?.(response.user);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to authenticate",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="form">
      {mode === "signup" ? (
        <Input
          placeholder="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
      ) : null}
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="form__actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Working..."
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </Button>
        <a className="muted-link" href="#">
          Forgot?
        </a>
      </div>
      {error ? <div className="form__error">{error}</div> : null}
    </form>
  );
}
