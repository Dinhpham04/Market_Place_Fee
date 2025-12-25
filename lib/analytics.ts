// Google Analytics 4 integration
// Thay YOUR_GA_MEASUREMENT_ID bằng ID thực của bạn

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

// Log page views
export const pageview = (url: string) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};

// Log specific events
export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label: string;
    value?: number;
}) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Track calculator usage
export const trackCalculation = (data: {
    productPrice: number;
    profit: number;
    totalFees: number;
}) => {
    event({
        action: "calculate",
        category: "Calculator",
        label: "Profit Calculation",
        value: data.profit,
    });
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string) => {
    event({
        action: "click",
        category: "CTA",
        label: ctaName,
    });
};

// Declare gtag on window
declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
        dataLayer: unknown[];
    }
}
