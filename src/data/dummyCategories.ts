export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  children?: Category[];
}

export const dummyCategories: Category[] = [
  {
    id: "1",
    name: "Computer & Accessories",
    slug: "computer-accessories",
    icon: "Monitor",
    children: [
      {
        id: "1-1",
        name: "Laptops",
        slug: "laptops",
        children: [
          { id: "1-1-1", name: "Gaming Laptops", slug: "gaming-laptops" },
          { id: "1-1-2", name: "Business Laptops", slug: "business-laptops" },
          { id: "1-1-3", name: "Ultrabooks", slug: "ultrabooks" },
        ],
      },
      {
        id: "1-2",
        name: "Desktops",
        slug: "desktops",
        children: [
          { id: "1-2-1", name: "All-in-One PCs", slug: "all-in-one-pcs" },
          { id: "1-2-2", name: "Gaming Desktops", slug: "gaming-desktops" },
          { id: "1-2-3", name: "Mini PCs", slug: "mini-pcs" },
        ],
      },
      {
        id: "1-3",
        name: "Components",
        slug: "components",
        children: [
          { id: "1-3-1", name: "Processors", slug: "processors" },
          { id: "1-3-2", name: "Graphics Cards", slug: "graphics-cards" },
          { id: "1-3-3", name: "RAM", slug: "ram" },
          { id: "1-3-4", name: "Storage (SSD/HDD)", slug: "storage" },
        ],
      },
      {
        id: "1-4",
        name: "Peripherals",
        slug: "peripherals",
        children: [
          { id: "1-4-1", name: "Keyboards", slug: "keyboards" },
          { id: "1-4-2", name: "Mouse", slug: "mouse" },
          { id: "1-4-3", name: "Monitors", slug: "monitors" },
          { id: "1-4-4", name: "Webcams", slug: "webcams" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Electronic & Accessories",
    slug: "electronic-accessories",
    icon: "Cpu",
    children: [
      {
        id: "2-1",
        name: "Audio",
        slug: "audio",
        children: [
          { id: "2-1-1", name: "Headphones", slug: "headphones" },
          { id: "2-1-2", name: "Speakers", slug: "speakers" },
          { id: "2-1-3", name: "Earbuds", slug: "earbuds" },
        ],
      },
      {
        id: "2-2",
        name: "Camera & Photo",
        slug: "camera-photo",
        children: [
          { id: "2-2-1", name: "DSLR Cameras", slug: "dslr-cameras" },
          { id: "2-2-2", name: "Action Cameras", slug: "action-cameras" },
          { id: "2-2-3", name: "Camera Lenses", slug: "camera-lenses" },
        ],
      },
      {
        id: "2-3",
        name: "Wearable Tech",
        slug: "wearable-tech",
        children: [
          { id: "2-3-1", name: "Smartwatches", slug: "smartwatches" },
          { id: "2-3-2", name: "Fitness Trackers", slug: "fitness-trackers" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Mobile & Accessories",
    slug: "mobile-accessories",
    icon: "Smartphone",
    children: [
      {
        id: "3-1",
        name: "Smartphones",
        slug: "smartphones",
        children: [
          { id: "3-1-1", name: "Android Phones", slug: "android-phones" },
          { id: "3-1-2", name: "iPhones", slug: "iphones" },
          { id: "3-1-3", name: "Feature Phones", slug: "feature-phones" },
        ],
      },
      {
        id: "3-2",
        name: "Tablets",
        slug: "tablets",
        children: [
          { id: "3-2-1", name: "Android Tablets", slug: "android-tablets" },
          { id: "3-2-2", name: "iPads", slug: "ipads" },
        ],
      },
      {
        id: "3-3",
        name: "Mobile Accessories",
        slug: "mobile-acc",
        children: [
          { id: "3-3-1", name: "Cases & Covers", slug: "cases-covers" },
          { id: "3-3-2", name: "Screen Protectors", slug: "screen-protectors" },
          { id: "3-3-3", name: "Chargers & Cables", slug: "chargers-cables" },
          { id: "3-3-4", name: "Power Banks", slug: "power-banks" },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Fashion",
    slug: "fashion",
    icon: "Shirt",
    children: [
      {
        id: "4-1",
        name: "Men's Fashion",
        slug: "mens-fashion",
        children: [
          { id: "4-1-1", name: "T-Shirts & Polos", slug: "mens-tshirts" },
          { id: "4-1-2", name: "Shirts", slug: "mens-shirts" },
          { id: "4-1-3", name: "Pants & Jeans", slug: "mens-pants" },
        ],
      },
      {
        id: "4-2",
        name: "Women's Fashion",
        slug: "womens-fashion",
        children: [
          { id: "4-2-1", name: "Dresses", slug: "dresses" },
          { id: "4-2-2", name: "Tops & Blouses", slug: "tops-blouses" },
          { id: "4-2-3", name: "Sarees & Salwar", slug: "sarees-salwar" },
        ],
      },
      {
        id: "4-3",
        name: "Footwear",
        slug: "footwear",
        children: [
          { id: "4-3-1", name: "Sneakers", slug: "sneakers" },
          { id: "4-3-2", name: "Sandals", slug: "sandals" },
          { id: "4-3-3", name: "Formal Shoes", slug: "formal-shoes" },
        ],
      },
    ],
  },
  {
    id: "5",
    name: "Mother & Baby",
    slug: "mother-baby",
    icon: "Baby",
    children: [
      {
        id: "5-1",
        name: "Baby Care",
        slug: "baby-care",
        children: [
          { id: "5-1-1", name: "Diapers", slug: "diapers" },
          { id: "5-1-2", name: "Baby Food", slug: "baby-food" },
          { id: "5-1-3", name: "Baby Clothing", slug: "baby-clothing" },
        ],
      },
      {
        id: "5-2",
        name: "Maternity",
        slug: "maternity",
        children: [
          { id: "5-2-1", name: "Maternity Wear", slug: "maternity-wear" },
          { id: "5-2-2", name: "Nursing Essentials", slug: "nursing-essentials" },
        ],
      },
    ],
  },
  {
    id: "6",
    name: "Home & Living",
    slug: "home-living",
    icon: "Sofa",
    children: [
      {
        id: "6-1",
        name: "Furniture",
        slug: "furniture",
        children: [
          { id: "6-1-1", name: "Living Room", slug: "living-room" },
          { id: "6-1-2", name: "Bedroom", slug: "bedroom" },
          { id: "6-1-3", name: "Office Furniture", slug: "office-furniture" },
        ],
      },
      {
        id: "6-2",
        name: "Kitchen & Dining",
        slug: "kitchen-dining",
        children: [
          { id: "6-2-1", name: "Cookware", slug: "cookware" },
          { id: "6-2-2", name: "Dinnerware", slug: "dinnerware" },
          { id: "6-2-3", name: "Kitchen Appliances", slug: "kitchen-appliances" },
        ],
      },
    ],
  },
  {
    id: "7",
    name: "Food & Groceries",
    slug: "food-groceries",
    icon: "ShoppingBasket",
    children: [
      {
        id: "7-1",
        name: "Fresh Food",
        slug: "fresh-food",
        children: [
          { id: "7-1-1", name: "Fruits & Vegetables", slug: "fruits-vegetables" },
          { id: "7-1-2", name: "Meat & Seafood", slug: "meat-seafood" },
          { id: "7-1-3", name: "Dairy & Eggs", slug: "dairy-eggs" },
        ],
      },
      {
        id: "7-2",
        name: "Pantry Staples",
        slug: "pantry-staples",
        children: [
          { id: "7-2-1", name: "Rice & Grains", slug: "rice-grains" },
          { id: "7-2-2", name: "Spices & Seasonings", slug: "spices" },
          { id: "7-2-3", name: "Cooking Oil", slug: "cooking-oil" },
        ],
      },
    ],
  },
  {
    id: "8",
    name: "Health & Beauty",
    slug: "health-beauty",
    icon: "Heart",
    children: [
      {
        id: "8-1",
        name: "Skincare",
        slug: "skincare",
        children: [
          { id: "8-1-1", name: "Face Care", slug: "face-care" },
          { id: "8-1-2", name: "Body Care", slug: "body-care" },
          { id: "8-1-3", name: "Sunscreen", slug: "sunscreen" },
        ],
      },
      {
        id: "8-2",
        name: "Makeup",
        slug: "makeup",
        children: [
          { id: "8-2-1", name: "Lipstick", slug: "lipstick" },
          { id: "8-2-2", name: "Foundation", slug: "foundation" },
          { id: "8-2-3", name: "Eye Makeup", slug: "eye-makeup" },
        ],
      },
    ],
  },
  {
    id: "9",
    name: "Books & Stationary",
    slug: "books-stationary",
    icon: "BookOpen",
    children: [
      {
        id: "9-1",
        name: "Books",
        slug: "books",
        children: [
          { id: "9-1-1", name: "Fiction", slug: "fiction" },
          { id: "9-1-2", name: "Non-Fiction", slug: "non-fiction" },
          { id: "9-1-3", name: "Academic", slug: "academic" },
        ],
      },
      {
        id: "9-2",
        name: "Stationery",
        slug: "stationery",
        children: [
          { id: "9-2-1", name: "Pens & Pencils", slug: "pens-pencils" },
          { id: "9-2-2", name: "Notebooks", slug: "notebooks" },
          { id: "9-2-3", name: "Art Supplies", slug: "art-supplies" },
        ],
      },
    ],
  },
  {
    id: "10",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    icon: "Dumbbell",
    children: [
      {
        id: "10-1",
        name: "Exercise & Fitness",
        slug: "exercise-fitness",
        children: [
          { id: "10-1-1", name: "Yoga & Pilates", slug: "yoga-pilates" },
          { id: "10-1-2", name: "Gym Equipment", slug: "gym-equipment" },
          { id: "10-1-3", name: "Fitness Accessories", slug: "fitness-accessories" },
        ],
      },
      {
        id: "10-2",
        name: "Outdoor Sports",
        slug: "outdoor-sports",
        children: [
          { id: "10-2-1", name: "Cricket", slug: "cricket" },
          { id: "10-2-2", name: "Football", slug: "football" },
          { id: "10-2-3", name: "Cycling", slug: "cycling" },
        ],
      },
    ],
  },
  {
    id: "11",
    name: "Automotive & Motorbike",
    slug: "automotive-motorbike",
    icon: "Car",
    children: [
      {
        id: "11-1",
        name: "Car Accessories",
        slug: "car-accessories",
        children: [
          { id: "11-1-1", name: "Car Electronics", slug: "car-electronics" },
          { id: "11-1-2", name: "Car Care", slug: "car-care" },
          { id: "11-1-3", name: "Interior Accessories", slug: "interior-accessories" },
        ],
      },
      {
        id: "11-2",
        name: "Motorbike Accessories",
        slug: "motorbike-accessories",
        children: [
          { id: "11-2-1", name: "Helmets", slug: "helmets" },
          { id: "11-2-2", name: "Riding Gear", slug: "riding-gear" },
          { id: "11-2-3", name: "Bike Parts", slug: "bike-parts" },
        ],
      },
    ],
  },
];
