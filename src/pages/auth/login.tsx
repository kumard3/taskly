import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    if (session.status === "authenticated") {
      void router.push("/dashboard");
    }
  }, [router, session.status]);
  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="relative z-10 flex h-full items-center justify-center py-12">
        <CreateAccount />
      </div>
    </div>
  );
}

export function CreateAccount() {
  return (
    <Card className="relative">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <FaGithub className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              void signIn("google");
            }}
          >
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
    </Card>
  );
}
