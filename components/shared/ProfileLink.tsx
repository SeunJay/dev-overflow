import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  imgUrl: string;
  href?: string;
}

const ProfileLink = ({ title, imgUrl, href }: Props) => {
  return (
    <div className="flex-center gap-2">
      <Image src={imgUrl} alt="icon" width={20} height={20} />
      {href ? (
        <Link
          href={href}
          target="_blank"
          className="paragraph-medium text-accent-blue"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700 mt-1">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
