export default async function Page() {
  const data = await fetch(
    "https://cdn.contentful.com/spaces/gflqy7a70p1a/environments/master/entries/zFNWqjZUZlV6NVi7HmoQx?access_token=R49aYTEML8Kh-tMJa5YVEfPtMk_s9qIdmNBEhTudu0g",
    {
      next: { tags: ["posts"] },
    }
  );
  console.log(data);
  const posts = await data.json();
  console.log(posts);
  return <div>{posts?.sys?.updatedAt}</div>;
}
