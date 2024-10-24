import React from "react";
import { Card } from "@/Components/ui/card";
import { Check } from "lucide-react";

const ProductSalesDashboard = () => {
  const productData = [
    {
      id: 1,
      name: "iPhone 14 Pro Max 512GB",
      variant: "Gold",
      price: 1399,
      soldCount: 1243,
      status: "In Stock",
      image: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "iPhone 13 512GB",
      variant: "Purple",
      price: 1099,
      soldCount: 433,
      status: "In Stock",
      image: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Google Pixel 7 pro 128GB",
      variant: "Black",
      price: 899,
      soldCount: 2343,
      status: "In Stock",
      image: "/api/placeholder/40/40",
    },
  ];

  const topCountries = [
    { name: "India", percentage: 16, flag: "🇮🇳" },
    { name: "USA", percentage: 15, flag: "🇺🇸" },
    { name: "UK", percentage: 15, flag: "🇬🇧" },
    { name: "Australia", percentage: 14, flag: "🇦🇺" },
    { name: "Germany", percentage: 13, flag: "🇩🇪" },
  ];

  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)} đ`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Transaction</h2>
          {/* <div className="flex items-center space-x-2">
            <select className="bg-slate-50 text-sm rounded-lg px-4 py-2 text-slate-600 focus:outline-none focus:ring-2">
              <option>8 Jan - 2 Feb</option>
            </select>
          </div> */}
        </div>

        <div className="space-y-4">
          {productData.map((product) => (
           <div
           key={product.id}
           className="flex justify-between items-center gap-10 py-3 border-b last:border-0"
         >
           {/* Image and product details */}
           <div className="flex items-center space-x-4">
             <img
               src={product.image}
               alt={product.name}
               className="w-10 h-10 rounded-lg object-cover"
             />
             <div>
               <h3 className="font-medium text-sm">{product.name}</h3>
               <p className="text-sm text-slate-500">({product.variant})</p>
             </div>
           </div>
         
           {/* Price and sold count */}
           <div className="text-right">
             <p className="font-medium">{formatCurrency(product.price)}</p>
             <p className="text-sm text-slate-500">{product.soldCount} pcs</p>
           </div>
         
           {/* Status */}
           <div className="flex items-center space-x-1 text-green-500">
             <Check size={16} />
             <span className="text-sm">{product.status}</span>
           </div>
         </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Top Buyer</h2>
          <p>Cost</p>
        </div>

        <div className="space-y-4">
          {topCountries.map((country, index) => (
            <div
              key={country.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg">{index + 1}</span>
                <span className="text-xl">{country.flag}</span>
                <span className="font-medium">{country.name}</span>
              </div>
              <span className="font-medium">{country.percentage}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProductSalesDashboard;
