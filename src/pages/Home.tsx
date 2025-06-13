import FeatureSection from '../components/FeatureSection';
import Hero from '../components/Hero';
import firstImage from '../assets/images/hero.png';
import firstImage_dark from '../assets/images/hero_dark.png';
import type { FeatureSectionProps } from '../components/FeatureSection';
import { useDarkMode } from "../contexts/DarkModeContext";

const { isDarkMode } = useDarkMode();
const featureSections: FeatureSectionProps[] = [
  {
    imgSrc: isDarkMode ? firstImage_dark : firstImage,
    badgeLabel: "Easy-to-Use Builder",
    title: "Click. Create. Complete",
    description: "Designing surveys shouldn't be a complex task. Our intuitive builder empowers you to effortlessly create and customize surveys to suit your specific needs. Whether you're conducting market research, gathering customer feedback, or organizing an event, our platform simplifies the process, allowing you to focus on what matters most—gathering valuable insights.",
    imgPosition: "right"
  },
  {
    imgSrc: isDarkMode ? firstImage_dark : firstImage,
    badgeLabel: "Real-Time Analytics",
    title: "Instant Insights",
    description: "In today's fast-paced environment, timely data is crucial. Our real-time analytics dashboard provides immediate access to responses, enabling you to monitor trends and make informed decisions promptly. Visual representations such as charts and graphs offer a clear understanding of your data, eliminating the need for complex analysis.s quickly and confidently.",
    imgPosition: "left"
  },
  {
    imgSrc: isDarkMode ? firstImage_dark : firstImage,
    badgeLabel: "Customizable Templates",
    title: "Templates that Fit Your Needs",
    description: "Starting from scratch can be time-consuming. Our extensive library of professionally designed templates caters to various industries and purposes, including customer satisfaction, employee engagement, and product feedback. Each template is fully customizable, allowing you to tailor questions and branding to align with your objectives.",
    imgPosition: "right"
  },
  {
    imgSrc: isDarkMode ? firstImage_dark : firstImage,
    badgeLabel: "Target Audience",
    title: "Reach the Right People",
    description: "Effective surveys reach the appropriate audience. Our advanced targeting tools enable you to distribute surveys to specific demographics, ensuring that the feedback you collect is relevant and actionable. Filter respondents by age, location, interests, and more to gain insights that truly reflect your target market's perspectives.",
    imgPosition: "left"
  },
  {
    imgSrc: isDarkMode ? firstImage_dark : firstImage,
    badgeLabel: "Seamless Sharing",
    title: "Share Anywhere",
    description: "Maximize your survey's reach with our versatile distribution options. Whether via email, social media, or embedding directly on your website, our platform ensures your surveys are accessible and engaging across all devices. This seamless sharing capability enhances participation rates and broadens your data collection scope.",
    imgPosition: "right"
  }
];

const Home = () => {
  return (
    <div className="pt-12">
      <Hero />
      {featureSections.map((section, index) => (
        <FeatureSection 
          key={index}
          imgSrc={section.imgSrc}
          badgeLabel={section.badgeLabel}
          title={section.title}
          description={section.description}
          imgPosition={section.imgPosition}
        />
      ))}
    </div>
  );
};

export default Home;
