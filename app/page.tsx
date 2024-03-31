import Image from "next/image";
import { simpleBlogCard } from "./lib/interface";
import { client, urlFor } from "./lib/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 30; // revalidate at most 30 seconds

async function getData() {
  const query = `
  *[_type == 'blog'] | order(publishedAt desc) {
    title,
    smallDescription,
    titleImage,
    "currentSlug": slug.current
  }`;

  const data: simpleBlogCard[] = await client.fetch(query);

  return data;
}

export default async function Home() {
  const data: simpleBlogCard[] = await getData();

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 mt-5 gap-5">
      {data.map((post, idx) => (
        <Card key={idx} className="flex flex-col h-full">
          <div className="flex-1">
            {post.titleImage && (
              <Image
                src={urlFor(post.titleImage).url()}
                alt="image"
                width={500}
                height={500}
                className="rounded-t-lg h-[200px] object-cover"
              />
            )}
            <CardContent className="mt-5">
              <h3 className="text-lg line-clamp-2 font-bold">{post.title}</h3>
              <p className="line-clamp-3 text-sm mt-2 text-gray-600 dark:text-gray-300">
                {post.smallDescription}
              </p>
            </CardContent>
          </div>
          <div className="button-container px-4 pb-4">
            <Button asChild className="w-full">
              <Link href={`/blog/${post.currentSlug}`}>Read More</Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
