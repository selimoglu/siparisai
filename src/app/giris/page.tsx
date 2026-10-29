import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
