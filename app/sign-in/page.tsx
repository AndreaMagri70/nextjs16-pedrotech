import { SignIn } from "@stackframe/stack";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="min-w-96 border border-solid border-white rounded-[14px] p-2">
            <SignIn />
            <Link href="/" className="block text-center mt-4 text-violet-400 hover:underline"> Go back HOME </Link>
        </div>
    </div>
  );
}
