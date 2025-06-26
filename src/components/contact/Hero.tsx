import ContactSection from "./ContactSection";

const Hero = () => {
  return (
    <div className="min-h-screen md:h-auto lg:min-h-screen py-20 bg-cover bg-center bg-no-repeat bg-[url('assets/images/about-background.png')] dark:bg-[url('assets/images/about-dark.png')]">
      <div className="md:w-[780px] lg:w-[1200px] mx-auto">
        <div className="my-8 lg:my-12">
          <p className="mx-auto w-[398px] md:w-[500px] lg:w-[773px] text-center font-bold text-[24px] lg:text-[40px] leading-[100%] tracking-[0%] mb-4">
            We're Here to Connect
          </p>
          <p className="text-base md:text-xl text-center mx-auto w-[398px] md:w-[750px] lg:w-[930px] leading-[100%] tracking-[0%]">
            At Bentinarly Poll, we value every voice and are committed to fostering meaningful
            connections. Whether you have questions, feedback, or collaboration ideas, we're eager
            to hear from you.
          </p>
        </div>
        <div>
          <ContactSection />
        </div>
      </div>
    </div>
  );
};

export default Hero;
