import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { RingLoader } from 'react-spinners';
import SkillTable from './SkillTable';
import { Helmet } from 'react-helmet';

const magicAppear = keyframes`
  0% {
    transform: translateY(100px) scale(0.5);
    opacity: 0;
  }
  60% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.8;
  }
  80% {
    transform: translateY(10px) scale(0.9);
    opacity: 0.9;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }
`;

const ResumeContainer = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 20px;
  max-width: 100%;
  margin: 0 auto;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #282a36, #3d3f51);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  animation: ${magicAppear} 1.5s ease-in-out forwards;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: url('https://sanjaybasket.s3.ap-south-1.amazonaws.com/HogwartsEdX/homebg.webp') no-repeat center center fixed;
    opacity: 0.2;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
`;



const ResumeSubtitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #e5e5e5;
  font-family: 'Roboto', sans-serif;
  font-style: italic;
  animation: ${glow} 2s infinite alternate;
`;

const ResumeLink = styled.a`
  display: inline-block;
  padding: 0.8rem 1.6rem;
  background: linear-gradient(45deg, #6a0dad, #ffb347);
  color: #1a1a1a;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.4rem;
  cursor: pointer;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s, color 0.3s;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  animation: ${magicAppear} 1.5s ease-in-out 0.6s forwards;
`;

const ResumeHeading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  margin-top: 3rem;
  padding: 1rem;
  text-align: center;
  color: #f5c518;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  font-family: 'Harry P', serif;
  animation: ${magicAppear} 1.5s ease-in-out 0.9s forwards;

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #ff5e62, #ff9966);
    position: absolute;
    bottom: -8px;
    left: 0;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Section = styled.div`
  margin: 2rem 0;
  opacity: 0;
  transform: translateY(100px);
  transition: all 1.5s ease-in-out;

  &.in-view {
    opacity: 1;
    transform: translateY(0);
    animation: ${magicAppear} 1.5s ease-in-out forwards;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 2rem 0;
    background-color: black;  

  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  flex: 0 0 auto;
  scroll-snap-align: center;
  width: 60%;
  margin: 0 1rem;
  position: relative;
  transform: scale(0.8);
  transition: transform 0.5s ease, filter 0.5s ease;

  &:hover {
    transform: scale(1);
  }

  &.in-view {
    transform: scale(1);
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

const images = [
  "https://sanjaybasket.s3.ap-south-1.amazonaws.com/Web-Developer-Resume/2.png",
  "https://sanjaybasket.s3.ap-south-1.amazonaws.com/Web-Developer-Resume/3.png",
  "https://sanjaybasket.s3.ap-south-1.amazonaws.com/Web-Developer-Resume/4.png",
  "https://sanjaybasket.s3.ap-south-1.amazonaws.com/Web-Developer-Resume/5.png",
  "https://sanjaybasket.s3.ap-south-1.amazonaws.com/Web-Developer-Resume/6.png"
];

const Resume = () => {
  const pdfResumeUrl = 'https://sanjaybasket.s3.ap-south-1.amazonaws.com/Web-Developer-Resume/Sanjay-Patidar-Resume-Web-Developer.pdf';
  const [downloadCount, setDownloadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleResumeClick = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetch('https://portfolio-api-26jun.onrender.com/api/increment-resume-clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await fetch('https://portfolio-api-26jun.onrender.com/api/get-resume-click-count');
      const data = await response.json();
      setDownloadCount(data.count);
      window.open(pdfResumeUrl, '_blank');
    } catch (error) {
      console.error('Error incrementing resume click count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDownloadCount = async () => {
      try {
        const response = await fetch('https://portfolio-api-26jun.onrender.com/api/get-resume-click-count');
        const data = await response.json();
        setDownloadCount(data.count);
      } catch (error) {
        console.error('Error fetching resume click count:', error);
      }
    };
    fetchDownloadCount();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      if (sections) {
        sections.forEach((section) => observer.unobserve(section));
      }
    };
  }, []);

  return (
    <>
       <Helmet>
        <title>Sanjay Patidar | Web Developer Resume | ATS Score 95</title>
        <meta name="description" content="Unlock Sanjay Patidar's resume to explore his professional experience and skills. Click the link to access the full resume." />
        <meta name="keywords" content="resume, experience, chandigarh university, jawahar Navodaya Vidyalaya, jnv, work, skills, web developer, UI/UX designer" />
        <meta property="og:title" content="Sanjay Patidar | Web Developer Resume | ATS Score 95" />
        <meta property="og:description" content="Unlock Sanjay Patidar's resume to explore his professional experience and skills. Click the link to access the full resume." />
        <meta property="og:url" content="https://sanjay-patidar.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/skillsImage.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sanjay Patidar",
            "url": "https://sanjay-patidar.vercel.app/",
            "image": "https://sanjaybasket.s3.ap-south-1.amazonaws.com/skillsImage.png",
            "sameAs": [
              "https://www.linkedin.com/in/sanjaypatidar10/",
              "https://www.behance.net/sanjaypatidar10"
            ],
            "jobTitle": "Web Developer",
            "worksFor": {
              "@type": "Organization",
              "name": "Chandigarh University",
              "sameAs": "https://www.cuchd.in/"
            },
            "homeLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Indore"
              }
            },
            "description": "Web Developer with skills in JavaScript, React, and Node.js",
            "gender": "Male",
            "knowsAbout": "Web Development",
            "nationality": "Indian"
          })}
        </script>
      </Helmet>
      <ResumeContainer>
        <ResumeSubtitle>
          My Professional Experience and Skills
        </ResumeSubtitle>
        
        <Section className="section">
          <ResumeLink href={pdfResumeUrl} onClick={handleResumeClick}>
            Get Resume
          </ResumeLink>
        </Section>
        <p>Resume downloads: {downloadCount}</p>
      </ResumeContainer>
      <SkillTable />
      <SliderContainer>
        {images.map((image, index) => (
          <Slide key={index} className="slide">
            <Zoom>
              <SlideImage src={image} alt={`Resume image ${index + 1}`} />
            </Zoom>
          </Slide>
        ))}
      </SliderContainer>
      {loading && (
        <LoadingOverlay>
          <RingLoader color="#000" size={60} />
        </LoadingOverlay>
      )}
    </>
  );
};

export default Resume;
