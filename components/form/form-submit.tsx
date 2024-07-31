"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
}

export function FormSubmit({
  children,
  disabled,
  className,
  variant = "primary",
}: FormSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={disabled || pending}
      variant={variant}
      className={cn(className)}
      type="submit"
      size="sm"
    >
      {children}
    </Button>
  );
}
