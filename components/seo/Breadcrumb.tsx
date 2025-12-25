import Link from "next/link";
import { siteConfig } from "@/lib/seo";

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="text-sm text-muted mb-4"
        >
            <ol
                className="flex flex-wrap items-center gap-2"
                itemScope
                itemType="https://schema.org/BreadcrumbList"
            >
                <li
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                >
                    <Link
                        href="/"
                        itemProp="item"
                        className="hover:text-primary"
                    >
                        <span itemProp="name">Trang chủ</span>
                    </Link>
                    <meta itemProp="position" content="1" />
                </li>

                {items.map((item, index) => (
                    <li
                        key={item.href}
                        itemProp="itemListElement"
                        itemScope
                        itemType="https://schema.org/ListItem"
                        className="flex items-center gap-2"
                    >
                        <span aria-hidden="true">/</span>
                        {index === items.length - 1 ? (
                            <span
                                itemProp="name"
                                aria-current="page"
                                className="text-foreground font-medium"
                            >
                                {item.name}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                itemProp="item"
                                className="hover:text-primary"
                            >
                                <span itemProp="name">{item.name}</span>
                            </Link>
                        )}
                        <meta itemProp="position" content={String(index + 2)} />
                    </li>
                ))}
            </ol>
        </nav>
    );
}
