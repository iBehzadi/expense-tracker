'use client'
import type { MouseEventHandler } from "react";

type DefButtonProps = {
  title: string;
  color?: "blue" | "red" | "green";
  onBtnClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  classes?:string
};

const colorClasses = {
  blue: "bg-blue-400 hover:bg-blue-500",
  red: "bg-red-400 hover:bg-red-500",
  green: "bg-green-400 hover:bg-green-500",
};

export default function DefButton({
  title,
  color = "blue",
  onBtnClick,
  type = "button",
  disabled = false,
  classes
}: DefButtonProps) {

  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded px-3 py-2 text-white transition disabled:opacity-50 ${colorClasses[color]} ${classes}`}
      onClick={onBtnClick}
    >
      {title}
    </button>
  );
}
