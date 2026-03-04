import { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function SettingsTab() {
  const { user, changePassword, resetPassword } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [infoModal, setInfoModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const openInfoModal = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setInfoModal({ isOpen: true, title, message, type });
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
    } catch (error: unknown) {
      const err = error as { message?: string };
      openInfoModal('Error', err.message || 'Failed to update password. Please check your current password.', 'error');
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
    } catch (error: unknown) {
      const err = error as { message?: string };
      openInfoModal('Error', err.message || 'Failed to send reset email.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-secondary/30 border-border/30">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">Password Management</p>
              <p className="text-[11px] text-muted-foreground">
                Update your password directly or request a reset link via email.
              </p>
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
      <Dialog open={infoModal.isOpen} onOpenChange={(open) => setInfoModal((prev) => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-md bg-secondary border-border/50">
          <DialogHeader>
            <DialogTitle>{infoModal.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              {infoModal.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setInfoModal((prev) => ({ ...prev, isOpen: false }))}
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
