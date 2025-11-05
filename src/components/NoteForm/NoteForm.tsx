import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

import { createNote } from "@/lib/api";
import type { NoteFormValues, NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const tagOptions: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500),
  tag: Yup.mixed<NoteTag>().oneOf(tagOptions).required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: NoteFormValues) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    createMutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <FormikError name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <FormikError
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <FormikError name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
