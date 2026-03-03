import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { revitService } from '@/services/pb/revit';
import { resourceService } from '@/services/pb/resources';
import type { RevitFile } from '@/types/revit';
import { RevitCategory } from '@/types/revit';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    type?: 'revit' | 'resource';
    editFile?: RevitFile | Resource | null;
}

export function UploadModal({ isOpen, onClose, onSuccess, type = 'revit', editFile }: UploadModalProps) {
    const { user, isAuthenticated } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        display_name: '', // Maps to 'title' for resources
        category: '',
        revit_version: '', // Maps to 'year_released' for resources (as number) or can be optional
        description: '', // New field for resources
        author: '', // New field for resources
    });

    const [files, setFiles] = useState<{
        revitFile: File | null;
        previewImage: File | null;
    }>({
        revitFile: null,
        previewImage: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Use useEffect to handle editFile changes when modal opens
    useEffect(() => {
        if (editFile) {
            if (type === 'revit') {
                const f = editFile as RevitFile;
                setFormData({
                    display_name: f.display_name || '',
                    category: f.category || '',
                    revit_version: f.revit_version || '',
                    description: '',
                    author: '',
                });
                setPreviewUrl(f.preview_image ? revitService.getPreviewUrl(f) : '');
            } else {
                const r = editFile as Resource;
                setFormData({
                    display_name: r.title || '',
                    category: r.category || '',
                    revit_version: r.year_released?.toString() || '',
                    description: r.description || '',
                    author: r.author || '',
                });
                setPreviewUrl(''); // Resources don't have separate preview_image in schema? Checked resources.json, it doesn't.
            }
            setFiles({ revitFile: null, previewImage: null });
        } else if (isOpen) {
            setFormData({ display_name: '', category: '', revit_version: '', description: '', author: '' });
            setFiles({ revitFile: null, previewImage: null });
            setPreviewUrl('');
        }
    }, [editFile, isOpen, type]);

    const [dragActive, setDragActive] = useState<{
        revitFile: boolean;
        previewImage: boolean;
    }>({
        revitFile: false,
        previewImage: false,
    });

    const isVerified = user?.verified === true;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'revitFile' | 'previewImage') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFiles(prev => ({ ...prev, [fileType]: file }));
            if (fileType === 'previewImage') {
                setPreviewUrl(URL.createObjectURL(file));
            }
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e: React.DragEvent, fileType: 'revitFile' | 'previewImage') => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragActive(prev => ({ ...prev, [fileType]: true }));
        }
    };

    const handleDragOut = (e: React.DragEvent, fileType: 'revitFile' | 'previewImage') => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(prev => ({ ...prev, [fileType]: false }));
    };

    const handleDrop = (e: React.DragEvent, fileType: 'revitFile' | 'previewImage') => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(prev => ({ ...prev, [fileType]: false }));

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFiles(prev => ({ ...prev, [fileType]: file }));
            if (fileType === 'previewImage') {
                setPreviewUrl(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !isVerified || !user) return;

        if (!editFile && !files.revitFile) {
            toast.error(`Please select a ${type === 'revit' ? 'Revit' : 'Resource'} file to upload`);
            return;
        }

        if (type === 'revit' && !editFile && !files.previewImage) {
            toast.error('Please select a preview image to upload');
            return;
        }

        if (!formData.display_name || !formData.category || (type === 'revit' && !formData.revit_version)) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            const data = new FormData();

            if (type === 'revit') {
                data.append('display_name', formData.display_name);
                data.append('category', formData.category);
                data.append('revit_version', formData.revit_version);
                if (files.previewImage) data.append('preview_image', files.previewImage);
            } else {
                data.append('title', formData.display_name);
                data.append('category', formData.category);
                data.append('description', formData.description);
                data.append('author', formData.author);
                if (formData.revit_version) data.append('year_released', formData.revit_version);
                data.append('is_active', 'true');
            }

            if (files.revitFile) {
                data.append('file', files.revitFile);
                data.append('file_name', files.revitFile.name);
                data.append('file_size', files.revitFile.size.toString());
                if (type === 'resource') data.append('file_type', files.revitFile.type);
            }

            if (!editFile) {
                data.append('uploaded_by', user.id);
                data.append('uploaded_by_name', user.name || user.email);
                data.append('download_count', '0');
                if (type === 'revit') {
                    await revitService.uploadRevitFile(data);
                } else {
                    await resourceService.uploadResource(data);
                }
                toast.success(`${type === 'revit' ? 'Revit' : 'Resource'} file uploaded successfully!`);
            } else {
                if (type === 'revit') {
                    await revitService.updateRevitFile(editFile.id, data);
                } else {
                    await resourceService.updateResource(editFile.id, data);
                }
                toast.success(`${type === 'revit' ? 'Revit' : 'Resource'} file updated successfully!`);
            }

            onSuccess?.();
            onClose();

            // Reset form
            setFormData({ display_name: '', category: '', revit_version: '', description: '', author: '' });
            setFiles({ revitFile: null, previewImage: null });
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file. Please try again.');
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
                            You need to be logged in to upload files to the community library.
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
                            Your account must be verified before you can upload files. Please verify your account from your dashboard.
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
                        {editFile ? 'Edit' : 'Upload'} {type === 'revit' ? 'Revit File' : 'Resource'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground/60">
                        {type === 'revit'
                            ? 'Share your Revit families or templates with the community.'
                            : 'Share your guides, ebooks, or references with the community.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="display_name" className="text-[11px] uppercase tracking-widest opacity-80">
                                {type === 'revit' ? 'Display Name' : 'Title'}
                            </Label>
                            <Input
                                id="display_name"
                                name="display_name"
                                placeholder={type === 'revit' ? 'e.g. Modern Sofa Family' : 'e.g. Architecture Guide 2024'}
                                value={formData.display_name}
                                onChange={handleInputChange}
                                required
                                className="bg-secondary/10 border-border/20 h-10 text-xs rounded-sm focus-visible:ring-army-500/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-[11px] uppercase tracking-widest opacity-80">Category</Label>
                                <Select onValueChange={handleSelectChange} value={formData.category} required>
                                    <SelectTrigger className="bg-secondary/10 border-border/20 h-10 text-xs rounded-sm focus:ring-army-500/50">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border-border/20">
                                        {type === 'revit' ? (
                                            RevitCategory.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id} className="text-xs">
                                                    {cat.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            // Mapping resource categories if needed, or use existing ResourceCategory type
                                            ['ebooks', 'modul', 'regulations', 'guides', 'references'].map((cat) => (
                                                <SelectItem key={cat} value={cat} className="text-xs capitalize">
                                                    {cat}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="revit_version" className="text-[11px] uppercase tracking-widest opacity-80">
                                    {type === 'revit' ? 'Revit Version' : 'Year released'}
                                </Label>
                                <Input
                                    id="revit_version"
                                    name="revit_version"
                                    placeholder={type === 'revit' ? 'e.g. 2024' : 'e.g. 2023'}
                                    value={formData.revit_version}
                                    onChange={handleInputChange}
                                    required={type === 'revit'}
                                    className="bg-secondary/10 border-border/20 h-10 text-xs rounded-sm focus-visible:ring-army-500/50"
                                />
                            </div>
                        </div>

                        {type === 'resource' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="author" className="text-[11px] uppercase tracking-widest opacity-80">Author</Label>
                                    <Input
                                        id="author"
                                        name="author"
                                        placeholder="Author name"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className="bg-secondary/10 border-border/20 h-10 text-xs rounded-sm focus-visible:ring-army-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-[11px] uppercase tracking-widest opacity-80">Description</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        placeholder="Brief description of the resource"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="bg-secondary/10 border-border/20 h-10 text-xs rounded-sm focus-visible:ring-army-500/50"
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-80">Revit File (.rfa, .rvt)</Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragEnter={(e) => handleDragIn(e, 'revitFile')}
                                onDragLeave={(e) => handleDragOut(e, 'revitFile')}
                                onDragOver={handleDrag}
                                onDrop={(e) => handleDrop(e, 'revitFile')}
                                className={`border-2 border-dashed border-border/20 rounded-sm p-8 text-center cursor-pointer hover:border-army-500/30 transition-all bg-secondary/5 
                           ${(files.revitFile || dragActive.revitFile) ? 'border-army-500/30 bg-army-500/5' : ''}`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => handleFileChange(e, 'revitFile')}
                                    accept=".rfa,.rvt"
                                    className="hidden"
                                />
                                {files.revitFile ? (
                                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                                        <CheckCircle2 className="w-8 h-8 text-army-500" />
                                        <span className="text-xs font-medium text-army-400 truncate max-w-full px-4">{files.revitFile.name}</span>
                                        <span className="text-[10px] text-muted-foreground opacity-50">{(files.revitFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                                        <Upload className={`w-8 h-8 text-muted-foreground transition-all ${dragActive.revitFile ? 'opacity-100 scale-110 text-army-500' : 'opacity-20'}`} />
                                        <span className="text-[11px] text-muted-foreground opacity-50">
                                            {dragActive.revitFile ? 'Drop file here' : (editFile ? `Click to change ${type} file` : `Click or drag ${type} file here`)}
                                        </span>
                                        {editFile && !files.revitFile && (editFile as any).file_name && (
                                            <span className="text-[10px] text-army-500 mt-1">
                                                Current: {(editFile as any).file_name}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {type === 'revit' && (
                            <div className="space-y-2">
                                <Label className="text-[11px] uppercase tracking-widest opacity-80">Preview Image</Label>
                                <div
                                    onClick={() => imageInputRef.current?.click()}
                                    onDragEnter={(e) => handleDragIn(e, 'previewImage')}
                                    onDragLeave={(e) => handleDragOut(e, 'previewImage')}
                                    onDragOver={handleDrag}
                                    onDrop={(e) => handleDrop(e, 'previewImage')}
                                    className={`border border-dashed border-border/20 rounded-sm p-4 text-center cursor-pointer hover:border-army-500/30 transition-all bg-secondary/5 
                               ${(files.previewImage || dragActive.previewImage) ? 'border-army-500/30 bg-army-500/5' : ''}`}
                                >
                                    <input
                                        type="file"
                                        ref={imageInputRef}
                                        onChange={(e) => handleFileChange(e, 'previewImage')}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {previewUrl ? (
                                        <div className="relative aspect-video rounded-sm overflow-hidden flex items-center justify-center">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                                Click to Change Image
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 pointer-events-none">
                                            <ImageIcon className={`w-4 h-4 text-muted-foreground transition-all ${dragActive.previewImage ? 'opacity-100 scale-110 text-army-500' : 'opacity-20'}`} />
                                            <span className="text-[11px] text-muted-foreground opacity-50">
                                                {dragActive.previewImage ? 'Drop image here' : 'Click or drag preview image here'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-4 border-t border-border/5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="text-muted-foreground hover:bg-secondary/20 h-10 px-6 rounded-sm text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-army-700 hover:bg-army-600 text-white h-10 px-8 rounded-sm text-xs font-bold uppercase tracking-widest shadow-md"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {editFile ? 'Saving...' : 'Uploading...'}
                                </>
                            ) : (
                                editFile ? 'Save Changes' : 'Upload'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
