import { memo, useEffect } from 'react';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
`;
const LicHome = memo(() => {
  useEffect(() => {
    const scripts = [
      { src: '/public/scripts/sidebarToggle.js', defer: true },
      { src: '/public/scripts/scrollToTop.js', defer: true },
      { src: '/public/scripts/faqToggle.js', defer: true },
      { src: '/public/scripts/search.js', defer: true },
      { src: '/public/scripts/langToggleCaseStudy.js', defer: true },
      { src: '/public/scripts/audio.js', defer: true },
            { src: '/public/scripts/animations.js', defer: true },
                  { src: '/public/scripts/impactAnimations.js', defer: true },
                  { src: '/public/scripts/progressBorder.js', defer: true },
                  { src: '/public/scripts/projectHover.js', defer: true },
                        { src: '/public/scripts/awsManager.js', defer: true },

                  { src: '/public/scripts/awsArchitecture.js', defer: true },
                  { src: '/public/scripts/awsDataFlow.js', defer: true },
                  { src: '/public/scripts/awsTooltip.js', defer: true },
                  { src: '/public/scripts/awsControls.js', defer: true },


    ];

    scripts.forEach(({ src, defer }) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = defer;
      document.head.appendChild(script);
    });

    // Cleanup
    return () => {
      scriptUrls.forEach((url) => {
        const script = document.querySelector(`script[src="${url}"]`);
        if (script) document.body.removeChild(script);
      });
    };
  }, []);

  return (
    <Layout>
      <Content>
        <div dangerouslySetInnerHTML={{ __html: window.__INITIAL_HTML__ || '' }} />
      </Content>
    </Layout>
  );
});

export default LicHome;
