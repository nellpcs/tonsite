import { Suspense } from "react";
import ConnexionForm from "./ConnexionForm";

export default function ConnexionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <Suspense fallback={null}>
        <ConnexionForm />
      </Suspense>
    </main>
  );
}
