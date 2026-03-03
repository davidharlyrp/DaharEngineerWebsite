import { useState, useEffect } from 'react';
import {
    UserCircle, Mail, Phone, Building2, Camera, Save, Edit2,
    CheckCircle, XCircle, ShieldCheck, Lock, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/dashboard.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types';

const initialProfileState: UserProfile = {
    id: '',
    email: '',
    name: '',
    avatar: '',
    phone_number: '',
    institution: '',
    display_name: '',
    username: '',
    newsletter: false,
    created: '',
    updated: ''
};

export function ProfileTab() {
    const { user, refreshUser, requestVerification, changePassword, resetPassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>(initialProfileState);
    const [saved, setSaved] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

    // Password change state
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const openInfoModal = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setInfoModal({ isOpen: true, title, message, type });
    };

    useEffect(() => {
        if (user) {
            setProfile({
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar ? dashboardService.getAvatarUrl(user.id, user.avatar) : '',
                phone_number: user.phone_number || '',
                institution: user.institution || '',
                display_name: user.display_name || '',
                newsletter: user.newsletter || false,
                total_coins: user.total_coins,
                created: user.created,
                updated: user.updated
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            if (!user) return;
            await dashboardService.updateProfile(user.id, profile);
            await refreshUser();
            setIsEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            setIsUploading(true);
            await dashboardService.uploadAvatar(user.id, file);
            await refreshUser();
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleVerificationRequest = async () => {
        if (!user?.email || isVerifyingEmail) return;

        setIsVerifyingEmail(true);
        try {
            const { success } = await requestVerification(user.email);
            if (success) {
                openInfoModal(
                    'Verification Link Sent!',
                    'A verification link has been sent to your email address. Please click the link to verify your account. Check your spam folder if you do not receive the email.',
                    'success'
                );
            } else {
                openInfoModal(
                    'Verification Failed',
                    'Failed to send verification email. Please try again later.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Verification error:', error);
            openInfoModal(
                'Error',
                'An unexpected error occurred. Please try again later.',
                'error'
            );
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            openInfoModal('Error', 'New passwords do not match', 'error');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            openInfoModal('Error', 'Password must be at least 8 characters long', 'error');
            return;
        }

        setIsChangingPassword(true);
        try {
            await changePassword(passwordData.oldPassword, passwordData.newPassword);
            setIsPasswordModalOpen(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            openInfoModal('Success', 'Your password has been updated successfully', 'success');
        } catch (error: any) {
            console.error('Password change error:', error);
            openInfoModal('Error', error.message || 'Failed to update password. Please check your current password.', 'error');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleEmailResetRequest = async () => {
        if (!user?.email) return;
        try {
            await resetPassword(user.email);
            openInfoModal(
                'Reset Email Sent',
                'A password reset link has been sent to your email. You will be logged out once you reset it.',
                'success'
            );
        } catch (error: any) {
            console.error('Email reset request error:', error);
            openInfoModal('Error', error.message || 'Failed to send reset email.', 'error');
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        const words = name.trim().split(/\s+/);
        return words
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join('');
    };

    return (
        <div className="space-y-6">
            {saved && (
                <Alert className="bg-army-700/20 border-army-500/30">
                    <CheckCircle className="h-4 w-4 text-army-400" />
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
                        <div className="relative group">
                            <Avatar className="w-24 h-24 border-2 border-border/50">
                                <AvatarImage src={profile.avatar} />
                                <AvatarFallback className="bg-army-700 text-2xl">
                                    {profile.name ? getInitials(profile.name) : <UserCircle className="w-12 h-12" />}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className={cn(
                                    "absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]",
                                    isUploading && "opacity-100"
                                )}
                            >
                                {isUploading ? (
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <Camera className="w-4 h-4 mb-1" />
                                        <span>Change</span>
                                    </>
                                )}
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold">{profile.name || 'User'}</h3>
                                {profile.total_coins !== undefined && (
                                    <Badge variant="secondary" className="bg-army-700/50 text-army-100 flex items-center gap-1">
                                        {profile.total_coins} Coins
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <UserCircle className="w-4 h-4 text-muted-foreground" />
                                Full Name
                            </Label>
                            <Input
                                value={profile.name}
                                disabled={!isEditing}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="bg-background"
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                Email
                            </Label>
                            <div className="relative">
                                <Input
                                    value={profile.email}
                                    disabled
                                    className="bg-background opacity-70 pr-24"
                                    placeholder="Email"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {user?.verified ? (
                                        <Badge variant="secondary" className="bg-army-500/10 text-army-500 border-army-500/20 py-0.5 px-2 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Verified
                                        </Badge>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20 py-0.5 px-2 flex items-center gap-1">
                                                <XCircle className="w-3 h-3" />
                                                Unverified
                                            </Badge>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="h-auto p-0 text-xs text-army-400 hover:text-army-300"
                                                onClick={handleVerificationRequest}
                                                disabled={isVerifyingEmail}
                                            >
                                                {isVerifyingEmail ? 'Sending...' : 'Verify Now'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <UserCircle className="w-4 h-4 text-muted-foreground" />
                                Display Name
                            </Label>
                            <Input
                                value={profile.display_name}
                                disabled={!isEditing}
                                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                                className="bg-background"
                                placeholder="Display Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                Phone Number
                            </Label>
                            <Input
                                value={profile.phone_number}
                                disabled={!isEditing}
                                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                className="bg-background"
                                placeholder="+62..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                Institution
                            </Label>
                            <Input
                                value={profile.institution}
                                disabled={!isEditing}
                                onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                                className="bg-background"
                                placeholder="Your school or company"
                            />
                        </div>
                        <div className="space-y-2 flex flex-col justify-end pb-1">
                            <div className="flex items-center justify-between p-3 border border-border/30 rounded-md bg-background/50">
                                <div className="space-y-0.5">
                                    <Label className="text-sm">Newsletter</Label>
                                    <p className="text-[10px] text-muted-foreground">Receive updates and courses</p>
                                </div>
                                <Switch
                                    checked={profile.newsletter}
                                    onCheckedChange={(checked) => setProfile({ ...profile, newsletter: checked })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border/30">
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="font-medium text-sm">Password Management</p>
                            <p className="text-[11px] text-muted-foreground">Update your password directly or request a reset link via email.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="h-8 text-xs px-3"
                            >
                                <ShieldCheck className="w-3.5 h-3.5 mr-2 text-army-400" />
                                Direct Change
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEmailResetRequest}
                                className="h-8 text-xs px-3"
                            >
                                <Mail className="w-3.5 h-3.5 mr-2 text-army-400" />
                                Reset via Email
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Modal */}
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="sm:max-w-md bg-secondary border-border/50">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and a new password.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="currentPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    required
                                    className="pl-9 pr-9 bg-background border-border/50"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                    className="pl-9 bg-background border-border/50"
                                    placeholder="At least 8 characters"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                    className="pl-9 bg-background border-border/50"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="border-border/50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-army-700 hover:bg-army-600"
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? 'Updating...' : 'Update Password'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Info Modal */}
            <Dialog open={infoModal.isOpen} onOpenChange={(open) => setInfoModal(prev => ({ ...prev, isOpen: open }))}>
                <DialogContent className="sm:max-w-md bg-secondary border-border/50">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {infoModal.title}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground pt-2">
                            {infoModal.message}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setInfoModal(prev => ({ ...prev, isOpen: false }))}
                            className="border-border/50 hover:bg-background"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
