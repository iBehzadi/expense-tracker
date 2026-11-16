"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import JibiIcon from "@/Components/icons/JibiIcon";

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

        router.push("/");
        router.refresh();
      } catch (error) {
        setError("ارتباط با سرور برقرار نشد");
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition
    placeholder:text-gray-400
    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
    dark:bg-[#111827] dark:text-gray-100 dark:placeholder:text-gray-500
    ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
        : "border-gray-200 dark:border-[#2A3548]"
    }`;

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 dark:bg-[#0B1120]"
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex mx-auto my-4 h-14 w-14 items-center justify-center rounded-2xl  bg-[#20C7B0] text-white shadow-lg shadow-blue-600/20">
            <JibiIcon size={34} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            خوش برگشتی!
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            برای ورود به حساب کاربری، اطلاعاتت رو وارد کن
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-[#2A3548] dark:bg-[#151F30]">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                ایمیل
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                {...formik.getFieldProps("email")}
                placeholder="example@gmail.com"
                className={inputClass(
                  Boolean(formik.touched.email && formik.errors.email),
                )}
              />

              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-xs text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                رمز عبور
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...formik.getFieldProps("password")}
                placeholder="رمز عبور خود را وارد کنید"
                className={inputClass(
                  Boolean(formik.touched.password && formik.errors.password),
                )}
              />

              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-xs text-red-500">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? "در حال ورود..." : "ورود به حساب"}
            </button>
          </form>
          <div className="mt-6 border-t border-gray-100 pt-5 text-center dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              حساب کاربری نداری ؟‌
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="mr-1.5 font-semibold cursor-pointer text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
              >
                یکی بساز
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          مدیریت هوشمند درآمد و هزینه‌های شخصی
        </p>
      </div>
    </main>
  );
}
