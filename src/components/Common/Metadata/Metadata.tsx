import { Metadata } from "next";

interface CreateMetadataProps {
  title: string;
  description: string;
  url: string;
  alt: string;
}

export function createMetadata({
  title,
  description,
  url,
  alt,
}: CreateMetadataProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt,
        },
      ],
    },
  };
}
