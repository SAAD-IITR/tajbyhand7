import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function ComparisonTable() {
  const products = [
    {
      name: '12" Marble Taj Mahal',
      description: 'White marble with inlay',
      touristPrice: '₹8,400',
      ourPrice: '₹2,800',
      savings: '₹5,600',
      discount: '67% off'
    },
    {
      name: 'Wooden Elephant Pair',
      description: 'Hand-carved rosewood',
      touristPrice: '₹3,600',
      ourPrice: '₹1,200',
      savings: '₹2,400',
      discount: '67% off'
    },
    {
      name: 'Pashmina Shawl',
      description: 'Pure Kashmir wool',
      touristPrice: '₹4,500',
      ourPrice: '₹1,800',
      savings: '₹2,700',
      discount: '60% off'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-secondary mb-4">Why Tourists Pay 3x More</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Most handicraft shops near tourist sites have inflated prices. Here's what you actually save with TajByHand:
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-secondary">Product</th>
                      <th className="px-6 py-4 text-center font-semibold text-red-600">Tourist Shop</th>
                      <th className="px-6 py-4 text-center font-semibold text-primary">TajByHand</th>
                      <th className="px-6 py-4 text-center font-semibold text-accent">You Save</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product, index) => (
                      <motion.tr
                        key={index}
                        className={index % 2 === 1 ? "bg-gray-50/50" : ""}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        viewport={{ once: true }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                            <div>
                              <div className="font-medium text-secondary">{product.name}</div>
                              <div className="text-sm text-gray-600">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-red-600 font-bold text-lg">{product.touristPrice}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-primary font-bold text-lg">{product.ourPrice}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-accent font-bold text-lg">{product.savings}</span>
                          <div className="text-sm text-gray-600">{product.discount}</div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-primary/5 border-t border-primary/20">
                <div className="flex items-center justify-center space-x-2 text-sm text-primary">
                  <Info className="w-4 h-4" />
                  <span>Prices verified with local artisans in Agra markets (Oct 2024)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
