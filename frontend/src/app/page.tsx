import Carousel from "./components/carousel/Carousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <main className="relative flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-4xl font-bold text-white mb-2">Llama Launch</h1>
        <p className="text-white/60 mb-12 text-center max-w-md">
          Refine your project ideas through interactive dialogue with our AI assistant
        </p>
        <Carousel />
      </main>
    </div>
  );
}
