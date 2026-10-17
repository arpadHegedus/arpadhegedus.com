import { testimonials } from '@/content/testimonials';
import './TestimonialsSection.css';

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
