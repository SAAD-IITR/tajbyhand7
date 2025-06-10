import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      rating: 5,
      text: "Incredible experience! The marble Taj Mahal I ordered was delivered to my hotel room in just 45 minutes. The quality is amazing and I paid 1/3 of what the tour guide quoted. Highly recommend!",
      name: "Sarah M.",
      location: "London, UK"
    },
    {
      rating: 5,
      text: "Perfect for tourists who want authentic souvenirs without the hassle. WhatsApp ordering was so convenient, and the cash on delivery made me feel secure. The wooden elephants are beautiful!",
      name: "Marco R.",
      location: "Rome, Italy"
    },
    {
      rating: 5,
      text: "As a frequent traveler, I've been overcharged many times. TajByHand saved me hundreds of rupees and delivered gorgeous pashmina shawls right to my hotel. Professional service!",
      name: "Jennifer K.",
      location: "Sydney, Australia"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-secondary mb-4">What Travelers Say</h2>
          <p className="text-gray-600">
            Real experiences from tourists who discovered authentic handicrafts through TajByHand
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{testimonial.rating}.0</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-secondary">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
