import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Arcidrade!</h1>
      <p className="mt-4 text-lg">Your platform for managing trades efficiently.</p>
      <Image
        src="/arcidrade-logo.png"
        alt="Arcidrade Logo"
        width={150}
        height={150}
        className="mt-8"
      />
      <button className="btn btn-active">test</button>
    </main>
  );
}
