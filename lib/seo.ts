import { Metadata } from "next";

// ============================================
// SITE CONFIGURATION - Thay đổi các giá trị này
// ============================================
export const siteConfig = {
    name: "Tính Lãi Shopee",
    description: "Công cụ tính lãi suất, phí và chi phí khi bán hàng trên Shopee. Tính toán chính xác lợi nhuận, phí vận chuyển, phí thanh toán và các khoản khấu trừ.",
    url: "https://tinh-lai-shopee.vercel.app", // Thay bằng domain thực
    ogImage: "/og-image.png",
    locale: "vi_VN",
    siteName: "Tính Lãi Shopee",
    author: {
        name: "Your Name",
        url: "https://yourwebsite.com",
    },
    keywords: [
        "tính lãi shopee",
        "phí shopee",
        "tính lợi nhuận shopee",
        "phí bán hàng shopee",
        "shopee seller",
        "công cụ shopee",
        "tính phí vận chuyển shopee",
        "shopee calculator",
        "lãi suất shopee",
        "chi phí bán hàng shopee"
    ],
    creator: "Tinh Lai Shopee",
    publisher: "Tinh Lai Shopee",
};

// ============================================
// DEFAULT METADATA
// ============================================
export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,

    // Open Graph
    openGraph: {
        type: "website",
        locale: siteConfig.locale,
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.siteName,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },

    // Twitter
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: "@yourtwitterhandle", // Thay bằng Twitter handle thực
    },

    // Robots
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // Icons
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },

    // Verification (thay bằng mã xác minh thực)
    verification: {
        google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
        // yahoo: "your-yahoo-verification-code",
    },

    // Alternates
    alternates: {
        canonical: siteConfig.url,
        languages: {
            "vi-VN": siteConfig.url,
        },
    },

    // Category
    category: "technology",
};

// ============================================
// HELPER FUNCTION: Tạo metadata cho từng page
// ============================================
export function generatePageMetadata({
    title,
    description,
    path = "",
    image,
    noIndex = false,
}: {
    title: string;
    description: string;
    path?: string;
    image?: string;
    noIndex?: boolean;
}): Metadata {
    const url = `${siteConfig.url}${path}`;
    const ogImage = image || siteConfig.ogImage;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: url,
        },
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}

// ============================================
// JSON-LD STRUCTURED DATA
// ============================================
export function generateWebsiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        inLanguage: "vi-VN",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function generateOrganizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        sameAs: [
            // Thêm các social media links
            // "https://facebook.com/yourpage",
            // "https://twitter.com/yourhandle",
        ],
    };
}

export function generateSoftwareApplicationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "VND",
        },
    };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}
