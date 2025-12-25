import { siteConfig, generateFAQJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import {
    generateHowToJsonLd,
    generateWebApplicationJsonLd,
    generateProductReviewJsonLd,
    generateSpeakableJsonLd
} from "@/lib/schema";
import { shopeFAQs } from "@/lib/faq-data";
import { JsonLd } from "./JsonLd";

// ============================================
// Tổng hợp tất cả Schema cho trang chủ
// ============================================
export function HomePageSchema() {
    const breadcrumbs = [
        { name: "Trang chủ", url: siteConfig.url },
    ];

    return (
        <>
            <JsonLd data={generateHowToJsonLd()} />
            <JsonLd data={generateWebApplicationJsonLd()} />
            <JsonLd data={generateFAQJsonLd(shopeFAQs)} />
            <JsonLd data={generateBreadcrumbJsonLd(breadcrumbs)} />
            <JsonLd data={generateProductReviewJsonLd()} />
            <JsonLd data={generateSpeakableJsonLd(["h1", ".hero-description", ".faq-section"])} />
        </>
    );
}

// ============================================
// Schema cho trang con
// ============================================
export function PageSchema({
    pageName,
    pageUrl,
    includeFAQ = false,
}: {
    pageName: string;
    pageUrl: string;
    includeFAQ?: boolean;
}) {
    const breadcrumbs = [
        { name: "Trang chủ", url: siteConfig.url },
        { name: pageName, url: pageUrl },
    ];

    return (
        <>
            <JsonLd data={generateBreadcrumbJsonLd(breadcrumbs)} />
            {includeFAQ && <JsonLd data={generateFAQJsonLd(shopeFAQs)} />}
        </>
    );
}
