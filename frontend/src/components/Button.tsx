import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export default function Button({
  variant = "primary",
  children,
  ...rest
}: Props) {
  const cls =
    variant === "primary" ? "button button--primary" : "button button--ghost";
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
