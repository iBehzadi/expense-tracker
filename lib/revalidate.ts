
import { revalidatePath } from "next/cache";
export const revalidateApp = () => revalidatePath("/", "layout");