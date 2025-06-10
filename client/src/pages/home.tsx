import { useLocation } from "wouter";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import TrustIndicators from "@/components/trust-indicators";
import ComparisonTable from "@/components/comparison-table";
import ProductGrid from "@/components/product-grid";
// ProcessSection is defined below
import FAQSection from "@/components/faq-section";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";

export default function Home() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const hotelCode = searchParams.get("hotel") || "pearl";
  
  const hotelNames: Record<string, string> = {
    'pearl': 'Pearl Heritage Hotel',
    'taj': 'Taj Hotel & Convention Centre',
    'oberoi': 'The Oberoi Amarvilas'
  };
  
  const hotelName = hotelNames[hotelCode] || 'Pearl Heritage Hotel';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection hotelName={hotelName} hotelCode={hotelCode} />
      <TrustIndicators />
      <ComparisonTable />
      <ProductGrid hotelCode={hotelCode} hotelName={hotelName} />
      <ProcessSection />
      <FAQSection />
      <Testimonials />
      <Footer />
      <FloatingWhatsApp hotelName={hotelName} />
    </div>
  );
}

function ProcessSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple, safe, and fast. Get authentic handicrafts delivered directly to your hotel room in under an hour.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: "📱",
              title: "Scan QR Code",
              description: "Find the TajByHand QR code at your hotel reception and scan it"
            },
            {
              icon: "🛍️",
              title: "Browse & Select",
              description: "Choose from our curated collection of authentic Agra handicrafts"
            },
            {
              icon: "💬",
              title: "Order via WhatsApp",
              description: "Click order and WhatsApp opens with your hotel details pre-filled"
            },
            {
              icon: "🚚",
              title: "Receive at Hotel",
              description: "Get your handicrafts delivered to your room within 30-60 minutes"
            }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative text-2xl">
                {step.icon}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="font-semibold text-secondary mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
