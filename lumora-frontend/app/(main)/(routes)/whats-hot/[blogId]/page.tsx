import { redirect } from "next/navigation";

export default function RedirectBlogDetail({ params }: { params: { blogId: string } }) {
  redirect(`/library/${params.blogId}`);
}
