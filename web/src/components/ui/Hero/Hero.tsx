import "./Hero.css";

interface HeroProps {
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  imagePosition?: "left" | "right";
}

const Hero = ({
  title,
  description,
  imageUrl,
  ctaText,
  ctaLink,
  imagePosition = "right",
}: Readonly<HeroProps>) => {
  return (
    <section
      className={`hero ${imagePosition === "left" ? "hero-image-left" : ""}`}
    >
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-description">{description}</p>
        <a href={ctaLink} className="hero-cta">
          {ctaText}
        </a>
      </div>
      <div className="hero-image">
        <img src={imageUrl} alt={title} />
      </div>
    </section>
  );
};

export default Hero;
