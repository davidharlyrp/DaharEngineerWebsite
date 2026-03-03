import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { resourceService } from '@/services/pb/resources';
import type { Resource } from '@/types/resources';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, FileUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ResourceUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    editResource?: Resource | null;
}

export function ResourceUploadModal({ isOpen, onClose, onSuccess, editResource }: ResourceUploadModalProps) {
    const { user, isAuthenticated } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        year_released: new Date().getFullYear().toString(),
        category: '',
        subcategory: '',
    });

    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    // Initial setup for edit mode
    useEffect(() => {
        if (editResource) {
            setFormData({
                title: editResource.title || '',
                description: editResource.description || '',
                author: editResource.author || '',
                year_released: (editResource.year_released || new Date().getFullYear()).toString(),
                category: editResource.category || '',
                subcategory: editResource.subcategory || '',
            });
            setFile(null);
        } else if (isOpen) {
            setFormData({
                title: '',
                description: '',
                author: '',
                year_released: new Date().getFullYear().toString(),
                category: '',
                subcategory: '',
            });
            setFile(null);
        }
    }, [editResource, isOpen]);

    const isVerified = user?.verified === true;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragActive(true);
        }
    };

    const handleDragOut = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !isVerified || !user) return;

        if (!editResource && !file) {
            toast.error('Please select a file to upload');
            return;
        }

        if (!formData.title || !formData.category || !formData.author) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('author', formData.author);
            data.append('year_released', formData.year_released);
            data.append('category', formData.category);
            data.append('subcategory', formData.subcategory);

            if (file) {
                data.append('file', file);
                data.append('file_name', file.name);
                data.append('file_size', file.size.toString());
                data.append('file_type', file.type);
            }

            if (!editResource) {
                data.append('uploaded_by', user.id);
                data.append('uploaded_by_name', user.name || user.email);
                data.append('download_count', '0');
                data.append('is_active', 'true');
                await resourceService.uploadResource(data);
                toast.success('Resource uploaded successfully!');
            } else {
                await resourceService.updateResource(editResource.id, data);
                toast.success('Resource updated successfully!');
            }

            onSuccess?.();
            onClose();

            // Reset form
            setFormData({
                title: '',
                description: '',
                author: '',
                year_released: new Date().getFullYear().toString(),
                category: '',
                subcategory: '',
            });
            setFile(null);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload resource. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-army-500" />
                            Authentication Required
                        </DialogTitle>
                        <DialogDescription>
                            You need to be logged in to upload resources to the resource base.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start mt-4">
                        <Button asChild className="bg-army-700 hover:bg-army-600 w-full rounded-sm">
                            <a href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}>
                                Login to Continue
                            </a>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    if (!isVerified) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-army-500" />
                            Account Verification Required
                        </DialogTitle>
                        <DialogDescription>
                            Your account must be verified before you can upload resources. Please verify your account from your dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="p-4 bg-secondary/20 border border-border/10 rounded-sm">
                            <ul className="text-xs space-y-2 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-army-500" />
                                    Verification ensures community safety
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-army-500" />
                                    Verified users can share resources
                                </li>
                            </ul>
                        </div>
                        <Button asChild className="bg-army-700 hover:bg-army-600 w-full rounded-sm">
                            <a href="/dashboard">
                                Go to Dashboard
                            </a>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-background border-border/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <FileUp className="w-6 h-6 text-army-400" />
                        {editResource ? 'Edit Resource' : 'Upload Resource'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground/60">
                        Share e-books, modules, or regulations with the community.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="title" className="text-[10px] uppercase tracking-wider opacity-70">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Advanced Structural Analysis"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="bg-secondary/10 border-border/20 h-9 text-xs rounded-sm focus-visible:ring-army-500/50"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="description" className="text-[10px] uppercase tracking-wider opacity-70">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Briefly describe the resource..."
                                value={formData.description}
                                onChange={handleInputChange}
                                className="bg-secondary/10 border-border/20 min-h-[80px] text-xs rounded-sm focus-visible:ring-army-500/50 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="author" className="text-[10px] uppercase tracking-wider opacity-70">Author</Label>
                                <Input
                                    id="author"
                                    name="author"
                                    placeholder="Author name"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-secondary/10 border-border/20 h-9 text-xs rounded-sm focus-visible:ring-army-500/50"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="year_released" className="text-[10px] uppercase tracking-wider opacity-70">Year Released</Label>
                                <Input
                                    id="year_released"
                                    name="year_released"
                                    placeholder="2024"
                                    value={formData.year_released}
                                    onChange={handleInputChange}
                                    className="bg-secondary/10 border-border/20 h-9 text-xs rounded-sm focus-visible:ring-army-500/50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="category" className="text-[10px] uppercase tracking-wider opacity-70">Category</Label>
                                <Select onValueChange={handleSelectChange} value={formData.category} required>
                                    <SelectTrigger className="bg-secondary/10 border-border/20 h-9 text-xs rounded-sm focus:ring-army-500/50">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border-border/20">
                                        <SelectItem value="ebooks" className="text-xs">E-Book</SelectItem>
                                        <SelectItem value="moduls" className="text-xs">Module</SelectItem>
                                        <SelectItem value="regulations" className="text-xs">Regulation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="subcategory" className="text-[10px] uppercase tracking-wider opacity-70">Sub-Category</Label>
                                <Input
                                    id="subcategory"
                                    name="subcategory"
                                    placeholder="e.g. Structure"
                                    value={formData.subcategory}
                                    onChange={handleInputChange}
                                    className="bg-secondary/10 border-border/20 h-9 text-xs rounded-sm focus-visible:ring-army-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider opacity-70">File (PDF format only)</Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragEnter={handleDragIn}
                                onDragLeave={handleDragOut}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed border-border/20 rounded-sm p-6 text-center cursor-pointer hover:border-army-500/30 transition-all bg-secondary/5 
                                ${(file || dragActive) ? 'border-army-500/30 bg-army-500/5' : ''}`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {file ? (
                                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                                        <CheckCircle2 className="w-6 h-6 text-army-500" />
                                        <span className="text-[11px] font-medium text-army-400 truncate max-w-full px-4">{file.name}</span>
                                        <span className="text-[9px] text-muted-foreground opacity-50">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1 pointer-events-none">
                                        <Upload className={`w-6 h-6 text-muted-foreground transition-all ${dragActive ? 'opacity-100 scale-110 text-army-500' : 'opacity-20'}`} />
                                        <span className="text-[10px] text-muted-foreground opacity-50">
                                            {dragActive ? 'Drop file here' : (editResource ? 'Click to change file' : 'Click or drag file here')}
                                        </span>
                                        {editResource && !file && editResource.file_name && (
                                            <span className="text-[9px] text-army-500 mt-1">Current: {editResource.file_name}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-border/5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="text-muted-foreground hover:bg-secondary/20 h-9 px-4 rounded-sm text-[11px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isVerified}
                            className="bg-army-700 hover:bg-army-600 text-white h-9 px-6 rounded-sm text-[11px] font-bold uppercase tracking-widest shadow-md"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                    {editResource ? 'Saving...' : 'Uploading...'}
                                </>
                            ) : (
                                editResource ? 'Save Changes' : 'Publish Resource'
                            )}
                        </Button>
                    </DialogFooter>
                    {!isVerified && (
                        <p className="text-[9px] text-center text-red-500/70 mt-2">
                            * Your account must be verified to upload resources.
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
