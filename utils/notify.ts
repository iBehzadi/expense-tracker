import toast from "react-hot-toast";

export const notify = (type: "success" | "error", message: string) => {
  toast[type](message, {
    position: "top-center",
    duration: 3000,
  });
};
