import { SignIn } from "@stackframe/stack";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-purple-100 m-auto">
        <div className="w-100 p-2 m-auto bg-gray-500">
            <SignIn />
            <Link href="/" className="block text-center mt-4 text-violet-400 hover:underline"> Go back HOME </Link>
        </div>
    </div>
  );
}
