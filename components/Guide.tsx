'use client';

import './Guide.css';

interface GuideProps {
    className?: string;
    withDot?: boolean;
}

export default function Guide({ className, withDot = false }: GuideProps) {
  return (
    <>
        <span className={`guide ${className ?? ''}`} />
        { withDot && <span className="dot" /> }
    </>
  );
}

export function GuideBorder() {
    return (
        <>
            <Guide className="border top" />
            <Guide className="border right" />
            <Guide className="border bottom" />
            <Guide className="border left" />
        </>
    );
}