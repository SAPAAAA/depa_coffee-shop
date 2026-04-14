import { FeatureCard } from "@/components/ui/FeatureCard";
import { Hero } from "@/components/ui/Hero";
import "./Home.css";

const FEATURES_DATA = [
  {
    id: "ethically-sourced",
    title: "Ethically Sourced",
    description:
      "Direct trade with farmers ensures fair pay and the highest quality beans.",
  },
  {
    id: "expertly-roasted",
    title: "Expertly Roasted",
    description:
      "Our master roasters craft the perfect profile for every single batch.",
  },
  {
    id: "freshly-brewed",
    title: "Freshly Brewed",
    description:
      "Ground right before brewing so you experience maximum flavor and aroma.",
  },
];

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <Hero
          title="Start Your Day with the Perfect Brew"
          description="Experience the finest artisanal blends, roasted in-house, and served in a cozy, welcoming atmosphere. Your new favorite spot awaits."
          imageUrl="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          ctaText="Explore Our Menu"
          ctaLink="/menu"
          imagePosition="right"
        />
      </div>

      {/* Featured Section */}
      <section className="bg-brand-50 py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-default-font mb-4">
            Quality in Every Cup
          </h2>
          <p className="text-lg text-subtext-color max-w-2xl mx-auto mb-8">
            We ethically source our beans from sustainable farms around the
            globe to bring you rich, unique flavor profiles that you won't find
            anywhere else.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {FEATURES_DATA.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
