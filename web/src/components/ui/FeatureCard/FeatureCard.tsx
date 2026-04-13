import './FeatureCard.css';

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard = ({ title, description }: Readonly<FeatureCardProps>) => {
  return (
    <div className="feature-card">
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </div>
  );
};

export default FeatureCard;