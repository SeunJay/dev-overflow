"use client";
import React, { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@tinymce/tinymce-react";
import { QuestionsSchema } from "@/lib/validations";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.actions";
import { useTheme } from "@/context/ThemeProvider";

interface QuestionProps {
  mongoUserId: string;
  type?: string;
  questionDetails?: string;
}

const Question = ({
  mongoUserId,
  type = "Create",
  questionDetails,
}: QuestionProps) => {
  const editorRef = useRef(null);
  const { mode } = useTheme();

  const parsedQuestion = questionDetails ? JSON.parse(questionDetails) : {};
  const groupTags = parsedQuestion.tags.map((tag: any) => tag.name);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestion.title || "",
      explanation: parsedQuestion.content || "",
      tags: groupTags || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof QuestionsSchema>) => {
    setIsSubmitting(true);

    try {
      if (type === "Edit") {
        await editQuestion({
          title: values.title,
          content: values.explanation,
          questionId: parsedQuestion._id,
          path: pathName,
        });

        router.push(`/question/${parsedQuestion._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: mongoUserId,
          path: pathName,
        });

        router.push("/");
      }
    } catch (error) {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value;

      if (tagValue !== "") {
        if (tagValue.length >= 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tags must be less than 15 characters",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleRemoveTag = (tag: string, field: any) => {
    const newTags = field.value.filter((el: string) => el !== tag);

    form.setValue("tags", newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500 ">
                Be specific and imagine you are asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                {/* TODO: add an editor component */}
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  // @ts-ignore
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  onEditorChange={(content) => field.onChange(content)}
                  onBlur={field.onBlur}
                  initialValue={parsedQuestion.content || ""}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "codesample | bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style: "body { font-family:Inter; font-size:14px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500 ">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                    disabled={type === "Edit"}
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any, i) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_dark500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() => {
                            if (type === "Edit") return;
                            handleRemoveTag(tag, field);
                          }}
                        >
                          {tag}
                          {type !== "Edit" && (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="close icon"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500 ">
                Add up to 3 tags to describe what your question is all about.
                You need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Posting"}</>
          ) : (
            <>{type === "Edit" ? "Edit Question" : "Ask a question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
