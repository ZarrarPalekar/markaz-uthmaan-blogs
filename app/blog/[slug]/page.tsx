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
    const videoIdMatch = url.match(
      /(?:\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
    );
    const timestampMatch = url.match(/(?:[?&]t=)(\d+h)?(\d+m)?(\d+s)?/);

    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    let timestamp = null;
    if (timestampMatch) {
      const [, hours, minutes, seconds] = timestampMatch;
      timestamp =
        (parseInt(hours) || 0) * 3600 +
        (parseInt(minutes) || 0) * 60 +
        (parseInt(seconds) || 0);
    }

    return { videoId, timestamp };
  };

  // Render each content item based on its type
  const renderContent = (content: any[]) => {
    return content.map((item, index) => {
      switch (item._type) {
        case "block":
          return <PortableText key={index} value={item} />;
        case "youtube":
          // Extract video ID from the URL
          const { videoId, timestamp } = getYouTubeVideoId(item.url);
          if (videoId) {
            let embedUrl = `https://www.youtube.com/embed/${videoId}`;
            if (timestamp) {
              embedUrl += `?start=${timestamp}`;
            }
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
      <h1 className="mt-10 text-center sm:text-left">
        {" "}
        {/* Align text left on small screens */}
        <span className="block text-sm sm:text-base text-center font-semibold tracking-wide flex justify-between">
          <span>
            Author:{" "}
            <span className="text-primary uppercase">{data.author}</span>
          </span>
          <span>
            Published:{" "}
            <span className="text-primary uppercase">{formattedDate}</span>
          </span>
        </span>
        <span className="mt-10 block text-2xl sm:text-3xl text-center leading-8 font-bold tracking-tight">
          {" "}
          {/* Adjust text size for smaller screens */}
          {data.title}
        </span>
      </h1>

      {data.titleImage ? (
        <Image
          src={urlFor(data.titleImage).url()}
          width={800}
          height={800}
          alt="Title Image"
          priority
          className="rounded-lg mt-8 border"
        />
      ) : (
        <Image
          src={"/banner.webp"}
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
