import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
import StickyWhatsAppMobile from "@/components/sticky-whatsapp-mobile";
import type { Hotel } from "@shared/schema";

export default function Home() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const hotelCode = searchParams.get("hotel") || "pearl";
  
  // Fetch hotel data dynamically
  const { data: hotel, isLoading, isError } = useQuery<Hotel>({
    queryKey: [`/api/hotels/${hotelCode}`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/hotels/${hotelCode}`);
      if (!response.ok) {
        throw new Error("Hotel not found");
      }
      return response.json();
    },
    enabled: !!hotelCode,
    retry: false,
  });
  
  // Fallback hotel name
  const hotelName = hotel?.hotelName || 'Our Partner Hotel';
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show error state for invalid hotel codes
  if (isError || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Hotel Not Found</h1>
          <p className="text-gray-600 mb-6">
            The hotel code "{hotelCode}" is not recognized. Please check the QR code or contact your hotel reception.
          </p>
          <a 
            href="/" 
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continue Anyway
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="main-content">
        <HeroSection hotelName={hotelName} />
        <TrustIndicators />
        <ComparisonTable />
        <ProductGrid hotelCode={hotelCode} hotelName={hotelName} />
        <ProcessSection />
        <FAQSection />
        <Testimonials />
      </div>
      <Footer />
      <FloatingWhatsApp hotelName={hotelName} />
      <StickyWhatsAppMobile hotelName={hotelName} />
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
