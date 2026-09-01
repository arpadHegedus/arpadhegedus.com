'use client';

import Guide, { GuideBorder } from './Guide';
import './TextSection.css';

type TextSectionProps = {
  children: React.ReactNode;
};

export default function TextSection({ children }: TextSectionProps) {
  return (
    <div className="text section">
        <Guide className="start" />
        <div className="main">
            <GuideBorder />
            <div className="typo">
                {children}
            </div>
        </div>
        <Guide className="end" />
    </div>
  );
}