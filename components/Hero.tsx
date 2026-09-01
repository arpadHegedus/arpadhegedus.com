'use client';

import Image from "next/image";
import Guide from './Guide';
import './Hero.css';

export default function Hero() {
  return (
    <div className="hero section first">
        <Guide withDot />
        <div className="header">
            <Image
                src="/arpad.webp"
                alt="Arpad Hegedus"
                priority={true}
                width={2565}
                height={2939}
            />
        </div>
        <div className="main">
            <div className="typo">
                <h1><strong>Arpad</strong> Hegedus</h1>
                <p className="title">UX Architect</p>
                <p>Bridging high-end UX and resilient full-stack architecture to scale enterprise web assets and boost agency profitability.</p>
                <div className="actions">
                    <a className='button'>Request a Consultation</a>
                    <a className="button-secondary">View Projects</a>
                </div>
            </div>
        </div>
    </div>
  );
}