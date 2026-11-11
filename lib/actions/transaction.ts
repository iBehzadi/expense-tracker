"use server";

import { getCurrentUserId } from "@/lib/api/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

