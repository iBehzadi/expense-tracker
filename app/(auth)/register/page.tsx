"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(3, "نام باید حداقل ۳ کاراکتر باشد")
        .required("نام الزامی است"),

      email: Yup.string()
        .email("ایمیل معتبر نیست")
        .required("ایمیل الزامی است"),

      password: Yup.string()
        .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
        .required("رمز عبور الزامی است"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "رمزهای عبور یکسان نیستند")
        .required("تکرار رمز عبور الزامی است"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      setSuccess("");

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
          }),
        });

        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          setError(data.message || "ثبت‌نام ناموفق بود");
          return;
        }

        setSuccess("ثبت‌نام با موفقیت انجام شد");

        router.push("/login");
        router.refresh();
      } catch {
        setError("ارتباط با سرور برقرار نشد");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="mx-auto mt-12 w-full max-w-md px-4">
      <h1 className="mb-2 text-2xl font-bold">ساخت حساب کاربری</h1>

      <p className="mb-6 text-sm text-gray-500">
        برای مدیریت درآمد و هزینه‌هات ثبت‌نام کن.
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block">
            نام و نام خانوادگی
          </label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            {...formik.getFieldProps("name")}
            className="w-full rounded-lg border p-3"
            placeholder="نام شما"
          />

          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>

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
            autoComplete="new-password"
            {...formik.getFieldProps("password")}
            className="w-full rounded-lg border p-3"
            placeholder="حداقل ۸ کاراکتر"
          />

          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block">
            تکرار رمز عبور
          </label>

          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...formik.getFieldProps("confirmPassword")}
            className="w-full rounded-lg border p-3"
            placeholder="رمز عبور را تکرار کن"
          />

          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}

        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {formik.isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>

        <p className="text-center text-sm text-gray-500">
          قبلاً ثبت‌نام کردی؟{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            وارد شو
          </button>
        </p>
      </form>
    </main>
  );
}
