import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Modular Components
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ProfileTab } from '@/components/dashboard/ProfileTab';
import { BookingsTab } from '@/components/dashboard/BookingsTab';
import { RequestedFilesTab } from '@/components/dashboard/RequestedFilesTab';
import { ProductHistoryTab } from '@/components/dashboard/ProductHistoryTab';
import { RevitFilesTab } from '@/components/dashboard/RevitFilesTab';
import { ResourcesTab } from '@/components/dashboard/ResourcesTab';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

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
              <Button variant="outline" onClick={handleLogout}>
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
                Profile
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-army-700">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-army-700">
                Requested Files
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-army-700">
                Product History
              </TabsTrigger>
              <TabsTrigger value="revit" className="data-[state=active]:bg-army-700">
                My Revit Files
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-army-700">
                My Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0 outline-none">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="bookings" className="mt-0 outline-none">
              <BookingsTab />
            </TabsContent>

            <TabsContent value="files" className="mt-0 outline-none">
              <RequestedFilesTab />
            </TabsContent>

            <TabsContent value="history" className="mt-0 outline-none">
              <ProductHistoryTab />
            </TabsContent>

            <TabsContent value="revit" className="mt-0 outline-none">
              <RevitFilesTab />
            </TabsContent>

            <TabsContent value="resources" className="mt-0 outline-none">
              <ResourcesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
