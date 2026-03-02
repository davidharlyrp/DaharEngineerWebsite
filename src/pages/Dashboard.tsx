import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  FileDown, 
  ShoppingBag, 
  Bell,
  LogOut,
  Edit2,
  Save,
  Download,
  Clock,
  CheckCircle2,
  Star,
  BookOpen,
  Package
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UserProfile, CourseBooking, RequestedFile, ProductHistory, DashboardStats } from '@/types';

// Mock data
const mockProfile: UserProfile = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: '',
  phone: '+62 812-3456-7890',
  company: 'ABC Engineering',
  profession: 'Structural Engineer',
  bio: 'Passionate civil engineer with 5+ years of experience in structural design.',
  location: 'Jakarta, Indonesia',
  created: '2024-01-15',
  updated: '2024-11-20'
};

const mockBookings: CourseBooking[] = [
  {
    id: '1',
    userId: '1',
    courseId: 'c1',
    courseName: 'Revit Structural Beginner',
    courseType: 'online',
    instructor: 'David Prabudhi',
    status: 'confirmed',
    price: 899000,
    paymentStatus: 'paid',
    created: '2024-11-15',
    updated: '2024-11-15'
  },
  {
    id: '2',
    userId: '1',
    courseId: 'c2',
    courseName: 'ETABS Advanced Analysis',
    courseType: 'private',
    instructor: 'David Prabudhi',
    status: 'pending',
    schedule: {
      date: '2024-12-10',
      time: '14:00',
      duration: '3 hours'
    },
    price: 1299000,
    paymentStatus: 'pending',
    created: '2024-11-18',
    updated: '2024-11-18'
  }
];

const mockRequestedFiles: RequestedFile[] = [
  {
    id: '1',
    userId: '1',
    title: 'Project Calculation Report',
    description: 'Detailed calculation for high-rise building project',
    fileUrl: '#',
    fileName: 'calculation_report_v1.pdf',
    fileSize: '2.5 MB',
    fileType: 'application/pdf',
    status: 'delivered',
    requestedAt: '2024-11-10',
    deliveredAt: '2024-11-12',
    downloadCount: 1,
    maxDownloads: 5,
    messageFromAdmin: 'Your calculation report is ready for download.'
  },
  {
    id: '2',
    userId: '1',
    title: 'Structural Drawings',
    description: 'CAD drawings for foundation design',
    fileUrl: '#',
    fileName: '',
    fileSize: '',
    fileType: '',
    status: 'processing',
    requestedAt: '2024-11-18',
    downloadCount: 0,
    maxDownloads: 3
  }
];

const mockProductHistory: ProductHistory[] = [
  {
    id: '1',
    userId: '1',
    productId: 'p1',
    productName: 'Structural Column Revit Family',
    category: 'revit-family',
    price: 299000,
    purchaseDate: '2024-10-15',
    orderId: 'ORD-2024-001',
    downloadUrl: '#',
    downloadCount: 2,
    maxDownloads: 10,
    isExpired: false
  },
  {
    id: '2',
    userId: '1',
    productId: 'p2',
    productName: 'Beam Design Excel Template',
    category: 'excel-template',
    price: 149000,
    purchaseDate: '2024-09-20',
    orderId: 'ORD-2024-002',
    downloadUrl: '#',
    downloadCount: 5,
    maxDownloads: 10,
    isExpired: false
  }
];

const mockStats: DashboardStats = {
  totalBookings: 2,
  activeBookings: 1,
  completedBookings: 1,
  totalPurchases: 2,
  pendingFiles: 1,
  availableFiles: 1,
  totalSpent: 1347000
};

// Profile Tab
function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {saved && (
        <Alert className="bg-army-700/20 border-army-500/30">
          <CheckCircle2 className="h-4 w-4 text-army-400" />
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <Card className="bg-secondary/30 border-border/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <><Save className="w-4 h-4 mr-2" /> Save</>
            ) : (
              <><Edit2 className="w-4 h-4 mr-2" /> Edit</>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-army-700 text-2xl">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={profile.name}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={profile.email}
                disabled
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={profile.phone}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={profile.company}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Profession</Label>
              <Input
                value={profile.profession}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={profile.location}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Bio</Label>
              <Input
                value={profile.bio}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Bookings Tab
function BookingsTab() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-600">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-600">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-600">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="border-green-500 text-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-secondary/30 border-border/30">
        <CardHeader>
          <CardTitle>My Course Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {mockBookings.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-background border border-border/30 hover:border-army-500/30 
                             transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{booking.courseName}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Instructor: {booking.instructor}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {booking.courseType === 'online' ? 'Online Course' : 'Private Session'}
                        </span>
                        {booking.schedule && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.schedule.date} at {booking.schedule.time}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-army-400">
                          Rp {booking.price.toLocaleString('id-ID')}
                        </p>
                        {getPaymentBadge(booking.paymentStatus)}
                      </div>
                      {booking.paymentStatus === 'pending' && (
                        <Button size="sm" className="bg-army-700 hover:bg-army-600">
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Requested Files Tab
function RequestedFilesTab() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-600">Delivered</Badge>;
      case 'processing':
        return <Badge className="bg-blue-600">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-amber-600">Pending</Badge>;
      case 'expired':
        return <Badge className="bg-red-600">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-secondary/30 border-border/30">
        <CardHeader>
          <CardTitle>Requested Files</CardTitle>
        </CardHeader>
        <CardContent>
          {mockRequestedFiles.length === 0 ? (
            <div className="text-center py-10">
              <FileDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No requested files</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockRequestedFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 bg-background border border-border/30 hover:border-army-500/30 
                             transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{file.title}</h3>
                        {getStatusBadge(file.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {file.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Requested: {new Date(file.requestedAt).toLocaleDateString()}</span>
                        {file.deliveredAt && (
                          <span>Delivered: {new Date(file.deliveredAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      {file.messageFromAdmin && (
                        <p className="mt-2 text-sm text-army-400 bg-army-700/10 p-2">
                          {file.messageFromAdmin}
                        </p>
                      )}
                    </div>
                    {file.status === 'delivered' && file.fileUrl && (
                      <Button size="sm" className="bg-army-700 hover:bg-army-600">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Product History Tab
function ProductHistoryTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-secondary/30 border-border/30">
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {mockProductHistory.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No purchases yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockProductHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-background border border-border/30 hover:border-army-500/30 
                             transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{item.productName}</h3>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Order: {item.orderId}</span>
                        <span>Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-2 text-sm">
                        Downloads: {item.downloadCount} / {item.maxDownloads}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-army-400">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                      {item.downloadUrl && !item.isExpired && item.downloadCount < item.maxDownloads && (
                        <Button size="sm" className="bg-army-700 hover:bg-army-600">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Stats Cards
function StatsCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-secondary/30 border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{mockStats.totalBookings}</p>
            </div>
            <BookOpen className="w-8 h-8 text-army-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-secondary/30 border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Purchases</p>
              <p className="text-2xl font-bold">{mockStats.totalPurchases}</p>
            </div>
            <Package className="w-8 h-8 text-army-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-secondary/30 border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Files Available</p>
              <p className="text-2xl font-bold">{mockStats.availableFiles}</p>
            </div>
            <FileDown className="w-8 h-8 text-army-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-secondary/30 border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-army-400">
                Rp {mockStats.totalSpent.toLocaleString('id-ID')}
              </p>
            </div>
            <Star className="w-8 h-8 text-army-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Dashboard Page
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name || 'User'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats */}
          <StatsCards />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-secondary/30 p-1 flex flex-wrap h-auto">
              <TabsTrigger value="profile" className="data-[state=active]:bg-army-700">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-army-700">
                <Calendar className="w-4 h-4 mr-2" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-army-700">
                <FileDown className="w-4 h-4 mr-2" />
                Requested Files
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-army-700">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Purchase History
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="profile" className="mt-0">
                  <ProfileTab />
                </TabsContent>
                <TabsContent value="bookings" className="mt-0">
                  <BookingsTab />
                </TabsContent>
                <TabsContent value="files" className="mt-0">
                  <RequestedFilesTab />
                </TabsContent>
                <TabsContent value="history" className="mt-0">
                  <ProductHistoryTab />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
