import { shopeFAQs } from "@/lib/faq-data";

interface FAQSectionProps {
    faqs?: { question: string; answer: string }[];
    title?: string;
}

export function FAQSection({
    faqs = shopeFAQs,
    title = "Câu hỏi thường gặp về phí Shopee"
}: FAQSectionProps) {
    return (
        <section className="faq-section" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold mb-6">
                {title}
            </h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <details
                        key={index}
                        className="faq-item group"
                        // Mở câu hỏi đầu tiên mặc định
                        open={index === 0}
                    >
                        <summary className="faq-question cursor-pointer list-none flex justify-between items-center">
                            <span>{faq.question}</span>
                            <span
                                className="transform transition-transform group-open:rotate-180"
                                aria-hidden="true"
                            >
                                ▼
                            </span>
                        </summary>
                        <p className="faq-answer mt-2">
                            {faq.answer}
                        </p>
                    </details>
                ))}
            </div>
        </section>
    );
}
