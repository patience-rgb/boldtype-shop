import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding BoldType database...')

  // Admin user
  const adminPassword = await bcrypt.hash('boldtype-admin-2025', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@boldtype.ca' },
    update: {},
    create: {
      name: 'BoldType Admin',
      email: 'admin@boldtype.ca',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Products
  const products = [
    {
      name: 'Canada Skyline Hoodie',
      slug: 'canada-skyline-hoodie',
      description: "Show Canada some love in the boldest way possible. This graphic hoodie features a stunning skyline silhouette across the chest that'll have everyone asking where you got it. Iconic doesn't even cover it.",
      details: '80% cotton, 20% polyester. Fleece-lined for warmth. Machine wash cold, tumble dry low. Unisex fit.',
      category: 'HOODIE',
      basePrice: 79.99,
      salePrice: null,
      featured: true,
      published: true,
      images: [
        { url: '/images/canada-hoodie.jpg', alt: 'Canada Skyline Hoodie in Black', primary: true, sortOrder: 0 },
      ],
      variants: [
        { color: 'Classic Black', colorHex: '#0A0A0A', size: 'S', stock: 15 },
        { color: 'Classic Black', colorHex: '#0A0A0A', size: 'M', stock: 20 },
        { color: 'Classic Black', colorHex: '#0A0A0A', size: 'L', stock: 18 },
        { color: 'Classic Black', colorHex: '#0A0A0A', size: 'XL', stock: 12 },
        { color: 'Classic Black', colorHex: '#0A0A0A', size: 'XXL', stock: 8 },
        { color: 'Arctic White', colorHex: '#F5F5F5', size: 'S', stock: 10 },
        { color: 'Arctic White', colorHex: '#F5F5F5', size: 'M', stock: 14 },
        { color: 'Arctic White', colorHex: '#F5F5F5', size: 'L', stock: 12 },
        { color: 'Arctic White', colorHex: '#F5F5F5', size: 'XL', stock: 8 },
      ],
    },
    {
      name: 'BT Logo Hoodie',
      slug: 'bt-logo-hoodie',
      description: "The OG. The BoldType logo hoodie that started it all. Bold bt. print on electric blue — this is what wearing your brand looks like. Grab it in multiple colours and yes, you need them all.",
      details: '80% cotton, 20% polyester. Kangaroo pocket. Double-lined hood. Machine wash cold.',
      category: 'HOODIE',
      basePrice: 89.99,
      salePrice: 69.99,
      featured: true,
      published: true,
      images: [
        { url: '/images/bt-hoodie-blue.jpg', alt: 'BT Logo Hoodie in Electric Blue with Yellow Print', primary: true, sortOrder: 0 },
      ],
      variants: [
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'XS', stock: 5 },
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'S', stock: 12 },
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'M', stock: 20 },
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'L', stock: 18 },
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'XL', stock: 14 },
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'XXL', stock: 6 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'S', stock: 8 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'M', stock: 15 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'L', stock: 12 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'XL', stock: 9 },
        { color: 'Deep Violet', colorHex: '#5C00D8', size: 'S', stock: 7 },
        { color: 'Deep Violet', colorHex: '#5C00D8', size: 'M', stock: 12 },
        { color: 'Deep Violet', colorHex: '#5C00D8', size: 'L', stock: 10 },
        { color: 'Deep Violet', colorHex: '#5C00D8', size: 'XL', stock: 6 },
        { color: 'Marigold Yellow', colorHex: '#FFD600', size: 'S', stock: 6 },
        { color: 'Marigold Yellow', colorHex: '#FFD600', size: 'M', stock: 10 },
        { color: 'Marigold Yellow', colorHex: '#FFD600', size: 'L', stock: 8 },
      ],
    },
    {
      name: '& Then I Woke Up Sweatshirt',
      slug: 'and-then-i-woke-up-sweatshirt',
      description: "Sometimes you wake up and you're just… bold. This dreamy sweatshirt with oversized & print is for the ones who show up fully themselves every single day. You woke up. You showed up. You slayed.",
      details: '70% cotton, 30% polyester. Relaxed fit. Ribbed cuffs and hem. Machine wash cold, do not bleach.',
      category: 'SWEATSHIRT',
      basePrice: 69.99,
      salePrice: null,
      featured: true,
      published: true,
      images: [
        { url: '/images/and-sweatshirt.jpg', alt: '& Then I Woke Up Sweatshirt in Hot Pink', primary: true, sortOrder: 0 },
      ],
      variants: [
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'XS', stock: 6 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'S', stock: 14 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'M', stock: 18 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'L', stock: 15 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'XL', stock: 10 },
        { color: 'Fuchsia Magenta', colorHex: '#E91E8C', size: 'S', stock: 8 },
        { color: 'Fuchsia Magenta', colorHex: '#E91E8C', size: 'M', stock: 12 },
        { color: 'Fuchsia Magenta', colorHex: '#E91E8C', size: 'L', stock: 9 },
        { color: 'Kelly Green', colorHex: '#4CAF50', size: 'S', stock: 5 },
        { color: 'Kelly Green', colorHex: '#4CAF50', size: 'M', stock: 8 },
        { color: 'Kelly Green', colorHex: '#4CAF50', size: 'L', stock: 6 },
      ],
    },
    {
      name: 'Bold Type Classic Tee',
      slug: 'bold-type-classic-tee',
      description: "You know what's better than a plain t-shirt? A BOLD one. Our Classic Tee comes in all your power palette colours — perfect for layering or letting it do the talking solo. Soft, comfy, and unapologetically you.",
      details: '100% ring-spun cotton. Unisex fit. Pre-shrunk. Machine wash warm.',
      category: 'TSHIRT',
      basePrice: 44.99,
      salePrice: null,
      featured: false,
      published: true,
      images: [],
      variants: [
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'XS', stock: 8 },
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'S', stock: 20 },
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'M', stock: 25 },
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'L', stock: 20 },
        { color: 'Electric Blue', colorHex: '#00A3E0', size: 'XL', stock: 15 },
        { color: 'Marigold Yellow', colorHex: '#FFD600', size: 'S', stock: 15 },
        { color: 'Marigold Yellow', colorHex: '#FFD600', size: 'M', stock: 20 },
        { color: 'Marigold Yellow', colorHex: '#FFD600', size: 'L', stock: 15 },
        { color: 'Marigold Yellow', colorHex: '#FFD600', size: 'XL', stock: 10 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'XS', stock: 10 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'S', stock: 18 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'M', stock: 22 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'L', stock: 18 },
        { color: 'Hot Pink', colorHex: '#FF3E8E', size: 'XL', stock: 12 },
        { color: 'Deep Violet', colorHex: '#5C00D8', size: 'S', stock: 12 },
        { color: 'Deep Violet', colorHex: '#5C00D8', size: 'M', stock: 16 },
        { color: 'Deep Violet', colorHex: '#5C00D8', size: 'L', stock: 14 },
        { color: 'Kelly Green', colorHex: '#4CAF50', size: 'S', stock: 10 },
        { color: 'Kelly Green', colorHex: '#4CAF50', size: 'M', stock: 14 },
        { color: 'Kelly Green', colorHex: '#4CAF50', size: 'L', stock: 12 },
      ],
    },
  ]

  for (const p of products) {
    const { images, variants, ...productData } = p

    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        images: { create: images },
        variants: { create: variants },
      },
    })
    console.log(`✅ Product: ${productData.name}`)
  }

  // Blog posts
  const blogPosts = [
    {
      title: '5 Bold Colour Combos You Need This Season',
      slug: '5-bold-colour-combos-this-season',
      excerpt: 'Stop playing it safe. Here are 5 head-turning colour combos that will make your wardrobe the main character.',
      content: `<h2>Life's Too Short for Boring Colours</h2>
<p>If your wardrobe is looking a little muted right now, we need to talk. This season is all about colour — and not the subtle kind. We're talking full-saturation, make-heads-turn, people-stop-you-on-the-street kind of bold.</p>

<h2>Combo #1: Electric Blue + Marigold Yellow</h2>
<p>Think of this as the BoldType signature — bright, contrasting, and utterly unforgettable. A blue hoodie with yellow prints? That's not just an outfit, it's a personality. Great for warm and neutral skin undertones especially.</p>

<h2>Combo #2: Hot Pink + Deep Violet</h2>
<p>Don't be scared of colour-on-colour. A hot pink sweatshirt layered under a deep violet hoodie is the kind of flex that photoshoots dream of. Cool-toned skin? This combo was literally made for you.</p>

<h2>Combo #3: Kelly Green + White</h2>
<p>Sometimes the boldest move is a clean, high-contrast pairing. Kelly green is universally flattering and white brings out every shade. Neutral undertones absolutely thrive in this combo.</p>

<h2>Combo #4: Classic Black + Any Bold Colour</h2>
<p>Black is not boring when it's paired right. Our Canada Skyline Hoodie in black is the perfect anchor for a bright tee underneath. Let the colour peek through at the collar and cuffs — chef's kiss.</p>

<h2>Combo #5: Fuchsia + Coral</h2>
<p>This one's for the warm-toned besties. Fuchsia with coral undertones is a warm-toned dream. Saturated, energetic, and absolutely camp-coded. We're obsessed.</p>

<p><strong>Not sure which colours work for your skin tone?</strong> Take our free Power Colour Quiz and get a personalised palette in under 2 minutes.</p>`,
      tags: 'Style Tips, Colour Guide',
      published: true,
      publishedAt: new Date('2025-04-10'),
      authorName: 'BoldType Team',
    },
    {
      title: 'How to Know Your Skin Undertone in 3 Steps',
      slug: 'how-to-know-your-skin-undertone',
      excerpt: "Warm, Cool, or Neutral — knowing your undertone is the cheat code to looking amazing in every single outfit. Here's how to figure it out fast.",
      content: `<h2>The Secret Your Mirror Won't Tell You</h2>
<p>Your skin tone is what you see. Your undertone is what your clothes interact with. Getting this right is the difference between colours that make you glow and colours that wash you out. Let's sort it out.</p>

<h2>Step 1: The Jewelry Check</h2>
<p>Hold a silver and a gold piece of jewelry next to your bare wrist in natural light (away from harsh artificial lighting).</p>
<ul>
<li><strong>Silver looks better:</strong> You're Cool-toned. Blue and pink undertones run in your veins.</li>
<li><strong>Gold looks better:</strong> You're Warm-toned. Golden and yellow undertones in your skin respond to warm metals.</li>
<li><strong>Both look equally good:</strong> You're Neutral. Lucky you — you can borrow from both palettes!</li>
</ul>

<h2>Step 2: The Contrast Check (for deeper skin tones)</h2>
<p>This one is especially helpful if the jewelry check felt inconclusive. Apply a cool-pink blush on one side of your face and a warm-orange blush on the other.</p>
<ul>
<li><strong>The orange looks out of place:</strong> Cool undertone confirmed.</li>
<li><strong>The pink looks off:</strong> Warm undertone confirmed.</li>
</ul>

<h2>Step 3: The Vein Check</h2>
<p>Look at the veins on your inner wrist in natural light.</p>
<ul>
<li><strong>Blue/purple veins:</strong> Cool undertone</li>
<li><strong>Green veins:</strong> Warm undertone</li>
<li><strong>Both blue and green:</strong> Neutral undertone</li>
</ul>

<h2>Your Bold Power Palette Awaits</h2>
<p>Once you know your undertone, it's game over. Our Colour Finder quiz walks you through this process and gives you a curated selection of BoldType colours that will make you glow. Take it — it's free and takes 2 minutes.</p>`,
      tags: 'Colour Guide, Skin Tone, How-To',
      published: true,
      publishedAt: new Date('2025-03-20'),
      authorName: 'BoldType Team',
    },
    {
      title: "Why We're Obsessed with High-Saturation Prints",
      slug: 'why-we-love-high-saturation-prints',
      excerpt: "Everyone's wearing muted tones. We said no. Here's the story behind BoldType's commitment to colour that actually hits.",
      content: `<h2>The World Has Enough Beige</h2>
<p>Scroll through any fashion feed and you'll see a sea of neutrals — beige, ecru, greige. And listen, we get it. Neutrals are easy. Safe. Inoffensive.</p>
<p>But we started BoldType because we believe life is too short to dress like a latte.</p>

<h2>What High-Saturation Actually Means</h2>
<p>Saturation refers to the intensity of a colour. High-saturation colours are vivid, rich, and fully realised — none of that dusty, washed-out energy. Think: the difference between a watercolour sketch and a neon sign. Both are valid. We just prefer the neon sign.</p>
<p>High-saturation colours also interact more dramatically with light, which means they photograph better, stand out in crowds, and create a stronger visual impact on every skin tone.</p>

<h2>The Undertone Science</h2>
<p>Here's the thing about bold, saturated colours — they're not flattering by accident. The specific hue matters enormously. A marigold yellow and a lime yellow look completely different on warm versus cool undertones. That's why we built our Power Colour system — to match our most saturated pieces to the skin tones where they genuinely pop.</p>

<h2>Bold Is a Statement</h2>
<p>Wearing colour is a choice. It says: I'm here, I'm not apologising for it, and I look incredible. Our community of BoldType wearers shows up exactly like that — fully themselves, fully coloured, fully alive.</p>
<p>So this is your sign. Add to cart. Wear it loud.</p>`,
      tags: 'Brand Story, Design Philosophy',
      published: true,
      publishedAt: new Date('2025-02-14'),
      authorName: 'BoldType Team',
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
    console.log(`✅ Blog post: ${post.title}`)
  }

  console.log('\n🎉 BoldType database seeded successfully!')
  console.log('\nAdmin credentials:')
  console.log('  Email: admin@boldtype.ca')
  console.log('  Password: boldtype-admin-2025')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
