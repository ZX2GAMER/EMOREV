export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  discount?: number;
  category: 'women' | 'men' | 'kids';
  size: string[];
  description: string;
  image: string;
  imagePath?: string;
  stock: number;
  isNew?: boolean;
  isPublished?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  date: string;
  avatar?: string;
  isApproved?: boolean;
}

export const sampleProducts: Product[] = [
  // Women's
  {
    id: 'w1',
    name: 'Silk Evening Gown',
    price: 289.99,
    salePrice: 199.99,
    discount: 31,
    category: 'women',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Elegant silk evening gown with a flowing silhouette. Perfect for formal occasions and red carpet events.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f80d?w=600&h=800&fit=crop',
    stock: 15,
    isNew: true,
  },
  {
    id: 'w2',
    name: 'Designer Blazer',
    price: 189.99,
    salePrice: 149.99,
    discount: 21,
    category: 'women',
    size: ['S', 'M', 'L', 'XL'],
    description: 'Tailored designer blazer with premium fabric. A statement piece for the modern woman.',
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=800&fit=crop',
    stock: 20,
  },
  {
    id: 'w3',
    name: 'Cashmere Sweater',
    price: 159.99,
    category: 'women',
    size: ['XS', 'S', 'M', 'L'],
    description: 'Luxurious cashmere sweater in a relaxed fit. Ultimate comfort meets timeless style.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842d27?w=600&h=800&fit=crop',
    stock: 25,
    isNew: true,
  },
  {
    id: 'w4',
    name: 'Leather Mini Skirt',
    price: 129.99,
    salePrice: 89.99,
    discount: 31,
    category: 'women',
    size: ['XS', 'S', 'M', 'L'],
    description: 'Chic leather mini skirt with a sleek finish. Perfect for a night out.',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
    stock: 18,
  },
  {
    id: 'w5',
    name: 'Floral Midi Dress',
    price: 119.99,
    category: 'women',
    size: ['S', 'M', 'L', 'XL'],
    description: 'Beautiful floral midi dress with a flattering A-line silhouette.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop',
    stock: 30,
  },
  {
    id: 'w6',
    name: 'Wide-Leg Trousers',
    price: 99.99,
    salePrice: 69.99,
    discount: 30,
    category: 'women',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Elegant wide-leg trousers in flowing fabric. Perfect for office or casual wear.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
    stock: 22,
  },
  // Men's
  {
    id: 'm1',
    name: 'Classic Suit Jacket',
    price: 349.99,
    salePrice: 279.99,
    discount: 20,
    category: 'men',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium wool-blend suit jacket with modern slim fit. The epitome of gentleman elegance.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    stock: 12,
    isNew: true,
  },
  {
    id: 'm2',
    name: 'Premium Denim Jacket',
    price: 179.99,
    category: 'men',
    size: ['S', 'M', 'L', 'XL'],
    description: 'High-quality denim jacket with a vintage wash. A timeless wardrobe essential.',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop',
    stock: 28,
  },
  {
    id: 'm3',
    name: 'Merino Wool Polo',
    price: 89.99,
    salePrice: 59.99,
    discount: 33,
    category: 'men',
    size: ['S', 'M', 'L', 'XL'],
    description: 'Soft merino wool polo shirt. Refined casual wear for the discerning gentleman.',
    image: 'https://images.unsplash.com/photo-1614975059251-992f11792571?w=600&h=800&fit=crop',
    stock: 35,
  },
  {
    id: 'm4',
    name: 'Tailored Chinos',
    price: 109.99,
    category: 'men',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Perfectly tailored chino pants in premium cotton. Versatile and comfortable.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    stock: 40,
    isNew: true,
  },
  {
    id: 'm5',
    name: 'Leather Bomber Jacket',
    price: 399.99,
    salePrice: 319.99,
    discount: 20,
    category: 'men',
    size: ['M', 'L', 'XL'],
    description: 'Genuine leather bomber jacket with premium hardware. Bold and rugged style.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    stock: 8,
  },
  {
    id: 'm6',
    name: 'Oxford Button-Down',
    price: 79.99,
    salePrice: 49.99,
    discount: 38,
    category: 'men',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Classic Oxford button-down shirt in premium cotton. A wardrobe staple.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
    stock: 45,
  },
  // Kids
  {
    id: 'k1',
    name: 'Rainbow T-Shirt',
    price: 29.99,
    salePrice: 19.99,
    discount: 33,
    category: 'kids',
    size: ['2T', '3T', '4T', '5', '6'],
    description: 'Fun rainbow-printed t-shirt for kids. Soft cotton blend for all-day comfort.',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop',
    stock: 50,
    isNew: true,
  },
  {
    id: 'k2',
    name: 'Dinosaur Hoodie',
    price: 39.99,
    category: 'kids',
    size: ['2T', '3T', '4T', '5', '6', '7'],
    description: 'Adorable dinosaur-printed hoodie. Warm and cozy for little adventurers.',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop',
    stock: 35,
  },
  {
    id: 'k3',
    name: 'Sparkle Party Dress',
    price: 49.99,
    salePrice: 34.99,
    discount: 30,
    category: 'kids',
    size: ['2T', '3T', '4T', '5', '6'],
    description: 'Beautiful sparkle party dress for special occasions. Makes your little one shine.',
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=800&fit=crop',
    stock: 20,
  },
  {
    id: 'k4',
    name: 'Sports Jersey Set',
    price: 34.99,
    category: 'kids',
    size: ['3T', '4T', '5', '6', '7'],
    description: 'Cool sports jersey set for active kids. Breathable fabric for playtime.',
    image: 'https://images.unsplash.com/photo-1518831959646-866334651389?w=600&h=800&fit=crop',
    stock: 40,
    isNew: true,
  },
  {
    id: 'k5',
    name: 'Denim Overalls',
    price: 44.99,
    salePrice: 29.99,
    discount: 33,
    category: 'kids',
    size: ['2T', '3T', '4T', '5', '6'],
    description: 'Classic denim overalls for kids. Durable and stylish for everyday wear.',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop',
    stock: 25,
  },
  {
    id: 'k6',
    name: 'Unicorn Pajama Set',
    price: 24.99,
    category: 'kids',
    size: ['2T', '3T', '4T', '5', '6', '7'],
    description: 'Magical unicorn pajama set. Super soft and comfortable for sweet dreams.',
    image: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&h=800&fit=crop',
    stock: 55,
  },
];

export const sampleReviews: Review[] = [
  {
    id: 'r1',
    name: 'Sarah Mitchell',
    rating: 5,
    review: 'Absolutely love the quality of EMOREV products! The silk evening gown I ordered was beyond my expectations. The fabric is luxurious and the fit is perfect. Will definitely be shopping here again!',
    date: '2024-12-15',
  },
  {
    id: 'r2',
    name: 'James Anderson',
    rating: 5,
    review: 'The classic suit jacket is phenomenal. Premium quality at a reasonable price. The tailoring is impeccable and I received so many compliments at a recent event. EMOREV is now my go-to brand.',
    date: '2024-12-10',
  },
  {
    id: 'r3',
    name: 'Emily Chen',
    rating: 4,
    review: 'Great selection of kids clothes! My children love their new outfits. The rainbow t-shirt and sparkle dress are absolutely adorable. Only wish there were more size options.',
    date: '2024-12-08',
  },
  {
    id: 'r4',
    name: 'Marcus Williams',
    rating: 5,
    review: 'Fast shipping, premium packaging, and outstanding quality. The leather bomber jacket is exactly what I was looking for. The racing-inspired website design is also super cool!',
    date: '2024-12-05',
  },
  {
    id: 'r5',
    name: 'Olivia Thompson',
    rating: 4,
    review: 'Beautiful designs and excellent customer service. The cashmere sweater is incredibly soft. EMOREV has quickly become my favorite fashion brand. Highly recommended!',
    date: '2024-12-01',
  },
  {
    id: 'r6',
    name: 'David Park',
    rating: 5,
    review: 'The premium denim jacket exceeded all expectations. Amazing quality and the fit is spot on. Love the futuristic vibe of the brand. EMOREV is the future of fashion!',
    date: '2024-11-28',
  },
];
