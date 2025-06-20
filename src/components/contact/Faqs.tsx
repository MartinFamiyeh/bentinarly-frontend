import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "What is Mobile App?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, sequi.",
  },
  {
    question: "What does the App do?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, sequi.",
  },
  {
    question: "Is the App safe and secure?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, sequi.",
  },
  {
    question: "Is there a fee for the App?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, sequi.",
  },
  {
    question: "What features does the App have?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, sequi.",
  },
  {
    question: "Can I use the App for my corporate accounts?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, sequi.",
  },
  {
    question: "What do I need to get started on the App?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, sequi.",
  },
];

const Faqs = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="py-12">
      <div>
        <div className="flex justify-center mb-4">
          <span className="capitalize inline-block mb-2 px-2 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#FFB59436] dark:bg-[#232323] text-[#FE5102] text-xs sm:text-sm font-semibold">
            Need Help? We've Got Answers
          </span>
        </div>
        <div className="mb-6">
          <p className="text-center font-bold text-[24px] lg:text-4xl leading-[100%] tracking-[0%]">
            Frequently Asked Questions
          </p>
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        {faqData.map((item, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            elevation={0}
            disableGutters
            sx={{
              backgroundColor: "transparent",
              "&:before": {
                display: "none",
              },
            }}>
            <AccordionSummary
              expandIcon={
                expanded === `panel${index}` ? (
                  <RemoveIcon sx={{ color: "#f97316" }} />
                ) : (
                  <AddIcon sx={{ color: "#f97316" }} />
                )
              }
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                backgroundColor: "transparent",
                borderBottom: "1px solid #e0e0e0",
                padding: "16px 8px",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}>
              <Typography sx={{ color: "#333" }}>{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: "transparent",
                padding: "16px",
                color: "#555",
              }}>
              <Typography>{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
