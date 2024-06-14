import { Box } from "@radix-ui/themes";
import Skeleton from "@/app/components/Skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MODE } from "@/app/envConfig";
import ErrorMessage from "../ErrorMessage";

export const AuthStatus = () => {
  const { status, data: session } = useSession();
  const link = MODE === "dev" ? "/api/auth/signin" : "/blogs/new";
  if (status === "loading") return <Skeleton width="3rem" />;
  if (status === "unauthenticated")
    return (
      <Link className="nav-link pr-4" href={link}>
        Login
      </Link>
    );
  return (
    <Box>
      <Link href="/api/auth/signout">Log out</Link>
    </Box>
  );
};
