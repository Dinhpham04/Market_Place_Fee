// ============================================
// SEED DATA - Dữ liệu khởi tạo
// Dựa trên chính sách phí Shopee từ 29/12/2025
// Chạy: npm run db:seed
// ============================================

import { PrismaClient, ShopType, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ========================================
  // 1. CREATE PLATFORMS
  // ========================================
  console.log("📦 Creating platforms...");
  
  const shopee = await prisma.platform.upsert({
    where: { code: "shopee" },
    update: {},
    create: {
      code: "shopee",
      name: "Shopee",
      logo: "/images/platforms/shopee.svg",
      color: "#EE4D2D",
      description: "Sàn thương mại điện tử Shopee Việt Nam",
      isActive: true,
      sortOrder: 1,
    },
  });

  const tiktok = await prisma.platform.upsert({
    where: { code: "tiktok" },
    update: {},
    create: {
      code: "tiktok",
      name: "TikTok Shop",
      logo: "/images/platforms/tiktok.svg",
      color: "#000000",
      description: "TikTok Shop - Mua sắm trên TikTok",
      isActive: true,
      sortOrder: 2,
    },
  });

  console.log("  ✅ Platforms created\n");

  // ========================================
  // 2. CREATE SHOPEE CATEGORIES (Hierarchical)
  // Dựa theo PDF phí cố định từ 29/12/2025
  // ========================================
  console.log("📂 Creating Shopee categories...");

  // Level 1: Nhóm ngành hàng chính
  const categoryGroups = [
    { code: "fashion", name: "Ngành hàng Thời trang" },
    { code: "electronics", name: "Ngành hàng Điện Tử" },
    { code: "fmcg", name: "Ngành hàng Tiêu dùng nhanh" },
    { code: "home_life", name: "Ngành hàng Nhà cửa & Đời sống" },
  ];

  const createdGroups: Record<string, string> = {};
  
  for (const group of categoryGroups) {
    const created = await prisma.category.upsert({
      where: { platformId_code: { platformId: shopee.id, code: group.code } },
      update: { name: group.name },
      create: {
        platformId: shopee.id,
        code: group.code,
        name: group.name,
        level: 1,
        isActive: true,
        sortOrder: categoryGroups.indexOf(group),
      },
    });
    createdGroups[group.code] = created.id;
  }

  // Level 2: Ngành hàng cấp 1 với phí cố định
  // Dữ liệu từ bảng phí Non-Mall 29/12/2025
  const shopeeCategories = [
    // === THỜI TRANG ===
    { parentCode: "fashion", code: "fashion_accessories", name: "Phụ Kiện Thời Trang", rateNormal: 0.1250, rateMall: 0.12 },
    { parentCode: "fashion", code: "fashion_women", name: "Thời Trang Nữ", rateNormal: 0.1250, rateMall: 0.12 },
    { parentCode: "fashion", code: "fashion_men", name: "Thời Trang Nam", rateNormal: 0.1350, rateMall: 0.12 },
    { parentCode: "fashion", code: "shoes", name: "Giày Dép", rateNormal: 0.1350, rateMall: 0.12 },
    { parentCode: "fashion", code: "bags", name: "Túi Xách", rateNormal: 0.1350, rateMall: 0.12 },
    { parentCode: "fashion", code: "watches", name: "Đồng Hồ", rateNormal: 0.1350, rateMall: 0.12 },
    
    // === ĐIỆN TỬ ===
    { parentCode: "electronics", code: "phone_tablet", name: "Điện Thoại & Máy tính bảng", rateNormal: 0.0200, rateMall: 0.02 },
    { parentCode: "electronics", code: "laptop_pc", name: "Máy tính & Laptop", rateNormal: 0.0250, rateMall: 0.025 },
    { parentCode: "electronics", code: "phone_accessories", name: "Phụ kiện Điện thoại", rateNormal: 0.1000, rateMall: 0.08 },
    { parentCode: "electronics", code: "pc_accessories", name: "Phụ kiện Máy tính", rateNormal: 0.1000, rateMall: 0.08 },
    { parentCode: "electronics", code: "audio", name: "Thiết Bị Âm Thanh", rateNormal: 0.0700, rateMall: 0.07 },
    { parentCode: "electronics", code: "home_appliances", name: "Thiết Bị Điện Gia Dụng", rateNormal: 0.0700, rateMall: 0.07 },
    { parentCode: "electronics", code: "camera", name: "Cameras & Flycam", rateNormal: 0.1000, rateMall: 0.08 },
    { parentCode: "electronics", code: "gaming", name: "Gaming & Console", rateNormal: 0.1000, rateMall: 0.08 },
    { parentCode: "electronics", code: "voucher_service", name: "Voucher & Dịch vụ", rateNormal: 0.1100, rateMall: 0.10 },
    
    // === TIÊU DÙNG NHANH (FMCG) ===
    { parentCode: "fmcg", code: "beauty", name: "Sắc Đẹp", rateNormal: 0.1400, rateMall: 0.12 },
    { parentCode: "fmcg", code: "health", name: "Sức Khỏe", rateNormal: 0.1400, rateMall: 0.12 },
    { parentCode: "fmcg", code: "mom_baby", name: "Mẹ & Bé", rateNormal: 0.1150, rateMall: 0.10 },
    { parentCode: "fmcg", code: "food_drink", name: "Thực phẩm và đồ uống", rateNormal: 0.1150, rateMall: 0.10 },
    
    // === NHÀ CỬA & ĐỜI SỐNG ===
    { parentCode: "home_life", code: "home_decor", name: "Nhà cửa & Đời sống", rateNormal: 0.1400, rateMall: 0.12 },
    { parentCode: "home_life", code: "stationery", name: "Văn Phòng Phẩm", rateNormal: 0.1000, rateMall: 0.10 },
    { parentCode: "home_life", code: "sports", name: "Thể thao & Dã ngoại", rateNormal: 0.1200, rateMall: 0.10 },
    { parentCode: "home_life", code: "pets", name: "Thú cưng", rateNormal: 0.1300, rateMall: 0.12 },
    { parentCode: "home_life", code: "auto_moto", name: "Ô tô - Xe máy", rateNormal: 0.0150, rateMall: 0.015 },
  ];

  for (const cat of shopeeCategories) {
    const parentId = createdGroups[cat.parentCode];
    
    const category = await prisma.category.upsert({
      where: { platformId_code: { platformId: shopee.id, code: cat.code } },
      update: { name: cat.name, parentId },
      create: {
        platformId: shopee.id,
        parentId,
        code: cat.code,
        name: cat.name,
        level: 2,
        isActive: true,
        sortOrder: shopeeCategories.indexOf(cat),
      },
    });

    // Create commission rates for Non-Mall
    await prisma.categoryCommissionRate.upsert({
      where: { id: `${category.id}-normal` },
      update: { rate: cat.rateNormal },
      create: {
        id: `${category.id}-normal`,
        categoryId: category.id,
        shopType: ShopType.NORMAL,
        rate: cat.rateNormal,
        effectiveFrom: new Date("2025-12-29"),
        status: Status.ACTIVE,
        notes: "Phí cố định Non-Mall từ 29/12/2025",
      },
    });

    // Create commission rates for Mall
    await prisma.categoryCommissionRate.upsert({
      where: { id: `${category.id}-mall` },
      update: { rate: cat.rateMall },
      create: {
        id: `${category.id}-mall`,
        categoryId: category.id,
        shopType: ShopType.MALL,
        rate: cat.rateMall,
        effectiveFrom: new Date("2025-12-29"),
        status: Status.ACTIVE,
        notes: "Phí cố định Mall từ 29/12/2025",
      },
    });
  }

  console.log(`  ✅ Created ${shopeeCategories.length} Shopee categories with commission rates\n`);

  // ========================================
  // 3. CREATE BASE FEE CONFIGS (Phí Thanh Toán)
  // ========================================
  console.log("💳 Creating base fee configs...");

  // Shopee - Phí thanh toán 4.91% (Mall)
  await prisma.baseFeeConfig.upsert({
    where: { 
      platformId_shopType_effectiveFrom: { 
        platformId: shopee.id, 
        shopType: ShopType.MALL,
        effectiveFrom: new Date("2025-12-29"),
      } 
    },
    update: {},
    create: {
      platformId: shopee.id,
      shopType: ShopType.MALL,
      paymentFeeRate: 0.0491, // 4.91%
      effectiveFrom: new Date("2025-12-29"),
      status: Status.ACTIVE,
      notes: "Phí thanh toán Shopee Mall từ 29/12/2025",
    },
  });

  // Shopee - Phí thanh toán ~4.91% (Non-Mall) - estimated
  await prisma.baseFeeConfig.upsert({
    where: { 
      platformId_shopType_effectiveFrom: { 
        platformId: shopee.id, 
        shopType: ShopType.NORMAL,
        effectiveFrom: new Date("2025-12-29"),
      } 
    },
    update: {},
    create: {
      platformId: shopee.id,
      shopType: ShopType.NORMAL,
      paymentFeeRate: 0.0491, // 4.91%
      effectiveFrom: new Date("2025-12-29"),
      status: Status.ACTIVE,
      notes: "Phí thanh toán Shopee Non-Mall từ 29/12/2025",
    },
  });

  // TikTok - Phí thanh toán 2%
  await prisma.baseFeeConfig.upsert({
    where: { 
      platformId_shopType_effectiveFrom: { 
        platformId: tiktok.id, 
        shopType: ShopType.NORMAL,
        effectiveFrom: new Date("2025-01-01"),
      } 
    },
    update: {},
    create: {
      platformId: tiktok.id,
      shopType: ShopType.NORMAL,
      paymentFeeRate: 0.02, // 2%
      effectiveFrom: new Date("2025-01-01"),
      status: Status.ACTIVE,
      notes: "Phí thanh toán TikTok Shop",
    },
  });

  console.log("  ✅ Base fee configs created\n");

  // ========================================
  // 4. CREATE OPTIONAL FEE CONFIGS
  // ========================================
  console.log("🎫 Creating optional fee configs...");

  // Voucher Xtra - 4% (từ 29/12/2025)
  await prisma.optionalFeeConfig.upsert({
    where: { 
      platformId_shopType_feeType_effectiveFrom: { 
        platformId: shopee.id, 
        shopType: ShopType.NORMAL,
        feeType: "voucher_xtra",
        effectiveFrom: new Date("2025-12-29"),
      } 
    },
    update: {},
    create: {
      platformId: shopee.id,
      shopType: ShopType.NORMAL,
      feeType: "voucher_xtra",
      feeName: "Phí Dịch vụ Voucher Xtra",
      description: "Phí dịch vụ khi tham gia gói Voucher Xtra",
      rate: 0.04, // 4%
      maxFeePerItem: 50000, // Tối đa 50,000đ/sản phẩm
      calculationType: "percentage",
      effectiveFrom: new Date("2025-12-29"),
      status: Status.ACTIVE,
      notes: "Áp dụng cho tất cả ngành hàng từ 29/12/2025",
    },
  });

  // Voucher Xtra - Mall
  await prisma.optionalFeeConfig.upsert({
    where: { 
      platformId_shopType_feeType_effectiveFrom: { 
        platformId: shopee.id, 
        shopType: ShopType.MALL,
        feeType: "voucher_xtra",
        effectiveFrom: new Date("2025-12-29"),
      } 
    },
    update: {},
    create: {
      platformId: shopee.id,
      shopType: ShopType.MALL,
      feeType: "voucher_xtra",
      feeName: "Phí Dịch vụ Voucher Xtra",
      description: "Phí dịch vụ khi tham gia gói Voucher Xtra",
      rate: 0.04, // 4%
      maxFeePerItem: 50000,
      calculationType: "percentage",
      effectiveFrom: new Date("2025-12-29"),
      status: Status.ACTIVE,
      notes: "Shopee Mall từ 29/12/2025",
    },
  });

  // Đồng Tài Trợ Mã ưu đãi - 30% giá trị voucher
  await prisma.optionalFeeConfig.upsert({
    where: { 
      platformId_shopType_feeType_effectiveFrom: { 
        platformId: shopee.id, 
        shopType: ShopType.NORMAL,
        feeType: "co_funding",
        effectiveFrom: new Date("2025-12-29"),
      } 
    },
    update: {},
    create: {
      platformId: shopee.id,
      shopType: ShopType.NORMAL,
      feeType: "co_funding",
      feeName: "Đồng Tài Trợ Mã ưu đãi",
      description: "Người bán chịu 30% giá trị mã ưu đãi đồng tài trợ",
      rate: 0.30, // 30%
      maxFeePerItem: 50000, // Tối đa 50,000đ/sản phẩm
      calculationType: "percentage_of_voucher",
      effectiveFrom: new Date("2025-12-29"),
      status: Status.ACTIVE,
      notes: "Không áp dụng đồng thời với Voucher Xtra",
    },
  });

  console.log("  ✅ Optional fee configs created\n");

  // ========================================
  // 5. CREATE FEE POLICY VERSION
  // ========================================
  console.log("📋 Creating fee policy version...");

  await prisma.feePolicyVersion.upsert({
    where: { 
      platformCode_version: { 
        platformCode: "shopee", 
        version: "v2025.12.29" 
      } 
    },
    update: {},
    create: {
      platformCode: "shopee",
      version: "v2025.12.29",
      effectiveDate: new Date("2025-12-29"),
      title: "Cập nhật chính sách và phí từ 29/12/2025",
      description: "Cập nhật Phí Cố Định, Voucher Xtra 4%, Đồng Tài Trợ 30%",
      sourceUrl: "https://banhang.shopee.vn/edu/article/26526",
    },
  });

  console.log("  ✅ Fee policy version created\n");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
