"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import JibiIcon from "@/Components/icons/JibiIcon";

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

  const inputClass = (field: keyof typeof formik.values) =>
    `w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition
    placeholder:text-gray-400
    focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10
    dark:border-gray-700 dark:bg-[#151e30] dark:text-white
    dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-[#151e30]
    ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
        : ""
    }`;

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 dark:bg-[#0b1120]"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-7 text-center">
          {/* <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-600/20">
            $
          </div> */}

          <div className="flex mx-auto my-4 h-14 w-14 items-center justify-center rounded-2xl  bg-[#20C7B0] text-white shadow-lg shadow-blue-600/20">
            <JibiIcon size={34} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ساخت حساب کاربری
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            برای مدیریت هوشمند درآمد و هزینه‌هات ثبت‌نام کن.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-[#111a2b]">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                نام و نام خانوادگی
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                {...formik.getFieldProps("name")}
                className={inputClass("name")}
                placeholder="نام خود را وارد کن"
              />

              {formik.touched.name && formik.errors.name && (
                <p className="mt-2 text-xs text-red-500">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                ایمیل
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                {...formik.getFieldProps("email")}
                className={inputClass("email")}
                placeholder="example@gmail.com"
                dir="ltr"
              />

              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-xs text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                رمز عبور
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...formik.getFieldProps("password")}
                className={inputClass("password")}
                placeholder="حداقل ۸ کاراکتر"
              />

              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-xs text-red-500">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                تکرار رمز عبور
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...formik.getFieldProps("confirmPassword")}
                className={inputClass("confirmPassword")}
                placeholder="رمز عبور را مجدداً وارد کن"
              />

              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-500">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Messages */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-500/10 dark:text-red-400"
              >
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900/50 dark:bg-green-500/10 dark:text-green-400">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {formik.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  در حال ثبت‌نام...
                </span>
              ) : (
                "ایجاد حساب کاربری"
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-5 text-center dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              قبلاً حساب کاربری ساختی؟
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mr-1.5 font-semibold cursor-pointer text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
              >
                وارد شو
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          مدیریت بهتر پول، شروع یک زندگی مالی بهتر
        </p>
      </div>
    </main>
  );
}
