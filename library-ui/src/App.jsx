import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchSection from "./components/SearchSection";
import Communities from "./components/Communities";
import Submissions from "./components/Submissions";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="bg-yellow-50 flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-col items-center justify-center w-full space-y-10 ">
        <div className="w-full">
          <Hero />
        </div>

        <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] mt-10 space-y-10">
          <SearchSection />

          <Communities />

          <Submissions />
        </div>
      </main>

      <Footer />
    </div>
  );
}
