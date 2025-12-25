# Hướng dẫn SEO cho Web Tính Lãi Shopee

## ✅ Đã cài đặt

### 1. Technical SEO
- [x] Metadata đầy đủ (title, description, keywords)
- [x] Open Graph tags cho Facebook
- [x] Twitter Cards
- [x] Canonical URLs
- [x] Robots.txt
- [x] Sitemap động
- [x] Manifest.json (PWA)
- [x] Viewport configuration
- [x] Language tags (vi-VN)

### 2. Structured Data (JSON-LD)
- [x] WebSite schema
- [x] Organization schema
- [x] SoftwareApplication schema
- [x] WebApplication schema
- [x] HowTo schema
- [x] FAQ schema
- [x] Breadcrumb schema
- [x] Product/Review schema
- [x] Speakable schema (Voice Search)
- [x] Article schema (cho blog nếu có)

### 3. Performance (Core Web Vitals)
- [x] Font optimization với display: swap
- [x] Image optimization (AVIF, WebP)
- [x] CSS cho CLS prevention
- [x] Security headers
- [x] Compression enabled

### 4. Accessibility (A11y = SEO)
- [x] Skip to content link
- [x] ARIA labels
- [x] Semantic HTML
- [x] Focus visible styles
- [x] Reduced motion support
- [x] Print styles

### 5. Analytics & Monitoring
- [x] Google Analytics 4 integration
- [x] Event tracking functions
- [x] Google Search Console verification

---

## 📝 Việc cần làm để tối ưu SEO

### Bước 1: Cập nhật thông tin trong `lib/seo.ts`
```typescript
export const siteConfig = {
  url: "https://your-actual-domain.com", // Domain thực
  verification: {
    google: "your-google-code", // Từ Search Console
  },
};
```

### Bước 2: Thêm hình ảnh vào `/public`
- `favicon.ico` (32x32)
- `apple-touch-icon.png` (180x180)
- `icon-192x192.png`
- `icon-512x512.png`
- `logo.png` (cho JSON-LD)
- `screenshot.png` (cho WebApplication schema)

### Bước 3: Đăng ký Google Search Console
1. Vào https://search.google.com/search-console
2. Thêm property với domain của bạn
3. Lấy mã xác minh, thêm vào `lib/seo.ts`
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### Bước 4: Cài đặt Google Analytics
1. Tạo property tại https://analytics.google.com
2. Lấy Measurement ID (G-XXXXXXXXXX)
3. Thêm vào `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### Bước 5: Tối ưu nội dung trang chủ
Với web ít nội dung, cần:
1. **H1 rõ ràng** chứa keyword chính
2. **Mô tả ngắn gọn** công cụ làm gì (hero-description)
3. **FAQ Section** - Rất quan trọng để tăng nội dung!
4. **Hướng dẫn sử dụng** - Tăng dwell time

### Bước 6: Off-page SEO
1. **Backlinks**:
   - Đăng trên các forum Shopee seller
   - Guest post trên blog e-commerce
   - Chia sẻ trên các group Facebook seller

2. **Social Signals**:
   - Tạo page Facebook
   - Chia sẻ công cụ trên các kênh

---

## 🎯 Checklist SEO cho Web Ít Nội Dung

### Content Strategy
- [ ] Viết 1 bài "Hướng dẫn đầy đủ về phí Shopee"
- [ ] Thêm FAQ section (đã có data)
- [ ] Thêm tips/mẹo ngắn
- [ ] Cập nhật thường xuyên khi Shopee đổi phí

### Technical
- [ ] Test với Google Rich Results Test
- [ ] Test với PageSpeed Insights
- [ ] Test với Mobile-Friendly Test
- [ ] Kiểm tra Core Web Vitals

### Monitoring
- [ ] Theo dõi rankings qua Search Console
- [ ] Phân tích traffic qua Google Analytics
- [ ] A/B test các CTA

---

## 📊 KPIs cần theo dõi

1. **Organic Traffic** - Lưu lượng từ Google
2. **Keyword Rankings** - Vị trí keyword "tính lãi shopee"
3. **Click-through Rate** - Tỷ lệ click từ SERP
4. **Bounce Rate** - Tỷ lệ thoát trang
5. **Time on Page** - Thời gian sử dụng

---

## 🔧 Tools hữu ích

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org)
- [Ahrefs/SEMrush](https://ahrefs.com) - Phân tích keyword
