import { motion } from "framer-motion";
import { Shield, Clock, Handshake, Tag } from "lucide-react";

export default function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: "Zero Risk",
      description: "WhatsApp + COD only",
      bgColor: "bg-trust/10",
      iconColor: "text-trust"
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "30-60 minutes to hotel",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: Handshake,
      title: "Local Trust",
      description: "Recommended by hotels",
      bgColor: "bg-accent/10",
      iconColor: "text-accent"
    },
    {
      icon: Tag,
      title: "Fair Pricing",
      description: "No tourist markup",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {indicators.map((indicator, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className={`w-16 h-16 ${indicator.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <indicator.icon className={`${indicator.iconColor} text-2xl w-8 h-8`} />
              </div>
              <h3 className="font-semibold text-secondary mb-1">{indicator.title}</h3>
              <p className="text-sm text-gray-600">{indicator.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
