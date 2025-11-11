// src/data/products.ts
export const category1 = [
    {
      id: "fish001",
      name: "Vanjaram | All Fields",
      category: "fish",
      subCategory: "sea food",
      description: "Good for eye and lungs",
      image: "https://i.ibb.co/fnrwG9D/prawns.jpg", // sample
      available: true,
      priceOptions: [
        { type: "Small", price: 700, available: true },
        { type: "Medium", price: 810, available: true }
      ],
      cutTypes: [
        { type: "Slice", price: 30 },
        { type: "Curry cut", price: 25 }
      ]
    },
    {
      id: "fish002",
      name: "Pomfret | White Fish",
      category: "fish",
      subCategory: "sea food",
      description: "Rich in omega-3 and easy to cook",
      image: "https://i.ibb.co/4g6FK8M/pomfret.jpg",
      available: true,
      priceOptions: [
        { type: "Medium", price: 650, available: true }
      ],
      cutTypes: [
        { type: "Whole", price: 0 },
        { type: "Fillet", price: 35 }
      ]
    }
  ];
  
  export const category2 = [
    {
      id: "meat001",
      name: "Goat | Mutton",
      category: "meat",
      subCategory: "black goat",
      image: "https://i.ibb.co/NLKcjcT/mutton.jpg",
      available: true,
      netWeight: "1kg",
      price: 920
    },
    {
      id: "meat002",
      name: "Chicken Breast | Farm Fresh",
      category: "meat",
      subCategory: "poultry",
      image: "https://i.ibb.co/qFkFW4r/chicken.jpg",
      available: true,
      netWeight: "500g",
      price: 280
    }
  ];
  
  export const DELIVERY_FEE = 38; // 🚴‍♂️ Default global delivery charge
  