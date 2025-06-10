import { MapPin, Mail, Clock, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🕌</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">TajByHand</h3>
                <p className="text-sm text-gray-300">Authentic Agra Handicrafts</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Bringing authentic Indian handicrafts directly to tourists through hotel partnerships and WhatsApp ordering.
            </p>
            <div className="flex space-x-4">
              <button className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <span>💬</span>
              </button>
              <button className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#products" className="hover:text-primary transition-colors">Browse Products</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Marble Work</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Wood Carvings</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Textiles</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Jewelry</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <span>💬</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@tajbyhand.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Agra, Uttar Pradesh</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>9 AM - 10 PM Daily</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">&copy; 2024 TajByHand. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-300 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-300 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-gray-300 hover:text-primary transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
