import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I know the products are authentic?",
      answer: "All our products are sourced directly from verified artisan families in Agra who have been practicing these crafts for generations. We visit each workshop personally and maintain long-term relationships with craftspeople. Each item comes with authenticity information about the artisan who made it."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We only accept Cash on Delivery (COD) to your hotel room. This eliminates any online payment risks and ensures you can inspect the item before paying. No credit cards, no online transfers - just simple, safe cash payment upon delivery."
    },
    {
      question: "How fast is the delivery to my hotel?",
      answer: "Most orders are delivered within 30-60 minutes to your hotel room. We maintain inventory at our Agra warehouse and have delivery partners familiar with all major hotels. You'll receive a WhatsApp message with delivery updates and our representative's contact details."
    },
    {
      question: "Can I return an item if I'm not satisfied?",
      answer: "Yes! Since you pay cash on delivery, you can inspect the item thoroughly before payment. If you're not completely satisfied with the quality or if the item doesn't match the description, simply refuse the delivery. We also offer a 2-hour return window for any quality concerns."
    },
    {
      question: "Why are your prices so much lower than tourist shops?",
      answer: "Tourist shops near major attractions often mark up prices by 200-300% because they know visitors have limited time and options. We work directly with artisans, cutting out multiple middlemen, and operate online to keep costs low. Our prices reflect the true local market value plus a fair margin."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-secondary mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Everything you need to know about ordering authentic handicrafts through TajByHand
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg px-6 data-[state=open]:bg-gray-50/50"
                >
                  <AccordionTrigger className="text-left font-semibold text-secondary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
