"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LeadField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
};

type LeadFormProps = {
  context: string;
  fields: LeadField[];
  submitLabel?: string;
  description?: string;
  successMessage?: string;
};

type LeadErrors = Record<string, string>;

const defaultSuccessMessage =
  "Merci ! Ce formulaire de demonstration enregistre vos informations localement. L equipe vous recontactera lors de la mise en production.";

export function LeadForm({
  context,
  fields,
  submitLabel = "Envoyer",
  description,
  successMessage = defaultSuccessMessage,
}: LeadFormProps): JSX.Element {
  const initialValues = fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validate = (): boolean => {
    const nextErrors: LeadErrors = {};

    fields.forEach((field) => {
      const value = values[field.name]?.trim() ?? "";
      const required = field.required !== false;
      if (required && value.length === 0) {
        nextErrors[field.name] = "Champ requis";
      } else if (field.type === "email" && value.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          nextErrors[field.name] = "Email invalide";
        }
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="context" value={context} />
        {fields.map((field) => {
          const value = values[field.name];
          const error = errors[field.name];
          const fieldType = field.type ?? "text";

          if (fieldType === "textarea") {
            return (
              <label
                key={field.name}
                className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"
              >
                {field.label}
                <textarea
                  name={field.name}
                  value={value}
                  placeholder={field.placeholder}
                  className="min-h-[120px] rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  required={field.required !== false}
                />
                {error ? <span className="text-xs text-red-500">{error}</span> : null}
              </label>
            );
          }

          return (
            <label
              key={field.name}
              className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"
            >
              {field.label}
              <Input
                name={field.name}
                type={fieldType === "tel" ? "tel" : fieldType}
                value={value}
                placeholder={field.placeholder}
                onChange={(event) => handleChange(field.name, event.target.value)}
                required={field.required !== false}
              />
              {error ? <span className="text-xs text-red-500">{error}</span> : null}
            </label>
          );
        })}
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
      </form>
      {submitted ? (
        <div className="rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm text-brand">
          {successMessage}
        </div>
      ) : null}
    </div>
  );
}
