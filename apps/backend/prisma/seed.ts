import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a sample category first
  const category = await prisma.categories.upsert({
    where: { slug: 'eco-friendly-products' },
    update: {},
    create: {
      name: 'Eco-Friendly Products',
      slug: 'eco-friendly-products',
      description: 'Sustainable and environmentally friendly products',
      is_active: true,
    },
  });

  // Create sample products
  const products = [
    {
      name: 'Bamboo Toothbrush Set',
      slug: 'bamboo-toothbrush-set',
      description: 'Natural bamboo toothbrushes that are biodegradable and eco-friendly.',
      short_description: 'Sustainable bamboo toothbrushes',
      sku: 'BAM-TOOTH-001',
      price: 12.99,
      compare_price: 15.99,
      stock_quantity: 100,
      is_active: true,
      is_featured: true,
      category_id: category.id,
      brand: 'EcoBrush',
    },
    {
      name: 'Reusable Stainless Steel Water Bottle',
      slug: 'reusable-stainless-steel-water-bottle',
      description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours.',
      short_description: 'Keep your drinks cold with this insulated bottle',
      sku: 'STEEL-BOTTLE-001',
      price: 24.99,
      compare_price: 29.99,
      stock_quantity: 50,
      is_active: true,
      is_featured: true,
      category_id: category.id,
      brand: 'HydroFlow',
    },
    {
      name: 'Organic Cotton T-Shirt',
      slug: 'organic-cotton-t-shirt',
      description: 'Comfortable organic cotton t-shirt made from sustainable materials.',
      short_description: 'Soft and sustainable organic cotton tee',
      sku: 'ORG-TSHIRT-001',
      price: 19.99,
      stock_quantity: 75,
      is_active: true,
      category_id: category.id,
      brand: 'GreenWear',
    },
    {
      name: 'Solar Powered Phone Charger',
      slug: 'solar-powered-phone-charger',
      description: 'Portable solar charger that can power your devices anywhere.',
      short_description: 'Charge your phone with solar power',
      sku: 'SOLAR-CHARGER-001',
      price: 39.99,
      stock_quantity: 30,
      is_active: true,
      is_featured: true,
      category_id: category.id,
      brand: 'SunCharge',
    },
  ];

  for (const product of products) {
    await prisma.products.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });