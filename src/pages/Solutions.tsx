import React from "react";
import Hero from "../components/solutions/Hero";
import FeatureSection from "../components/solutions/Features";
import type { FeatureSectionProps } from "../components/solutions/Features";
import Survey from "../assets/images/solutions-survey.jpg";
import Analytics from "../assets/images/solutions-analytics.jpg";
import Members from "../assets/images/solutions-members.jpg";

const Solutions: React.FC = () => {
  const features: FeatureSectionProps[] = [
    {
      imgPosition: "right",
      title: "build surveys that work for you",
      badgeLabel: "survey design",
      image: Survey,
      description:
        "Crafting effective surveys is pivotal for gathering meaningful insights. Bentinarly Poll  provides a comprehensive suite of tools to streamline your survey creation process:",
      trailText: "",
      bulletPoints: [
        "Diverse Question Types: Utilize various formats such as multiple-choice, Likert scales, open-ended responses, and ranking questions to suit your research needs.",
        "Advanced Logic & Branching: Implement skip logic and conditional branching to guide respondents through personalized paths based on their answers, enhancing relevance and reducing survey fatigue.",
        "Screening Capabilities: Set up screening questions to ensure that only qualified participants proceed, improving data quality and targeting accuracy.",
        "Customizable Layouts: Arrange questions in a logical flow, group related items, and design intuitive interfaces to enhance respondent engagement.",
        "Real-Time Previews: Test your surveys as you build them, ensuring functionality and a seamless respondent experience.",
      ],
    },
    {
      imgPosition: "left",
      title: "transform data into insights",
      badgeLabel: "analytics",
      image: Analytics,
      description:
        "Bentinarly Poll’s analytics tools empower you to delve deep into your collected data, uncovering meaningful patterns and trends:",
      trailText:
        "With Bentinarly Poll, transform raw data into actionable insights that drive informed decisions.",
      bulletPoints: [
        "Real-Time Dashboards: Monitor responses as they come in, allowing for immediate insights and timely decision-making.",
        "Advanced Filtering & Segmentation: Break down data by demographics, behaviors, or custom criteria to identify nuanced differences across audience groups.",
        "Visual Data Representation: Utilize dynamic charts and graphs to visualize trends, making complex data easily understandable and shareable.",
        "Export Options: Download your data in various formats (e.g., CSV, Excel, PDF) for further analysis or integration with other tools.",
      ],
    },
    {
      imgPosition: "right",
      title: "engage with authentic voices",
      badgeLabel: "real members",
      image: Members,
      description: "Connect directly with a diverse and verified pool of Africans:",
      trailText:
        "Bentinarly Poll facilitates meaningful connections with real participants, providing the authentic insights necessary for impactful research.",
      bulletPoints: [
        "Rigorous Screening Processes: Ensure participant authenticity and relevance through comprehensive screening and verification methods.",
        "Targeted Recruitment: Specify demographics, behaviors, or other criteria to reach the exact audience your research requires.",
        "Incentivized Participation: Motivate respondents with appropriate incentives, enhancing engagement and data quality.",
        "Ethical Standards Compliance: Adhere to ethical research practices, ensuring participant confidentiality and data protection.",
      ],
    },
  ];

  return (
    <div className="dark:bg-[#0B0B0B]">
      <Hero />
      <div className="md:w-[900px] lg:w-[1200px] mx-auto space-y-8 md:space-y-20 py-20 ">
        {features.map((section, index) => (
          <FeatureSection
            key={index}
            imgPosition={section.imgPosition}
            description={section.description}
            image={section.image}
            title={section.title}
            bulletPoints={section.bulletPoints}
            badgeLabel={section.badgeLabel}
            trailText={section.trailText}
          />
        ))}
      </div>
    </div>
  );
};

export default Solutions;
