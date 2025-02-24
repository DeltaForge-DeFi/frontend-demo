import { Header } from '@/widgets/header';

import { Github, Triangle } from 'lucide-react';

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Pagination } from 'swiper/modules';

import 'swiper/swiper-bundle.css';

import './style.css';
import { Footer } from '@/shared/ui/footer';
import { Link } from '@tanstack/react-router';

const Card = ({ title, description }: { title: string; description: string; link: string }) => {
  return (
    <a
      className="group col-span-4 flex flex-col border border-white font-mono md:col-span-4"
      href=""
      target="_blank"
      data-type="web3"
      style={{ opacity: 1 }}
    >
      <div className="bg-white px-8 py-4 text-black transition-all duration-150 ease-in-out group-hover:bg-black group-hover:text-white">
        <h3 className="text-18 leading-27">{title}</h3>
      </div>
      <div className="text-title flex flex-1 flex-col justify-between px-6 pb-4 pt-4 transition-all duration-150 ease-in-out group-hover:bg-white group-hover:text-black">
        <p className="leading-27 text-xs">{description}</p>
        <div className="mt-8 flex justify-end">
          <div className="text-title h-5 w-5 transition-all duration-150 ease-in-out group-hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" width="100%" height="100%">
              <path
                fill="currentColor"
                d="M.703 1.455A.69.69 0 000 2.158v13.138A.69.69 0 00.703 16H13.82a.69.69 0 00.703-.704V7.79H13.12v6.803H1.406V2.862h6.793V1.455c0 .023-7.496.023-7.496 0z"
              ></path>
              <path fill="currentColor" d="M8.128 8.845l6.466-6.452v2.604H16V0h-5.014v1.408h2.6L7.146 7.859l.983.986z"></path>
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
};

const Slide1 = () => {
  return (
    <>
      {/* <div className="h-50 w-50 col-span-12 md:col-span-4 md:col-start-8">
        <video src={logo} autoPlay loop playsInline className="h-30 w-30" />
      </div> */}
      <div className="lg:pt-88 col-span-12 md:col-span-6 md:mt-0 md:flex md:flex-col md:justify-center md:py-10 lg:col-start-2">
        <span className="mb-3 text-2xl font-medium leading-8 opacity-20 md:text-4xl md:leading-10">01</span>
        <h1 className="text-title md:leading-16 mb-4 font-sans text-3xl font-medium uppercase leading-10 tracking-widest md:text-5xl">
          Unlocking Investment Strategies
        </h1>
        <p className="text-bodytype mb-6 font-mono text-sm leading-6 md:pr-0 md:text-base md:leading-7 lg:pr-48">
          Simply protocol that simplifies access to complex investment strategies, making them safe and easy for everyone
        </p>
        <div className="flex flex-col gap-4 md:flex-row lg:pr-48">
          <a
            href={import.meta.env.VITE_DOCS_URL}
            target="_blank"
            className="text-16 leading-25 tracking-8 inline-block w-full border border-white py-5 text-center font-medium uppercase transition-all duration-150 ease-in-out hover:bg-white hover:text-black"
          >
            DOCS
          </a>
          <Link to="/lite" className=''>
            <button className="text-16 leading-25 min-w-[200px] tracking-8 inline-block w-full border border-white py-5 text-center font-medium uppercase transition-all duration-150 ease-in-out hover:bg-white hover:text-black">
              OPEN
            </button>
          </Link>
        </div>
      </div>
      <div className="relative col-span-12 flex justify-center">
        <div className="absolute left-1/2 top-0 -z-10 h-16 w-0.5 -translate-x-1/2 transform md:h-60">
          <div className="absolute left-0 top-0 h-1/5 w-full bg-gradient-to-b from-black to-transparent"></div>
          <svg viewBox="0 0 2 148">
            <defs>
              <mask id="SvgSectionFourTopMask">
                <path fill="none" stroke="#fff" stroke-dasharray="2 2" stroke-width="2" d="M1 0L1 148" vector-effect="non-scaling-stroke"></path>
              </mask>
              <radialGradient id="SvgSectionFourTopRGrad" cx="50%" cy="50%" r="50%">
                <stop offset="40%" stop-color="#FF0" stop-opacity="1"></stop>
                <stop offset="100%" stop-opacity="0"></stop>
              </radialGradient>
            </defs>
            {/* <path fill="none" stroke="#fff" stroke-dasharray="2 2" stroke-width="2" d="M1 0L1 148" vector-effect="non-scaling-stroke"></path> */}
            {/* <circle cx="0" cy="16.33333%" r="29.6" fill="url(#SvgSectionFourTopRGrad)" mask="url(#SvgSectionFourTopMask)"></circle> */}
          </svg>
        </div>
      </div>
    </>
  );
};

const Slide4 = () => {
  return (
    <>
      <div className="col-span-10 col-start-2 text-center">
        <h2 className="text-30 leading-39 md:text-48 inline-block bg-black text-center font-sans font-medium uppercase tracking-[0.2rem] md:leading-[6.24rem]">
          Want to try?
        </h2>
      </div>
      <div className="col-span-10 col-start-2 mb-5 text-center">
        <p className="text-14 leading-21 text-bodytype font-mono md:pr-0">Become an early service developer, or testnet node operator.</p>
      </div>
      {/* <div className="relative col-span-12">
        <div className="relative col-span-8 hidden md:col-start-8 lg:block">
          <div className="absolute left-0 top-0 h-[30%] w-full bg-gradient-to-b from-black from-20% to-transparent"></div>
          <div className="aspect-[600/160]">
            <svg viewBox="0 0 600 160">
              <defs>
                <mask id="svgSectionSixBottomMask1">
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeDasharray="2 2"
                    strokeWidth="2"
                    d="M300 0L300 120 300 120L1 120 1 120L1 160"
                    vectorEffect="non-scaling-stroke"
                  ></path>
                </mask>
                <mask id="svgSectionSixBottomMask2">
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeDasharray="2 2"
                    strokeWidth="2"
                    d="M300 0L300 120 300 120L600 120 599 120L599 160"
                    vectorEffect="non-scaling-stroke"
                  ></path>
                </mask>
                <radialGradient id="svgSectionSixBottomGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="40%" stopColor="#FF0" stopOpacity="1"></stop>
                  <stop offset="100%" stopOpacity="0"></stop>
                </radialGradient>
              </defs>
              <path
                fill="none"
                stroke="#fff"
                strokeDasharray="2 2"
                strokeWidth="2"
                d="M300 0L300 120 300 120L1 120 1 120L1 160"
                vectorEffect="non-scaling-stroke"
              ></path>
              <path
                fill="none"
                stroke="#fff"
                strokeDasharray="2 2"
                strokeWidth="2"
                d="M300 0L300 120 300 120L600 120 599 120L599 160"
                vectorEffect="non-scaling-stroke"
              ></path>
              <circle cx="0%" cy="94.85%" r="32" fill="url(#svgSectionSixBottomGradient)" mask="url(#svgSectionSixBottomMask1)"></circle>
              <circle cx="100%" cy="94.85%" r="32" fill="url(#svgSectionSixBottomGradient)" mask="url(#svgSectionSixBottomMask2)"></circle>
            </svg>
          </div>
        </div>
      </div> */}
      <div className="mb-42 mt-160 col-span-8 col-start-4 lg:col-span-3 lg:col-start-3 lg:mt-0">
        <h3 className="text-24 font-bold uppercase leading-[3.12rem] tracking-[0.36rem]">Lite version</h3>
        <p className="text-18 leading-27 mb-16 mt-12 font-mono">Run edge nodes on Fleek Network to perform work and earn fees.</p>
        <a target="_blank" href="">
          <button className="text-16 leading-25 tracking-8 inline-block w-full border border-white py-14 text-center font-medium uppercase transition-all duration-150 ease-in-out hover:bg-white hover:text-black">
            LITE
          </button>
        </a>
      </div>
      <div className="col-span-8 col-start-4 lg:col-span-3 lg:col-start-8">
        <h3 className="text-24 font-bold uppercase leading-[3.12rem] tracking-[0.36rem]">Pro version</h3>
        <p className="text-18 leading-27 mb-16 mt-12 font-mono">Build or utilize decentralized web and edge services.</p>
        <a target="_blank" href={import.meta.env.VITE_DOCS_URL}>
          <button className="text-16 leading-25 tracking-8 inline-block w-full border border-white py-14 text-center font-medium uppercase transition-all duration-150 ease-in-out hover:bg-white hover:text-black">
            PRO
          </button>
        </a>
      </div>
    </>
  );
};

export const HomePage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handlePlay = () => {
        console.log('Video is playing');
      };

      const handleError = (e: Event) => {
        console.error('Error occurred while playing the video', e);
      };

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('error', handleError);

      // Attempt to play the video programmatically
      videoElement.play().catch((error) => {
        console.error('Autoplay was prevented:', error);
      });

      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, []);

  return (
    <div>
      <Swiper
        direction={'vertical'}
        slidesPerView={1}
        spaceBetween={1}
        freeMode={true}
        mousewheel={true}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => `<div class="${className}">${index + 1}</div>`,
        }}
        modules={[FreeMode, Mousewheel, Pagination]}
        className=""
      >
        <SwiperSlide
          style={{
            alignItems: 'start',
          }}
        >
          <div className="container items-start">
            <div className="mx-auto grid grid-cols-12">
              <div className="col-span-12">
                <Header />
              </div>
              <Slide1 />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="container">
            <div className="grid grid-flow-dense grid-cols-12 gap-16">
              <div className="relative col-span-12 flex md:col-span-5 md:col-start-8 md:flex md:flex-col md:justify-center lg:col-span-4 lg:col-start-8">
                <div>
                  <span className="mb-3 text-2xl font-medium leading-8 opacity-20 md:text-4xl md:leading-10">02</span>
                  <h2 className="text-30 leading-39 md:text-48 mb-16 font-sans font-medium uppercase tracking-[0.2rem] md:leading-[6.24rem]">
                    Giving Web3 an edge
                  </h2>
                  <ul className="text-18 text-bodytype md:text-24 font-mono uppercase leading-[3.24rem] md:leading-[4.32rem]">
                    <li className="flex items-center">
                      <span className="inline-block">High Performance</span>
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block">Low Latency</span>
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block">Geo-Aware</span>
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block">Decentralized</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="container">
            <div className="grid grid-cols-12">
              <div className="col-span-11">
                <span className="mb-3 text-2xl font-medium leading-8 opacity-20 md:text-4xl md:leading-10">03</span>
                <h2 className="text-30 leading-39 md:text-48 mb-16 font-sans font-medium uppercase tracking-[0.2rem] md:leading-[6.24rem]">
                  Giving Web3 an edge
                </h2>
                <div className="my-4 grid grid-cols-12 gap-4">
                  <Card
                    title="GMX"
                    description="Build a service that allows you to run a sequencer on the edge, providing performance, decentralization, and transparency benefits."
                    link="https://gmx.io/docs/intro/#/"
                  />
                  <Card
                    title="AAVE"
                    description="Build a service that allows you to run a sequencer on the edge, providing performance, decentralization, and transparency benefits."
                    link=""
                  />
                  <Card
                    title="Uniswap"
                    description="Build a service that allows you to run a sequencer on the edge, providing performance, decentralization, and transparency benefits."
                    link=""
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="container">
            <div className="grid grid-cols-12">
              <Slide4 />
              <div className="col-span-12 text-center">
                <Footer
                  logo={<Triangle />}
                  brandName={'Delta Forge'}
                  socialLinks={[
                    {
                      icon: <Github />,
                      href: 'https://github.com/DeltaForge-DeFi',
                      label: 'Github',
                    },
                  ]}
                  mainLinks={[{ href: '/contact', label: 'Contact' }]}
                  legalLinks={[{ href: '/terms', label: 'Terms' }]}
                  copyright={{
                    text: ' Delta Forge',
                    license: '',
                  }}
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
