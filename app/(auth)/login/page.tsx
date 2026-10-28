"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("ایمیل معتبر نیست")
        .required("ایمیل الزامی است"),

      password: Yup.string()
        .min(8, "رمز عبور حداقل باید ۸ کاراکتر باشد")
        .required("رمز عبور الزامی است"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      setError("");

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "ورود ناموفق بود");
          return;
        }
        console.log(data);
        router.push("/");
        router.refresh();
      } catch (error) {
        setError("ارتباط با سرور برقرار نشد");
        console.log(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="mx-auto mt-12 w-full max-w-md px-4">
      <h1 className="mb-6 text-2xl font-bold">ورود به حساب کاربری</h1>

      <form method="POST" onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block">
            ایمیل
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            {...formik.getFieldProps("email")}
            className="w-full rounded-lg border p-3"
            placeholder="example@gmail.com"
          />

          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block">
            رمز عبور
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...formik.getFieldProps("password")}
            className="w-full rounded-lg border p-3"
            placeholder="رمز عبور"
          />

          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.password}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {formik.isSubmitting ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </main>
  );
}
