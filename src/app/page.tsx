import TabView from "./components/tabs/TabView";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <main className="relative h-screen">
        <TabView />
      </main>
    </div>
  );
}
