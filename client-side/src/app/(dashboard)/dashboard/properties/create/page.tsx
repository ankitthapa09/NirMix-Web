import { redirect } from "next/navigation";

export default function CreatePropertyRoute() {
  redirect("/dashboard?create=true");
}
