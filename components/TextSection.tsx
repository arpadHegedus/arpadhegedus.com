import './TextSection.css';

type TextSectionProps = {
  children: React.ReactNode;
};

export default function TextSection({ children }: TextSectionProps) {
  return (
    <div className="text section" data-guide-section="frame">
        <div className="main" data-guide-frame>
            <div className="typo">
                {children}
            </div>
        </div>
    </div>
  );
}