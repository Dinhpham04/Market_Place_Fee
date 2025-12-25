# ĐẶC TẢ NGHIỆP VỤ CHI TIẾT: CÔNG CỤ TÍNH LÃI SÀN TMĐT

> **Phiên bản:** 2.0  
> **Áp dụng:** Thị trường Việt Nam 2024-2025  
> **Cập nhật:** Tháng 12/2024

---

## MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Từ điển dữ liệu](#2-từ-điển-dữ-liệu-data-dictionary)
3. [Cấu hình phí sàn](#3-cấu-hình-phí-sàn-platform-fees-config)
4. [Logic tính toán](#4-logic-tính-toán-core-business-logic)
5. [Các trường hợp biên](#5-các-trường-hợp-biên-edge-cases)
6. [Use Cases](#6-use-cases)
7. [Wireframe & UI/UX](#7-wireframe--uiux-guidelines)
8. [Phụ lục](#8-phụ-lục)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Mục tiêu sản phẩm

| Mục tiêu | Mô tả |
|----------|-------|
| **Chính** | Tính toán lợi nhuận ròng (Net Profit) khi bán hàng trên Shopee/TikTok Shop |
| **Phụ 1** | Tính tỷ suất lợi nhuận (Profit Margin %) |
| **Phụ 2** | Gợi ý giá bán tối ưu (Reverse Pricing) |
| **Phụ 3** | So sánh lợi nhuận giữa các sàn |

### 1.2. Đối tượng người dùng (User Personas)

| Persona | Đặc điểm | Nhu cầu chính |
|---------|----------|---------------|
| **Seller mới** | Mới bắt đầu, < 100 đơn/tháng | Hiểu cơ cấu phí, tránh bán lỗ |
| **Seller trung bình** | 100-1000 đơn/tháng | Tối ưu giá bán, tăng margin |
| **Seller chuyên nghiệp** | > 1000 đơn/tháng, Multi-platform | So sánh sàn, bulk calculation |

### 1.3. Phạm vi tính năng (MVP Scope)

#### Phase 1 - MVP (Ưu tiên cao)
- [x] Tính xuôi: Nhập giá bán → Ra lợi nhuận
- [x] Hỗ trợ Shopee (Shop thường)
- [x] Hiển thị breakdown chi phí
- [ ] Responsive mobile

#### Phase 2 - Enhancement
- [ ] Tính ngược: Nhập lợi nhuận → Gợi ý giá
- [ ] Hỗ trợ TikTok Shop
- [ ] Shopee Mall / Preferred Seller
- [ ] Lưu lịch sử tính toán (localStorage)

#### Phase 3 - Advanced
- [ ] Bulk calculation (nhiều sản phẩm)
- [ ] Export Excel/PDF
- [ ] So sánh sàn song song
- [ ] Tính tỷ lệ hoàn hàng

---

## 2. TỪ ĐIỂN DỮ LIỆU (DATA DICTIONARY)

### 2.1. Biến đầu vào (Input Variables)

| Tên biến | Type | Required | Default | Min | Max | Mô tả |
|----------|------|----------|---------|-----|-----|-------|
| `platform` | enum | ✅ | 'shopee' | - | - | Sàn TMĐT: 'shopee' \| 'tiktok' |
| `shopType` | enum | ✅ | 'normal' | - | - | Loại shop: 'normal' \| 'preferred' \| 'mall' |
| `sellingPrice` | number | ✅ | - | 1000 | 500,000,000 | Giá bán niêm yết (VND) |
| `costPrice` | number | ✅ | - | 0 | 500,000,000 | Giá vốn/Giá nhập (VND) |
| `voucherShop` | number | ❌ | 0 | 0 | sellingPrice | Voucher shop tự chịu (VND) |
| `packagingCost` | number | ❌ | 3000 | 0 | 100,000 | Chi phí đóng gói/đơn (VND) |
| `shippingCost` | number | ❌ | 0 | 0 | 500,000 | Phí ship shop chịu (VND) |
| `adsCost` | number | ❌ | 0 | 0 | sellingPrice | Chi phí ads/đơn (VND) |
| `adsCostPercent` | number | ❌ | 0 | 0 | 100 | Chi phí ads theo % doanh thu |
| `quantity` | number | ❌ | 1 | 1 | 10,000 | Số lượng sản phẩm/đơn |
| `includeTax` | boolean | ❌ | true | - | - | Có tính thuế TNCN không |
| `includeFreeship` | boolean | ❌ | true | - | - | Có đăng ký Freeship Xtra |
| `includeVoucherXtra` | boolean | ❌ | false | - | - | Có đăng ký Voucher Xtra |

### 2.2. Biến đầu ra (Output Variables)

| Tên biến | Type | Mô tả | Format |
|----------|------|-------|--------|
| `revenue` | number | Doanh thu thực nhận | currency |
| `totalPlatformFee` | number | Tổng phí sàn | currency |
| `feePayment` | number | Phí thanh toán | currency |
| `feeCommission` | number | Phí hoa hồng/cố định | currency |
| `feeService` | number | Phí dịch vụ (Freeship, Voucher Xtra) | currency |
| `feeCOD` | number | Phí COD (nếu có) | currency |
| `taxAmount` | number | Thuế phải nộp | currency |
| `totalOperatingCost` | number | Tổng chi phí vận hành | currency |
| `netProfit` | number | Lợi nhuận ròng | currency |
| `profitMargin` | number | Tỷ suất lợi nhuận | percentage |
| `profitPerUnit` | number | Lãi/sản phẩm | currency |
| `breakdownFees` | object | Chi tiết từng loại phí | object |

### 2.3. Enum Definitions

```typescript
type Platform = 'shopee' | 'tiktok';

type ShopeeShopType = 'normal' | 'preferred' | 'mall';

type TikTokCategory = 
  | 'fashion'      // Thời trang
  | 'beauty'       // Làm đẹp
  | 'electronics'  // Điện tử
  | 'home'         // Nhà cửa
  | 'food'         // Thực phẩm
  | 'other';       // Khác

type CalculationMode = 'forward' | 'reverse';
```

---

## 3. CẤU HÌNH PHÍ SÀN (PLATFORM FEES CONFIG)

> ⚠️ **Lưu ý quan trọng:** Các mức phí dưới đây là ước tính và có thể thay đổi. 
> Hệ thống cần thiết kế để dễ dàng cập nhật qua file config.

### 3.1. SHOPEE - Chi tiết phí (2025)

#### A. Phí Thanh Toán (Payment Fee)

| Điều kiện | Mức phí | Ghi chú |
|-----------|---------|---------|
| Tất cả đơn hàng | **5%** | Đã bao gồm VAT |

**Công thức:**
```
feePayment = (sellingPrice + customerShipping - voucherShop) × 5%
```

**Đơn giản hóa (bỏ qua customerShipping):**
```
feePayment = (sellingPrice - voucherShop) × 5%
```

#### B. Phí Hoa Hồng / Phí Cố Định (Commission Fee)

| Loại Shop | Mức phí | Điều kiện đặc biệt |
|-----------|---------|-------------------|
| Shop thường (Normal) | **4%** | Miễn phí 90 ngày đầu |
| Shopee Preferred | **4%** | Có thêm ưu đãi khác |
| Shopee Mall | **4% - 10%** | Theo ngành hàng |

**Chi tiết Shopee Mall theo ngành hàng:**

| Ngành hàng | Mức phí |
|------------|---------|
| Thời trang, Phụ kiện | 6% |
| Điện tử, Điện thoại | 4% |
| Mẹ & Bé | 6% |
| Làm đẹp, Sức khỏe | 8% |
| Nhà cửa, Đời sống | 6% |
| Thực phẩm | 8% |
| Khác | 6% |

#### C. Phí Dịch Vụ (Service Fee)

| Gói dịch vụ | Mức phí | Mức trần (Cap) | Áp dụng cho |
|-------------|---------|----------------|-------------|
| **Freeship Xtra** | 9% | 25,000đ | Mọi shop đăng ký |
| **Voucher Xtra** | 5% | 20,000đ | Shop có chạy voucher |

**Logic xử lý Mức trần:**
```typescript
function calculateServiceFee(revenue: number, rate: number, cap: number): number {
  const calculatedFee = revenue * rate;
  return Math.min(calculatedFee, cap);
}
```

#### D. Phí COD (Thu hộ tiền mặt)

| Điều kiện | Mức phí |
|-----------|---------|
| Đơn hàng COD | **2%** giá trị đơn |

> 💡 **Gợi ý:** Có thể thêm toggle "Đơn COD" để tính phí này.

#### E. Tổng hợp phí Shopee

| Loại Shop | Phí tối thiểu | Phí tối đa (có Freeship) |
|-----------|---------------|--------------------------|
| Normal (mới) | 5% | 5% + 9% = 14% |
| Normal | 5% + 4% = 9% | 9% + 9% + 5% = 23% |
| Preferred | 9% | 23% |
| Mall | 9% - 15% | 23% - 29% |

---

### 3.2. TIKTOK SHOP - Chi tiết phí (2025)

#### A. Phí Giao Dịch (Transaction Fee)

| Điều kiện | Mức phí |
|-----------|---------|
| Tất cả đơn hàng | **3%** |

#### B. Phí Hoa Hồng Sàn (Platform Commission)

| Ngành hàng | Mức phí |
|------------|---------|
| Thời trang | 3% |
| Làm đẹp | 4% |
| Điện tử | 2% |
| Thực phẩm | 4% |
| Nhà cửa | 3% |
| **Mặc định** | **3%** |

#### C. Phí Vận Chuyển Xtra (Shipping Subsidy)

| Chương trình | Mức phí |
|--------------|---------|
| Free Shipping | **5%** |

#### D. Tổng hợp phí TikTok Shop

| Có Free Shipping | Tổng phí |
|------------------|----------|
| Không | 3% + 3% = 6% |
| Có | 3% + 3% + 5% = 11% |

---

### 3.3. THUẾ (Tax Configuration)

#### Thuế TNCN cho Cá nhân/Hộ kinh doanh

| Loại thuế | Mức thuế | Ghi chú |
|-----------|----------|---------|
| VAT | 1% | Trên doanh thu |
| TNCN | 0.5% | Trên doanh thu |
| **Tổng** | **1.5%** | Áp dụng nếu DT > 100tr/năm |

> ⚠️ **Lưu ý:** Doanh thu < 100 triệu/năm được miễn thuế. 
> Tool nên có option "Miễn thuế" cho seller nhỏ.

---

## 4. LOGIC TÍNH TOÁN (CORE BUSINESS LOGIC)

### 4.1. Bài toán 1: Tính Xuôi (Forward Calculation)

**Input:** Giá bán → **Output:** Lợi nhuận

#### Flowchart

```
┌─────────────────────────────────────────────────────────┐
│                    INPUT                                 │
│  sellingPrice, costPrice, voucherShop, packagingCost,   │
│  shippingCost, adsCost, platform, shopType              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Tính Doanh Thu Thực (Net Revenue)              │
│  revenue = sellingPrice - voucherShop                   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 2: Tính Phí Sàn (Platform Fees)                   │
│  ├─ feePayment = revenue × paymentRate                  │
│  ├─ feeCommission = revenue × commissionRate            │
│  ├─ feeService = min(revenue × serviceRate, cap)        │
│  └─ totalPlatformFee = sum(all fees)                    │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 3: Tính Thuế (Tax)                                │
│  taxAmount = includeTax ? revenue × 1.5% : 0            │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 4: Tính Chi Phí Vận Hành (Operating Cost)         │
│  opex = costPrice + packagingCost + shippingCost        │
│       + (adsCost || revenue × adsCostPercent)           │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 5: Tính Kết Quả (Results)                         │
│  netProfit = revenue - totalPlatformFee - tax - opex    │
│  profitMargin = (netProfit / revenue) × 100             │
└─────────────────────────────────────────────────────────┘
```

#### Công thức toán học

**Bước 1: Doanh thu thực**
$$Revenue = SellingPrice - VoucherShop$$

**Bước 2: Tổng phí sàn**
$$PlatformFee = Fee_{payment} + Fee_{commission} + Fee_{service}$$

Trong đó:
$$Fee_{payment} = Revenue \times Rate_{payment}$$
$$Fee_{commission} = Revenue \times Rate_{commission}$$
$$Fee_{service} = \min(Revenue \times Rate_{service}, Cap_{service})$$

**Bước 3: Thuế**
$$Tax = Revenue \times 1.5\% \quad (\text{nếu có})$$

**Bước 4: Chi phí vận hành**
$$OpEx = CostPrice + PackagingCost + ShippingCost + AdsCost$$

**Bước 5: Kết quả**
$$NetProfit = Revenue - PlatformFee - Tax - OpEx$$
$$ProfitMargin = \frac{NetProfit}{Revenue} \times 100\%$$

---

### 4.2. Bài toán 2: Tính Ngược (Reverse Calculation)

**Input:** Lợi nhuận mong muốn → **Output:** Giá bán gợi ý

#### Công thức đại số

Gọi:
- $P$ = Giá bán cần tìm
- $T$ = Target Profit (lợi nhuận mong muốn)
- $R$ = Tổng tỷ lệ phí (phí sàn + thuế)
- $C$ = Tổng chi phí cố định (giá vốn + đóng gói + ship + ads)
- $V$ = Voucher shop

Ta có phương trình:
$$T = P - V - (P - V) \times R - C$$

Biến đổi:
$$T = (P - V)(1 - R) - C$$
$$(P - V)(1 - R) = T + C$$
$$P - V = \frac{T + C}{1 - R}$$
$$P = \frac{T + C}{1 - R} + V$$

**Công thức cuối cùng:**
$$SuggestedPrice = \frac{TargetProfit + CostPrice + PackagingCost + ShippingCost + AdsCost}{1 - TotalFeeRate} + VoucherShop$$

#### Xử lý đặc biệt

```typescript
function calculateReversePrice(params: ReverseParams): number {
  const { targetProfit, costPrice, packagingCost, shippingCost, adsCost, voucherShop, totalFeeRate } = params;
  
  // Kiểm tra tổng phí hợp lệ
  if (totalFeeRate >= 1) {
    throw new Error('Tổng tỷ lệ phí không thể >= 100%');
  }
  
  const fixedCosts = costPrice + packagingCost + shippingCost + adsCost;
  const suggestedPrice = (targetProfit + fixedCosts) / (1 - totalFeeRate) + voucherShop;
  
  // Làm tròn lên đến hàng nghìn
  return Math.ceil(suggestedPrice / 1000) * 1000;
}
```

---

### 4.3. Bài toán 3: So sánh Sàn (Platform Comparison)

**Input:** Cùng 1 sản phẩm → **Output:** So sánh lợi nhuận các sàn

```typescript
interface ComparisonResult {
  shopee: CalculationResult;
  tiktok: CalculationResult;
  recommendation: 'shopee' | 'tiktok' | 'equal';
  profitDifference: number;
}
```

---

## 5. CÁC TRƯỜNG HỢP BIÊN (EDGE CASES)

### 5.1. Validation Rules

| Rule ID | Điều kiện | Hành động | Message |
|---------|-----------|-----------|---------|
| V001 | sellingPrice <= 0 | Block | "Giá bán phải lớn hơn 0" |
| V002 | costPrice < 0 | Block | "Giá vốn không được âm" |
| V003 | voucherShop > sellingPrice | Block | "Voucher không thể lớn hơn giá bán" |
| V004 | sellingPrice < costPrice | Warning | "⚠️ Giá bán thấp hơn giá vốn!" |
| V005 | netProfit < 0 | Warning | Hiển thị màu đỏ, icon cảnh báo |
| V006 | profitMargin < 10% | Warning | "Margin thấp, cân nhắc tăng giá" |
| V007 | totalFeeRate >= 100% | Block | "Cấu hình phí không hợp lệ" |

### 5.2. Xử lý số học

```typescript
// Làm tròn tiền VND (về hàng trăm)
function roundCurrency(amount: number): number {
  return Math.round(amount / 100) * 100;
}

// Làm tròn phần trăm (2 số thập phân)
function roundPercentage(value: number): number {
  return Math.round(value * 100) / 100;
}

// Format tiền VND
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
```

### 5.3. Edge Cases cụ thể

| Case | Input | Expected Output |
|------|-------|-----------------|
| Giá bán = Giá vốn | 100k / 100k | Lỗ (do phí sàn) |
| Voucher = 100% giá | 100k / voucher 100k | Revenue = 0, Lỗ |
| Sản phẩm rẻ | 10k | Phí > Lãi, cảnh báo |
| Sản phẩm đắt | 100 triệu | Phí cap, tính đúng |
| Shop mới | < 90 ngày | Miễn phí commission |

---

## 6. USE CASES

### UC-01: Tính lợi nhuận cơ bản

**Actor:** Seller Shopee  
**Precondition:** User đã vào trang web

**Main Flow:**
1. User chọn sàn "Shopee"
2. User nhập Giá bán: 150,000đ
3. User nhập Giá vốn: 80,000đ
4. System tự động tính và hiển thị:
   - Doanh thu: 150,000đ
   - Phí thanh toán (5%): 7,500đ
   - Phí hoa hồng (4%): 6,000đ
   - Phí Freeship (9%): 13,500đ
   - Thuế (1.5%): 2,250đ
   - Chi phí đóng gói: 3,000đ
   - **Lợi nhuận ròng: 37,750đ**
   - **Tỷ suất: 25.2%**

**Alternative Flow:**
- 4a. Nếu lợi nhuận < 0, hiển thị cảnh báo đỏ

---

### UC-02: Tính giá bán gợi ý

**Actor:** Seller muốn đạt target lãi

**Main Flow:**
1. User chuyển sang tab "Tính giá bán"
2. User nhập Lợi nhuận mong muốn: 50,000đ
3. User nhập Giá vốn: 80,000đ
4. System tính và hiển thị:
   - **Giá bán gợi ý: 167,000đ**
   - Breakdown chi phí tương ứng

---

### UC-03: So sánh sàn

**Actor:** Seller bán multi-platform

**Main Flow:**
1. User nhập thông tin sản phẩm
2. User click "So sánh sàn"
3. System hiển thị bảng so sánh:

| Chỉ số | Shopee | TikTok |
|--------|--------|--------|
| Tổng phí | 29,250đ | 16,500đ |
| Lợi nhuận | 37,750đ | 50,500đ |
| Margin | 25.2% | 33.7% |

4. System recommend: "TikTok Shop có lợi nhuận cao hơn 12,750đ"

---

## 7. WIREFRAME & UI/UX GUIDELINES

### 7.1. Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Logo + Navigation                                   │
├─────────────────────────────────────────────────────────────┤
│  HERO: "Tính Lãi Shopee - Công cụ tính phí bán hàng #1"     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │   INPUT FORM        │  │   RESULT PANEL              │   │
│  │                     │  │                             │   │
│  │  [Sàn TMĐT ▼]       │  │   💰 Lợi nhuận ròng        │   │
│  │  Giá bán: [____]    │  │   ██████████ 37,750đ       │   │
│  │  Giá vốn: [____]    │  │                             │   │
│  │  Voucher: [____]    │  │   📊 Tỷ suất: 25.2%        │   │
│  │  Đóng gói: [____]   │  │                             │   │
│  │                     │  │   ─────────────────────     │   │
│  │  ☑ Freeship Xtra    │  │   Chi tiết phí:            │   │
│  │  ☐ Voucher Xtra     │  │   • Phí thanh toán: 7,500đ │   │
│  │  ☑ Tính thuế        │  │   • Phí hoa hồng: 6,000đ   │   │
│  │                     │  │   • Phí Freeship: 13,500đ  │   │
│  │  [  TÍNH TOÁN  ]    │  │   • Thuế: 2,250đ           │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  FAQ SECTION: Câu hỏi thường gặp (SEO)                      │
├─────────────────────────────────────────────────────────────┤
│  FOOTER: Links + Copyright                                   │
└─────────────────────────────────────────────────────────────┘
```

### 7.2. Color Scheme

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary | Shopee Orange | `#EE4D2D` | Buttons, highlights |
| Success | Green | `#22C55E` | Profit positive |
| Danger | Red | `#EF4444` | Profit negative, warnings |
| Neutral | Gray | `#6B7280` | Text, borders |
| Background | White | `#FFFFFF` | Main background |

### 7.3. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640px - 1024px | Two columns |
| Desktop | > 1024px | Two columns, wider |

### 7.4. Micro-interactions

1. **Real-time calculation:** Tính ngay khi user thay đổi input
2. **Number formatting:** Auto format VND khi nhập
3. **Profit animation:** Số tăng dần khi hiển thị kết quả
4. **Warning shake:** Rung nhẹ khi có cảnh báo lỗ

---

## 8. PHỤ LỤC

### 8.1. Config File Structure

```typescript
// lib/config/platform-fees.ts

export const SHOPEE_FEES = {
  payment: 0.05,        // 5%
  commission: {
    normal: 0.04,       // 4%
    preferred: 0.04,
    mall: {
      fashion: 0.06,
      electronics: 0.04,
      beauty: 0.08,
      default: 0.06,
    },
  },
  service: {
    freeshipXtra: {
      rate: 0.09,       // 9%
      cap: 25000,       // 25k
    },
    voucherXtra: {
      rate: 0.05,       // 5%
      cap: 20000,       // 20k
    },
  },
  cod: 0.02,            // 2%
  newShopGracePeriod: 90, // days
};

export const TIKTOK_FEES = {
  transaction: 0.03,    // 3%
  commission: {
    fashion: 0.03,
    beauty: 0.04,
    electronics: 0.02,
    food: 0.04,
    default: 0.03,
  },
  shipping: 0.05,       // 5%
};

export const TAX_RATES = {
  vat: 0.01,            // 1%
  pit: 0.005,           // 0.5%
  total: 0.015,         // 1.5%
  threshold: 100000000, // 100 triệu/năm
};
```

### 8.2. Test Cases

| Test ID | Scenario | Input | Expected |
|---------|----------|-------|----------|
| T001 | Basic Shopee | 150k/80k | Profit ~37.75k |
| T002 | With voucher | 150k/80k/10k voucher | Profit ~29k |
| T003 | TikTok basic | 150k/80k | Profit ~50.5k |
| T004 | Negative profit | 50k/80k | Warning, red |
| T005 | Freeship cap | 500k/200k | Freeship = 25k (cap) |
| T006 | Reverse calc | Target 50k | Price ~167k |
| T007 | No tax | 150k/80k, tax=false | Profit +2.25k |

### 8.3. Glossary

| Thuật ngữ | Tiếng Việt | Định nghĩa |
|-----------|------------|------------|
| Revenue | Doanh thu | Số tiền thực nhận từ khách |
| Margin | Tỷ suất | Lợi nhuận / Doanh thu × 100 |
| OpEx | Chi phí vận hành | Các chi phí ngoài phí sàn |
| Cap | Mức trần | Giới hạn tối đa của phí |
| COD | Thu hộ | Thanh toán khi nhận hàng |
| CIR | Cost-Income Ratio | Tỷ lệ chi phí ads/doanh thu |

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial version |
| 2.0 | Dec 2024 | Bổ sung chi tiết phí COD, shopType, TikTok category, validation rules, UI guidelines |

---

*Document maintained by: Business Analyst Team*
