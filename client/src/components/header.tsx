import { Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🕌</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary">TajByHand</h1>
              <p className="text-xs text-gray-500">Authentic Agra Handicrafts</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
              <span>💬</span>
              <span>Order via WhatsApp</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              <span>💰</span>
              <span>Pay on Delivery</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-trust" />
              <span>Trusted by Locals</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
