import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchSection from "./components/SearchSection";
import Communities from "./components/Communities";
import Submissions from "./components/Submissions";
import Footer from "./components/Footer";
// import Sidebar from "./components/Sidebar"; // Uncomment if used

export default function App() {
  return (
    <>
      <div className="page-transition">
        <Header />

        <main className="flex flex-col items-center justify-center w-full  space-y-10">
          {/* Hero Section */}
          <div className="w-[100%]">
            <Hero />
          </div>

         <div className="w-[80%] mt-10">
           {/* Search Section */}
          <div >
            <SearchSection />
          </div>

          {/* Communities Section */}
          <div >
            <Communities />
          </div>

          {/* Submissions Section */}
          <div >
            <Submissions />
          </div>
         </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
