import Image from "next/image";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";
import { getTopInteractiveTags } from "@/lib/actions/tag.actions";

interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  const interactiveTags = await getTopInteractiveTags({
    userId: user._id,
  });

  return (
    <div className="shadow-light100_darknone w-full max-sm:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border px-8 py-6">
        <Image
          src={user.picture}
          width={100}
          height={100}
          alt="user profile picture"
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5">
          {interactiveTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactiveTags.map((tag) => (
                <RenderTag key={tag.id} id={tag.id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;
