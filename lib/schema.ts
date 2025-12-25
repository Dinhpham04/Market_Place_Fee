import { siteConfig } from "@/lib/seo";

// ============================================
// HowTo Schema - Hướng dẫn sử dụng công cụ
// ============================================
export function generateHowToJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Cách tính lãi và phí bán hàng trên Shopee",
        description: "Hướng dẫn chi tiết cách sử dụng công cụ tính lãi Shopee để tính toán lợi nhuận, phí vận chuyển và các khoản khấu trừ.",
        image: `${siteConfig.url}/og-image.png`,
        totalTime: "PT2M",
        estimatedCost: {
            "@type": "MonetaryAmount",
            currency: "VND",
            value: "0",
        },
        step: [
            {
                "@type": "HowToStep",
                name: "Nhập giá bán sản phẩm",
                text: "Nhập giá bán niêm yết của sản phẩm trên Shopee",
                position: 1,
            },
            {
                "@type": "HowToStep",
                name: "Nhập giá vốn",
                text: "Nhập giá nhập hàng hoặc chi phí sản xuất của sản phẩm",
                position: 2,
            },
            {
                "@type": "HowToStep",
                name: "Chọn phương thức vận chuyển",
                text: "Chọn đơn vị vận chuyển và phương thức giao hàng",
                position: 3,
            },
            {
                "@type": "HowToStep",
                name: "Xem kết quả",
                text: "Công cụ sẽ tự động tính toán và hiển thị lợi nhuận, các loại phí",
                position: 4,
            },
        ],
    };
}

// ============================================
// WebApplication Schema - Chi tiết hơn
// ============================================
export function generateWebApplicationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0.0",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "VND",
            availability: "https://schema.org/InStock",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "150",
            bestRating: "5",
            worstRating: "1",
        },
        featureList: [
            "Tính phí bán hàng Shopee",
            "Tính phí vận chuyển",
            "Tính lợi nhuận thực",
            "Tính phí thanh toán",
            "Hỗ trợ nhiều loại sản phẩm",
        ],
        screenshot: `${siteConfig.url}/screenshot.png`,
        author: {
            "@type": "Organization",
            name: siteConfig.name,
        },
    };
}

// ============================================
// Article Schema - Cho trang nội dung
// ============================================
export function generateArticleJsonLd({
    title,
    description,
    publishedTime,
    modifiedTime,
    image,
    url,
}: {
    title: string;
    description: string;
    publishedTime: string;
    modifiedTime?: string;
    image?: string;
    url: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: image || `${siteConfig.url}/og-image.png`,
        author: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
        },
        publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            logo: {
                "@type": "ImageObject",
                url: `${siteConfig.url}/logo.png`,
            },
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
    };
}

// ============================================
// LocalBusiness Schema (nếu có địa chỉ)
// ============================================
export function generateLocalBusinessJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: "+84-xxx-xxx-xxx", // Thay số thực
        address: {
            "@type": "PostalAddress",
            streetAddress: "Địa chỉ",
            addressLocality: "Thành phố",
            addressRegion: "Tỉnh/Thành",
            postalCode: "000000",
            addressCountry: "VN",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 0, // Thay tọa độ thực
            longitude: 0,
        },
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "00:00",
            closes: "23:59",
        },
        priceRange: "Free",
    };
}

// ============================================
// Review/Rating Schema
// ============================================
export function generateProductReviewJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: siteConfig.name,
        description: siteConfig.description,
        brand: {
            "@type": "Brand",
            name: siteConfig.name,
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "200",
            bestRating: "5",
            worstRating: "1",
        },
        review: [
            {
                "@type": "Review",
                author: {
                    "@type": "Person",
                    name: "Người dùng Shopee",
                },
                datePublished: "2024-12-01",
                reviewBody: "Công cụ rất hữu ích, giúp tôi tính toán chi phí chính xác khi bán hàng trên Shopee.",
                reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5",
                },
            },
        ],
    };
}

// ============================================
// Speakable Schema - Voice Search Optimization
// ============================================
export function generateSpeakableJsonLd(cssSelectors: string[] = ["h1", ".description"]) {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: siteConfig.name,
        speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: cssSelectors,
        },
        url: siteConfig.url,
    };
}

// ============================================
// Video Schema (nếu có video hướng dẫn)
// ============================================
export function generateVideoJsonLd({
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl,
    embedUrl,
}: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string;
    contentUrl?: string;
    embedUrl?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name,
        description,
        thumbnailUrl,
        uploadDate,
        duration,
        contentUrl,
        embedUrl,
        publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            logo: {
                "@type": "ImageObject",
                url: `${siteConfig.url}/logo.png`,
            },
        },
    };
}
