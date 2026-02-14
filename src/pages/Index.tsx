import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Experience />
      <Projects />
      <Education />
      <Skills />
      <Blog />
      <Contact />
    </main>
  );
};

export default Index;
