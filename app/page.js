import supabase from "csc-start/utils/supabase";
import Link from "next/link";
export const revalidate = 30;
export default async function Home() {
  const { data, error } = await supabase
    .from("profile")
    .select("name, slug")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="barge">
      <p className="h1 my-5">Recent Users</p>
      {data.map(({ slug, name }) => (
        <Link
          className="block my-5 button small"
          key={slug}
          href={`/user/${slug}`}
        >
          {name}
        </Link>
      ))}
    </main>
  );
}
