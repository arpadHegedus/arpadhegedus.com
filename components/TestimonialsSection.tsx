import './TestimonialsSection.css';

const testimonials = [
    { quote: 'Great work connects the big picture with the smallest details.', cite: 'A shared perspective' },
    { quote: 'Thoughtful collaboration turns complex challenges into clear, human experiences.', cite: 'A lasting partnership' },
];

export default function TestimonialsSection() {
    return (
        <section className="testimonials section" data-guide-section="testimonials" aria-label="Testimonials">
            <div className="testimonial-grid">
                {testimonials.map(({ quote, cite }) => (
                    <blockquote className="testimonial-card" data-guide-testimonial key={cite}>
                        <div className="typo">
                            <p>{quote}</p>
                            <cite>{cite}</cite>
                        </div>
                    </blockquote>
                ))}
            </div>
        </section>
    );
}
