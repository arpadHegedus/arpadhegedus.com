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
            <Guide className="border left start" />
            <Guide className="border right start" />
            <Guide className="border down start" />
            <Guide className="border down end" />
            <Guide className="border right end" />
            <Guide className="border left end" />
        </>
    );
}