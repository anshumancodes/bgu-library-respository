import SearchSection from "./components/SearchSection";
import Communities from "./components/Communities";
import Submissions from "./components/Submissions";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
export default function App() {
  return (
      <>
     <div className="page-transition">
       <Header />
       <Hero />
       <main className="main-content">
         <div className="content-primary">
           <SearchSection />
           <div>
             <Communities />
          
           </div>
           <div className="mt-10">
             <Submissions />
           </div>
         </div>
         <Sidebar />
       </main>
       <Footer />
     </div>
  
    
    </>
  );
}
