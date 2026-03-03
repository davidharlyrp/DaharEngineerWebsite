import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Package, FileDown, Star, Loader2 } from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import { useAuth } from '@/context/AuthContext';
import type { DashboardStats } from '@/types';

export function StatsCards() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.id) return;
            try {
                setIsLoading(true);
                const data = await dashboardService.getDashboardStats(user.id);
                setStats(data);
            } catch (error) {
                console.error('Error loading stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [user?.id]);

    if (isLoading || !stats) {
        return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-secondary/30 border-border/30 animate-pulse">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between h-10">
                                <Loader2 className="w-4 h-4 text-army-400 animate-spin" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-secondary/30 border-border/30">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Bookings</p>
                            <p className="text-2xl font-bold">{stats.totalBookings}</p>
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
                            <p className="text-2xl font-bold">{stats.totalPurchases}</p>
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
                            <p className="text-2xl font-bold">{stats.availableFiles}</p>
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
                                Rp {stats.totalSpent.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <Star className="w-8 h-8 text-army-400" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
