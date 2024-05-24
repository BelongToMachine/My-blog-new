import { Box } from "@radix-ui/themes";
import Skeleton from "@/app/components/Skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const AuthStatus = () => {
  const { status, data: session } = useSession();
  if (status === "loading") return <Skeleton width="3rem" />;
  if (status === "unauthenticated")
    return (
      <Link className="nav-link pr-4" href="/api/auth/signin">
        Login
      </Link>
    );
  return (
    <Box>
      <Link href="/api/auth/signout">Log out</Link>
    </Box>
  );
};
