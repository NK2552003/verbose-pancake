
import { useEffect, useState } from 'react';
import ScrollReveal from 'scrollreveal';
import LenisWrapper from './LenisWrapper';

const TerminalSec = () => {
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css'>('preview');

   // ScrollReveal initialization
   useEffect(() => {
    const sr = ScrollReveal({
        reset: false,
        distance: '20px',
        duration: 1000,
    });

    // Configure animations for different elements
    sr.reveal('.sr-about-header', { origin: 'top', delay: 200 });
    sr.reveal('.sr-about-title', { origin: 'bottom', delay: 300 });
    sr.reveal('.sr-about-subtitle', { origin: 'bottom', delay: 400 });
    sr.reveal('.sr-about-container', { origin: 'bottom', delay: 500 });
    sr.reveal('.sr-about-tabs button', { origin: 'bottom', delay: 600, interval: 100 });
    sr.reveal('.sr-about-content', { origin: 'bottom', delay: 700 });

    return () => {
        sr.destroy();
    };
}, []);

  const htmlContent = `
    <div class="about-me-container">
      <div class="about-me-left">
        <div class="backDivBlank"></div>
        <div class="profile-image-wrapper">
          <img src="/pro.png" alt="Profile Image of a Boy" class="profile-image">
        </div>
        <div class="social-icons">
          <a href="https://github.com/NK2552003" class="social-icon">git</a>
          <a href="https://www.linkedin.com/in/nk2552003/" class="social-icon">in</a>
          <a href="https://www.instagram.com/nitish.2432/" class="social-icon">ig</a>
        </div>
      </div>
      <div class="about-me-right">
        <h1 class="about-me-title">About Me.</h1>
        <p class="about-me-description">
          I'm a passionate developer and a third-year undergraduate engineering student, constantly experimenting with code and learning new technologies. My approach to development is built around three core ideas:
        </p>
        <div class="tree-subject">
          <div class="tree-subject-item">
            I love breaking down complex problems and crafting clean, efficient code. Think of me as a problem solver.
          </div>
          <div class="tree-subject-item">
            I organize ideas into functional, user-friendly solutions, whether it's building a web app or optimizing an existing system. You can call me a solution architect in training.
          </div>
          <div class="tree-subject-item">
            I'm always eager to explore new tools, frameworks, and methodologies to refine my craft and stay ahead in the tech world.
          </div>
        </div>
      </div>
    </div>
  `;

  const htmlContent2 = `
    <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"about-me-container"</span><span class="tag">&gt;</span>
      <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"about-me-left"</span><span class="tag">&gt;</span>
        <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"backDivBlank"</span><span class="tag">&gt;&lt;/div&gt;</span>
        <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"profile-image-wrapper"</span><span class="tag">&gt;</span>
          <span class="tag">&lt;img</span> <span class="attribute">src</span>=<span class="string">"./Assets/images/1.png"</span> <span class="attribute">alt</span>=<span class="string">""</span> <span class="attribute">class</span>=<span class="string">"profile-image"</span><span class="tag">&gt;</span>
        <span class="tag">&lt;/div&gt;</span>
        <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"social-icons"</span><span class="tag">&gt;</span>
          <span class="tag">&lt;a</span> <span class="attribute">href</span>=<span class="string">"#"</span> <span class="attribute">class</span>=<span class="string">"social-icon"</span><span class="tag">&gt;</span>Github Icon Here<span class="tag">&lt;/a&gt;</span>
          <span class="tag">&lt;a</span> <span class="attribute">href</span>=<span class="string">"#"</span> <span class="attribute">class</span>=<span class="string">"social-icon"</span><span class="tag">&gt;</span>Linkedin Icon Here<span class="tag">&lt;/a&gt;</span>
          <span class="tag">&lt;a</span> <span class="attribute">href</span>=<span class="string">"#"</span> <span class="attribute">class</span>=<span class="string">"social-icon"</span><span class="tag">&gt;</span>Codepen Icon Here<span class="tag">&lt;/a&gt;</span>
        <span class="tag">&lt;/div&gt;</span>
      <span class="tag">&lt;/div&gt;</span>
      <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"about-me-right"</span><span class="tag">&gt;</span>
        <span class="tag">&lt;h1</span> <span class="attribute">class</span>=<span class="string">"about-me-title"</span><span class="tag">&gt;</span>About Me.<span class="tag">&lt;/h1&gt;</span>
        <span class="tag">&lt;p</span> <span class="attribute">class</span>=<span class="string">"about-me-description"</span><span class="tag">&gt;</span>
          I'm a passionate developer and a third-year undergraduate engineering student, constantly experimenting with code and learning new technologies. My approach to development is built around three core ideas:
        <span class="tag">&lt;/p&gt;</span>
        <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"tree-subject"</span><span class="tag">&gt;</span>
          <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"tree-subject-item"</span><span class="tag">&gt;</span>
            I love breaking down complex problems and crafting clean, efficient code. Think of me as a problem solver.
          <span class="tag">&lt;/div&gt;</span>
          <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"tree-subject-item"</span><span class="tag">&gt;</span>
            I organize ideas into functional, user-friendly solutions, whether it's building a web app or optimizing an existing system. You can call me a solution architect in training.
          <span class="tag">&lt;/div&gt;</span>
          <span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">"tree-subject-item"</span><span class="tag">&gt;</span>
            I'm always eager to explore new tools, frameworks, and methodologies to refine my craft and stay ahead in the tech world.
          <span class="tag">&lt;/div&gt;</span>
        <span class="tag">&lt;/div&gt;</span>
      <span class="tag">&lt;/div&gt;</span>
    <span class="tag">&lt;/div&gt;</span>
  `;

  const cssContent = `
    <span class="selector">.about-me-container</span> <span class="punctuation">{</span>
      <span class="property">display</span><span class="punctuation">:</span> <span class="value">flex</span><span class="punctuation">;</span>
      <span class="property">max-width</span><span class="punctuation">:</span> <span class="value">1200px</span><span class="punctuation">;</span>
      <span class="property">margin</span><span class="punctuation">:</span> <span class="value">0 auto</span><span class="punctuation">;</span>
      <span class="property">padding</span><span class="punctuation">:</span> <span class="value">2rem</span><span class="punctuation">;</span>
      <span class="property">background-color</span><span class="punctuation">:</span> <span class="value">#f8f9fa</span><span class="punctuation">;</span>
      <span class="property">border-radius</span><span class="punctuation">:</span> <span class="value">10px</span><span class="punctuation">;</span>
      <span class="property">box-shadow</span><span class="punctuation">:</span> <span class="value">0 4px 6px rgba(0, 0, 0, 0.1)</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.about-me-left</span> <span class="punctuation">{</span>
      <span class="property">flex</span><span class="punctuation">:</span> <span class="value">1</span><span class="punctuation">;</span>
      <span class="property">display</span><span class="punctuation">:</span> <span class="value">flex</span><span class="punctuation">;</span>
      <span class="property">flex-direction</span><span class="punctuation">:</span> <span class="value">column</span><span class="punctuation">;</span>
      <span class="property">align-items</span><span class="punctuation">:</span> <span class="value">center</span><span class="punctuation">;</span>
      <span class="property">padding-right</span><span class="punctuation">:</span> <span class="value">2rem</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.profile-image-wrapper</span> <span class="punctuation">{</span>
      <span class="property">width</span><span class="punctuation">:</span> <span class="value">200px</span><span class="punctuation">;</span>
      <span class="property">height</span><span class="punctuation">:</span> <span class="value">200px</span><span class="punctuation">;</span>
      <span class="property">border-radius</span><span class="punctuation">:</span> <span class="value">50%</span><span class="punctuation">;</span>
      <span class="property">overflow</span><span class="punctuation">:</span> <span class="value">hidden</span><span class="punctuation">;</span>
      <span class="property">margin-bottom</span><span class="punctuation">:</span> <span class="value">1rem</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.profile-image</span> <span class="punctuation">{</span>
      <span class="property">width</span><span class="punctuation">:</span> <span class="value">100%</span><span class="punctuation">;</span>
      <span class="property">height</span><span class="punctuation">:</span> <span class="value">100%</span><span class="punctuation">;</span>
      <span class="property">object-fit</span><span class="punctuation">:</span> <span class="value">cover</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.social-icons</span> <span class="punctuation">{</span>
      <span class="property">display</span><span class="punctuation">:</span> <span class="value">flex</span><span class="punctuation">;</span>
      <span class="property">gap</span><span class="punctuation">:</span> <span class="value">1rem</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.social-icon</span> <span class="punctuation">{</span>
      <span class="property">font-size</span><span class="punctuation">:</span> <span class="value">1.5rem</span><span class="punctuation">;</span>
      <span class="property">color</span><span class="punctuation">:</span> <span class="value">#333</span><span class="punctuation">;</span>
      <span class="property">text-decoration</span><span class="punctuation">:</span> <span class="value">none</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.about-me-right</span> <span class="punctuation">{</span>
      <span class="property">flex</span><span class="punctuation">:</span> <span class="value">2</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.about-me-title</span> <span class="punctuation">{</span>
      <span class="property">font-size</span><span class="punctuation">:</span> <span class="value">2.5rem</span><span class="punctuation">;</span>
      <span class="property">margin-bottom</span><span class="punctuation">:</span> <span class="value">1rem</span><span class="punctuation">;</span>
      <span class="property">color</span><span class="punctuation">:</span> <span class="value">#333</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.about-me-description</span> <span class="punctuation">{</span>
      <span class="property">font-size</span><span class="punctuation">:</span> <span class="value">1rem</span><span class="punctuation">;</span>
      <span class="property">line-height</span><span class="punctuation">:</span> <span class="value">1.6</span><span class="punctuation">;</span>
      <span class="property">margin-bottom</span><span class="punctuation">:</span> <span class="value">1.5rem</span><span class="punctuation">;</span>
      <span class="property">color</span><span class="punctuation">:</span> <span class="value">#555</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.tree-subject</span> <span class="punctuation">{</span>
      <span class="property">display</span><span class="punctuation">:</span> <span class="value">flex</span><span class="punctuation">;</span>
      <span class="property">flex-direction</span><span class="punctuation">:</span> <span class="value">column</span><span class="punctuation">;</span>
      <span class="property">gap</span><span class="punctuation">:</span> <span class="value">1rem</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="selector">.tree-subject-item</span> <span class="punctuation">{</span>
      <span class="property">background-color</span><span class="punctuation">:</span> <span class="value">#fff</span><span class="punctuation">;</span>
      <span class="property">padding</span><span class="punctuation">:</span> <span class="value">1rem</span><span class="punctuation">;</span>
      <span class="property">border-radius</span><span class="punctuation">:</span> <span class="value">5px</span><span class="punctuation">;</span>
      <span class="property">box-shadow</span><span class="punctuation">:</span> <span class="value">0 2px 4px rgba(0, 0, 0, 0.05)</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>
  `;

  const renderContent = () => {

    
    switch (activeTab) {
      case 'preview':
        return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
      case 'html':
        return <pre><code dangerouslySetInnerHTML={{ __html: htmlContent2 }} /></pre>;
      case 'css':
        return <pre><code dangerouslySetInnerHTML={{ __html: cssContent }} /></pre>;
      default:
        return null;
    }
  };

  return (
    <div>
    {/* Gradient Overlay with ScrollReveal class */}
    <div className="w-[100%] relative transition-all sr-about-header">
        <div className="relative h-auto inset-0">
            <div className="flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] text-center text-white relative z-10 p-4" id="about">
                <h1 className="sr-about-title text-3xl sm:text-4xl md:text-5xl font-bold mb-2 mt-20">
                    A Glimpse Into My World
                </h1>
                <p className="sr-about-subtitle text-sm sm:text-base md:text-lg text-white/80">
                    Learn more about who I am, what I do, and what inspires me.
                </p>
            </div>
        </div>
    </div>

    {/* Main Content Container with ScrollReveal class */}
    <div className="sr-about-container flex justify-center items-center mt-24 bg-transparent text-gray-100 ml-2 mr-2">
        <div className="w-[96%] h-[100%] bg-black/30 rounded-lg overflow-hidden shadow-lg border-[0.5px] border-white/40 backdrop-blur-lg">
            {/* Top Bar */}
            <div className="bg-black/80 p-3 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            {/* Tabs with ScrollReveal class */}
            <div className="bg-black/30 flex">
                <button
                    className={`sr-about-tabs px-4 py-2 text-[12px] sm:text-base ml-3 m-1 rounded-2xl ${
                        activeTab === 'preview' ? 'bg-black/50 border-t-2 border-teal-500' : 'bg-gray-700/40'
                    }`}
                    onClick={() => setActiveTab('preview')}
                >
                    Preview
                </button>
                <button
                    className={`sr-about-tabs px-4 py-2 text-[12px] sm:text-base m-1 rounded-2xl ${
                        activeTab === 'html' ? 'bg-black/50 border-t-2 border-teal-500' : 'bg-gray-700/40'
                    }`}
                    onClick={() => setActiveTab('html')}
                >
                    index.html
                </button>
                <button
                    className={`sr-about-tabs px-4 py-2 text-[12px] sm:text-base m-1 rounded-2xl ${
                        activeTab === 'css' ? 'bg-black/50 border-t-2 border-teal-500' : 'bg-gray-700/40'
                    }`}
                    onClick={() => setActiveTab('css')}
                >
                    styles.css
                </button>
            </div>
            <LenisWrapper>
            <div className="sr-about-content h-[100%] overflow-y-auto p-5 backdrop-blur-sm bg-black/30 text-[14px] sm:text-base">
                {renderContent()}
            </div>
            </LenisWrapper>
        </div>
    </div>
</div>
);
};

export default TerminalSec;