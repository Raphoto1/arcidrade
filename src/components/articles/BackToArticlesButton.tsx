"use client";

import { useRouter } from "next/navigation";

export default function BackToArticlesButton() {
  const router = useRouter();

  return (
    <button
      type='button'
      onClick={() => router.push("/articles")}
      className='btn btn-ghost btn-sm border border-base-300 hover:border-(--main-arci) hover:text-(--main-arci)'
    >
      Volver a articulos
    </button>
  );
}
