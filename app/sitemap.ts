import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.url;

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        // Thêm các trang tĩnh khác ở đây
        // {
        //   url: `${baseUrl}/about`,
        //   lastModified: new Date(),
        //   changeFrequency: "monthly",
        //   priority: 0.8,
        // },
        // {
        //   url: `${baseUrl}/contact`,
        //   lastModified: new Date(),
        //   changeFrequency: "monthly",
        //   priority: 0.5,
        // },
    ];

    // Dynamic pages (nếu có)
    // Ví dụ: fetch từ database hoặc CMS
    // const dynamicPages = await fetchDynamicPages();

    return [...staticPages];
}
