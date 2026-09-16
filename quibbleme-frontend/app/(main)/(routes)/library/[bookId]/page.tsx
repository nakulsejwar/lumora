import BookPage from "./book-page";
import { getBookData } from "@/actions/get-book";

export default async function Page({ params }: { params: { bookId: string } }) {
  const { success: book } = await getBookData(params.bookId);

  return <BookPage book={book} />;
}
