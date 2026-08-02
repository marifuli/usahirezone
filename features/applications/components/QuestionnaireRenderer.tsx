"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Questionnaire, Question } from "@/types";

interface QuestionnaireRendererProps {
  questionnaire: Questionnaire;
  onSubmit: (answers: Record<string, string | string[] | number | boolean>) => void;
  submitting?: boolean;
}

function buildSchema(questions: Question[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const question of questions) {
    if (question.type === "NUMBER") {
      shape[question.id] = question.required
        ? z.coerce.number().min(0, "Please enter a valid number")
        : z.coerce.number().min(0).optional();
    } else if (question.type === "CHECKBOX") {
      shape[question.id] = question.required
        ? z.array(z.string()).min(1, "Please select at least one option")
        : z.array(z.string()).optional();
    } else {
      shape[question.id] = question.required
        ? z.string().min(1, "This field is required")
        : z.string().optional();
    }
  }
  return z.object(shape);
}

export function QuestionnaireRenderer({
  questionnaire,
  onSubmit,
  submitting,
}: QuestionnaireRendererProps) {
  const schema = buildSchema(questionnaire.questions);
  type FormValues = Record<string, string | string[] | number | boolean | undefined>;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const values = watch();

  const renderQuestion = (question: Question) => {
    const error = errors[question.id];

    switch (question.type) {
      case "TEXT":
        return (
          <Input
            {...register(question.id)}
            placeholder={question.placeholder}
            aria-invalid={!!error}
          />
        );
      case "TEXTAREA":
        return (
          <Textarea
            {...register(question.id)}
            placeholder={question.placeholder}
            aria-invalid={!!error}
          />
        );
      case "NUMBER":
        return (
          <Input
            type="number"
            {...register(question.id)}
            placeholder={question.placeholder}
            aria-invalid={!!error}
          />
        );
      case "DATE":
        return (
          <Input
            type="date"
            {...register(question.id)}
            aria-invalid={!!error}
          />
        );
      case "RADIO":
        return (
          <RadioGroup
            onValueChange={(value) => setValue(question.id, value)}
            value={values[question.id] as string}
          >
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "CHECKBOX":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${question.id}-${option.value}`}
                  onCheckedChange={(checked) => {
                    const current = (values[question.id] as string[]) ?? [];
                    const next = checked
                      ? [...current, option.value]
                      : current.filter((v) => v !== option.value);
                    setValue(question.id, next);
                  }}
                />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      case "DROPDOWN":
        return (
          <Select
            onValueChange={(value) => setValue(question.id, value)}
            value={values[question.id] as string}
          >
            <SelectTrigger>
              <SelectValue placeholder={question.placeholder ?? "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "FILE":
        return (
          <Input
            type="file"
            {...register(question.id)}
            aria-invalid={!!error}
          />
        );
      default:
        return null;
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    const cleanAnswers: Record<string, string | string[] | number | boolean> = {};
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        cleanAnswers[key] = value;
      }
    }
    onSubmit(cleanAnswers);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {questionnaire.questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <Label>
            {question.label}
            {question.required && <span className="text-destructive"> *</span>}
          </Label>
          {question.helpText && (
            <p className="text-sm text-muted-foreground">{question.helpText}</p>
          )}
          {renderQuestion(question)}
          {errors[question.id] && (
            <p className="text-sm text-destructive">
              {String(errors[question.id]?.message)}
            </p>
          )}
        </div>
      ))}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}