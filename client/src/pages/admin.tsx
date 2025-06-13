import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Product, Order, Hotel } from "@shared/schema";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/auth/login", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      toast({ title: "Success", description: "Logged in successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">TajByHand Admin</h1>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="hotels">
            <HotelManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (product: any) => {
      const response = await apiRequest("POST", "/products", product);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/products"] });
      setShowForm(false);
      toast({ title: "Success", description: "Product created successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, product }: { id: number; product: any }) => {
      const response = await apiRequest("PUT", `/products/${id}`, product);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/products"] });
      setEditingProduct(null);
      toast({ title: "Success", description: "Product updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/products"] });
      toast({ title: "Success", description: "Product deleted successfully" });
    },
  });

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Button onClick={() => setShowForm(true)}>Add Product</Button>
      </div>

      {(showForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onSubmit={(data) => {
            if (editingProduct) {
              updateMutation.mutate({ id: editingProduct.id, product: data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <div className="grid gap-4">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex space-x-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">₹{product.price}</Badge>
                      <Badge variant="outline">{product.category}</Badge>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock} in stock
                      </Badge>
                      {product.isFeatured && <Badge>Featured</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading,
}: {
  product: Product | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    imageUrl: product?.imageUrl || "",
    category: product?.category || "",
    stock: product?.stock || 0,
    isFeatured: product?.isFeatured || false,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploadedImage = formData.imageUrl.startsWith("/assets/products/");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.imageUrl) {
      setError("Please provide an image URL or upload a file.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Product Image</Label>
            <div className="flex items-center space-x-4">
              {!isUploadedImage && (
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Paste image URL or upload file"
                />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : isUploadedImage ? "Re-upload" : "Upload"}
              </Button>
              {isUploadedImage && (
                <Button type="button" variant="outline" onClick={handleClearImage}>
                  Clear
                </Button>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">You can either paste an image URL or upload a file from your computer.</div>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="featured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function HotelManagement() {
  const [showForm, setShowForm] = useState(false);
  const [showQR, setShowQR] = useState<{hotel: Hotel, qrData: any} | null>(null);
  const { toast } = useToast();

  const { data: hotels, isLoading } = useQuery<Hotel[]>({
    queryKey: ["/hotels"],
  });

  const createMutation = useMutation({
    mutationFn: async (hotel: any) => {
      const response = await apiRequest("POST", "/hotels", hotel);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/hotels"] });
      setShowForm(false);
      toast({ title: "Success", description: "Hotel created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create hotel", variant: "destructive" });
    },
  });

  const generateQRMutation = useMutation({
    mutationFn: async (hotelCode: string) => {
      const response = await apiRequest("GET", `/api/hotels/${hotelCode}/qr`);
      return response.json();
    },
    onSuccess: (data, hotelCode) => {
      const hotel = hotels?.find(h => h.hotelCode === hotelCode);
      if (hotel) {
        setShowQR({ hotel, qrData: data });
      }
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to generate QR code", variant: "destructive" });
    },
  });

  if (isLoading) return <div>Loading hotels...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Hotel Management</h2>
        <Button onClick={() => setShowForm(true)}>Add Hotel</Button>
      </div>

      {showForm && (
        <HotelForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      )}

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code for {showQR.hotel.hotelName}</h3>
              <Button variant="ghost" onClick={() => setShowQR(null)}>×</Button>
            </div>
            <div className="text-center space-y-4">
              <div dangerouslySetInnerHTML={{ __html: showQR.qrData.qrCode }} />
              <div className="space-y-2">
                <p className="text-sm font-medium">Tracking URL:</p>
                <p className="text-xs bg-gray-100 p-2 rounded break-all">{showQR.qrData.trackingUrl}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(showQR.qrData.trackingUrl);
                    toast({ title: "Copied!", description: "URL copied to clipboard" });
                  }}
                  variant="outline"
                >
                  Copy URL
                </Button>
                <Button 
                  onClick={() => {
                    const blob = new Blob([showQR.qrData.qrCode], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${showQR.hotel.hotelCode}-qr.svg`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download QR
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {hotels?.map((hotel) => (
          <Card key={hotel.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{hotel.hotelName}</h3>
                  <p className="text-sm text-gray-600">Code: {hotel.hotelCode}</p>
                  <p className="text-sm text-gray-600">Commission: {hotel.commissionRate}%</p>
                  <p className="text-xs text-gray-500">Created: {new Date(hotel.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => generateQRMutation.mutate(hotel.hotelCode)}
                    disabled={generateQRMutation.isPending}
                  >
                    {generateQRMutation.isPending ? "Generating..." : "Generate QR"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {hotels?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No hotels added yet. Click "Add Hotel" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function HotelForm({
  onSubmit,
  onCancel,
  isLoading,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    hotelName: "",
    hotelCode: "",
    commissionRate: "10.00",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hotelName.trim()) {
      return;
    }

    const hotelCode = formData.hotelCode || generateSlug(formData.hotelName);
    
    onSubmit({
      hotelName: formData.hotelName.trim(),
      hotelCode: hotelCode,
      commissionRate: formData.commissionRate,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Hotel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="hotelName">Hotel Name</Label>
            <Input
              id="hotelName"
              value={formData.hotelName}
              onChange={(e) => {
                const name = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  hotelName: name,
                  hotelCode: prev.hotelCode || generateSlug(name)
                }));
              }}
              placeholder="e.g., Royal Taj Hotel"
              required
            />
          </div>

          <div>
            <Label htmlFor="hotelCode">Hotel Code (URL slug)</Label>
            <Input
              id="hotelCode"
              value={formData.hotelCode}
              onChange={(e) => setFormData(prev => ({ ...prev, hotelCode: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))}
              placeholder="e.g., royaltaj"
              pattern="[a-z0-9]+"
              title="Only lowercase letters and numbers allowed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will create: {window.location.origin}/?hotel={formData.hotelCode}
            </p>
          </div>

          <div>
            <Label htmlFor="commissionRate">Commission Rate (%)</Label>
            <Input
              id="commissionRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.commissionRate}
              onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: e.target.value }))}
              required
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Hotel"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function OrderManagement() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/orders"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Management</h2>
      <div className="grid gap-4">
        {orders?.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600">Hotel: {order.hotelCode}</p>
                  <p className="text-gray-600">Product ID: {order.productId}</p>
                  <p className="text-gray-600 text-sm">{order.messageText}</p>
                  <p className="text-gray-500 text-xs">{new Date(order.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      order.status === "fulfilled"
                        ? "default"
                        : order.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {order.status}
                  </Badge>
                  {order.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: "fulfilled" })}
                      >
                        Mark Fulfilled
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: "cancelled" })}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReportsSection() {
  const { data: commissions, isLoading } = useQuery({
    queryKey: ["/api/reports/commissions"],
  });

  if (isLoading) return <div>Loading reports...</div>;

  const commissionList = Array.isArray(commissions) ? commissions : [];

  const totalCommissions = commissionList.reduce((sum: number, report: any) => sum + (report.commissionAmount || 0), 0);
  const totalRevenue = commissionList.reduce((sum: number, report: any) => sum + (report.totalRevenue || 0), 0);
  const totalOrders = commissionList.reduce((sum: number, report: any) => sum + (report.fulfilledOrders || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Hotel Commission Dashboard</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">₹{totalCommissions.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Commission</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{totalOrders}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotel-wise Commission Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Hotel-wise Commission Report</h3>
        {commissionList.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No commission data available yet. Orders will appear here once hotels start generating sales.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {commissionList.map((report: any) => (
              <Card key={report.hotelCode}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{report.hotelName}</h4>
                      <p className="text-sm text-gray-600">Code: {report.hotelCode}</p>
                    </div>
                    <Badge variant="outline">
                      {report.commissionRate}% Commission
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold">{report.totalOrders}</p>
                      <p className="text-xs text-gray-600">Total Orders</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-700">{report.fulfilledOrders}</p>
                      <p className="text-xs text-gray-600">Fulfilled</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-700">₹{(report.totalRevenue || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Revenue</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-700">₹{(report.commissionAmount || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Commission</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Conversion Rate: {report.totalOrders > 0 ? ((report.fulfilledOrders / report.totalOrders) * 100).toFixed(1) : 0}%
                      </span>
                      <span className="text-sm text-gray-600">
                        Avg. Order Value: ₹{report.fulfilledOrders > 0 ? Math.round(report.totalRevenue / report.fulfilledOrders) : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
