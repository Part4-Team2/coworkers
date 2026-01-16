import clsx from "clsx";
import Image from "next/image";

interface ArticleImageProps {
  image: string;
}

function ArticleImage({ image }: ArticleImageProps) {
  return (
    <div
      className={clsx(
        "w-64 h-64 relative",
        "border border-slate-600 rounded-lg",
        "overflow-hidden"
      )}
    >
      <Image src={image} alt="article" fill />
    </div>
  );
}

export default ArticleImage;
