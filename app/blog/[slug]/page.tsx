import { fullBlog } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 30; // revalidate at most 30 seconds

async function getData(slug: string) {
  const query = `
    *[_type == "blog" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
          title,
          content,
          titleImage,
          author,
          publishedAt
      }[0]`;

  const data = await client.fetch(query);
  return data;
}

export default async function BlogArticle({
  params,
}: {
  params: { slug: string };
}) {
  const data: fullBlog = await getData(params.slug);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(
      /(?:\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  // Render each content item based on its type
  const renderContent = (content: any[]) => {
    return content.map((item, index) => {
      switch (item._type) {
        case "block":
          return <PortableText key={index} value={item} />;
        case "youtube":
          // Extract video ID from the URL
          const videoId = getYouTubeVideoId(item.url);
          if (videoId) {
            // Construct embed URL
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return (
              <div key={index} className="youtube-container">
                <iframe
                  height="315"
                  className="mt-8 w-full rounded-lg"
                  src={embedUrl}
                  title={`YouTube Video ${index}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          } else {
            return null; // Invalid YouTube URL
          }
        default:
          return null;
      }
    });
  };

  const publishedDate = new Date(data.publishedAt);
  const formattedDate = `${publishedDate.getDate()}/${publishedDate.toLocaleString(
    "default",
    { month: "short" }
  )}/${publishedDate.getFullYear()}`;

  return (
    <div className="mt-8 mb-8">
      <div className="flex justify-between mb-4">
        <Link href="/">← Back to Home Page</Link>
      </div>
      <h1 className="mt-10">
        <span className="block text-base text-center font-semibold tracking-wide flex justify-between">
          <span>
            Author:{" "}
            <span className="text-primary uppercase">{data.author}</span>
          </span>
          <span>
            Published:{" "}
            <span className="text-primary uppercase">{formattedDate}</span>
          </span>
        </span>

        <span className="mt-10 block text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
          {data.title}
        </span>
      </h1>

      {data.titleImage && (
        <Image
          src={urlFor(data.titleImage).url()}
          width={800}
          height={800}
          alt="Title Image"
          priority
          className="rounded-lg mt-8 border"
        />
      )}

      <div className="mt-16 prose prose-blue prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
        {renderContent(data.content)}
      </div>
    </div>
  );
}
