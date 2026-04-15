"use client";
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
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import RetroPanel from "@/app/components/system/RetroPanel";
import { RetroNotice } from "@/app/components/system/RetroNotice";


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
    <RetroPanel
      eyebrow={issue ? "edit entry" : "new entry"}
      title={issue ? t("update") : t("submitNew")}
      contentClassName="px-5 py-5 sm:px-6 sm:py-6"
    >
      {error && (
        <RetroNotice tone="danger" title="request failed" className="mb-5">
          {error}
        </RetroNotice>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input
          defaultValue={issue?.title}
          placeholder={t("titlePlaceholder")}
          {...register("title")}
        />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <div className="pixel-panel border border-border/80 bg-card/88 p-2">
              <SimpleMDE placeholder={t("descriptionPlaceholder")} {...field} />
            </div>
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {issue ? t("update") : t("submitNew")}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </RetroPanel>
  );
};

export default IssueForm;
