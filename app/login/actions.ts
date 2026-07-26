//the server-side login/signup logic

//"use server" marks these as Server Actions, they run only on the server, 
// so the browser never touches Supabase auth directly. 
// signInWithPassword and signUp set the session cookie.
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertUserProfile } from "@/lib/profile";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  if (data.user?.email) {
    await upsertUserProfile(data.user.id, data.user.email);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email.endsWith("@tufts.edu")) {
    redirect("/login?error=" + encodeURIComponent("Please use your @tufts.edu email."));
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  if (data.user?.email) {
    await upsertUserProfile(data.user.id, data.user.email);
  }

  revalidatePath("/", "layout");
  redirect("/");
}