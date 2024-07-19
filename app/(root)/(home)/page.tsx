import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="">
      <h1 className="h1-bold">We&apos;re coming</h1>
      <UserButton afterSwitchSessionUrl="/" />
    </div>
  );
}
