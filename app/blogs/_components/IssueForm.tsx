"use client";
import { Button, Callout, TextField, Theme } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBlogSchema } from "@/app/validationSchema";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { Issue } from "@prisma/client";
import SimpleMDE from "react-simplemde-editor";
import { useRouter } from "@/app/i18n/navigation";


type IssueFormData = z.infer<ReturnType<typeof createBlogSchema>>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const locale = useLocale();
  const t = useTranslations("blogForm");
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(
      createBlogSchema((key) => {
        if (key === "titleRequired") return t("validation.titleRequired")
        if (key === "descriptionRequired") {
          return t("validation.descriptionRequired")
        }

        return key
      })
    ),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue) await axios.patch("/api/blogs/" + issue.id, data);
      else await axios.post("/api/blogs", { ...data, language: locale });
      router.push("/blogs");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError(t("errorMsg"));
    }
  });

  return (
    <div>
      {error && (
        <Callout.Root color="red" className="mb-5 rounded-[0.55rem]">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <Theme radius="none">
        <TextField.Root className="rounded-[0.45rem]">
          <TextField.Input
            defaultValue={issue?.title}
            placeholder={t("titlePlaceholder")}
            {...register("title")}
          />
        </TextField.Root>
        </Theme>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE placeholder={t("descriptionPlaceholder")} {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting} className="rounded-[0.45rem]">
          {issue ? t("update") : t("submitNew")}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;
