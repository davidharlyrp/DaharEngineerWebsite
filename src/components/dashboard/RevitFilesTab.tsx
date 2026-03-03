import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Loader2,
    Plus,
    FileText,
    Pencil,
    Trash2,
    Calendar,
    Download,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { revitService } from '@/services/pb/revit';
import type { RevitFile } from '@/types/revit';
import { toast } from 'sonner';
import { UploadModal } from '../revit/UploadModal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function RevitFilesTab() {
    const { user } = useAuth();
    const [files, setFiles] = useState<RevitFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [fileToDelete, setFileToDelete] = useState<RevitFile | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const PER_PAGE = 15;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFile, setEditingFile] = useState<RevitFile | null>(null);

    const fetchFiles = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const data = await revitService.getUserRevitFiles(user.id, page, PER_PAGE);
            setFiles(data.items);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalItems);
        } catch (error) {
            console.error('Error fetching revit files:', error);
            toast.error('Failed to load your Revit files');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [user?.id, page]);

    const handleEdit = (file: RevitFile) => {
        setEditingFile(file);
        setIsModalOpen(true);
    };

    const handleDelete = (file: RevitFile) => {
        setFileToDelete(file);
    };

    const confirmDelete = async () => {
        if (!fileToDelete) return;
        try {
            setIsDeleting(fileToDelete.id);
            await revitService.deleteRevitFile(fileToDelete.id);
            toast.success('File deleted');
            if (files.length === 1 && page > 1) {
                setPage(prev => prev - 1);
            } else {
                fetchFiles();
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Failed to delete file');
        } finally {
            setIsDeleting(null);
            setFileToDelete(null);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            <Card className="bg-secondary/30 border-border/30 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border/30">
                    <div>
                        <CardTitle className="text-base font-bold uppercase tracking-widest text-army-400">
                            My Revit Files
                        </CardTitle>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            Manage your uploaded BIM families and project files
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingFile(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-army-700 hover:bg-army-600 h-8 rounded-sm text-[10px] font-bold px-3 uppercase tracking-widest"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Upload File
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3">
                            <Loader2 className="w-8 h-8 text-army-500 animate-spin" />
                            <p className="text-[10px] text-muted-foreground font-medium animate-pulse">Retrieving your files...</p>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4 border border-border/30">
                                <FileText className="w-7 h-7 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-sm font-bold mb-1">No files uploaded yet</h3>
                            <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
                                Start sharing your Revit families and components with the community.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-secondary/50 border-b border-border/30">
                                    <tr>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">File Info</th>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Category</th>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Stats</th>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/10">
                                    {files.map((file) => (
                                        <tr key={file.id} className="hover:bg-army-500/5 transition-colors group">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-sm overflow-hidden bg-secondary animate-in fade-in duration-500 border border-border/20">
                                                        {file.preview_image ? (
                                                            <img
                                                                src={revitService.getPreviewUrl(file)}
                                                                alt={file.display_name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FileText className="w-4 h-4 text-muted-foreground/30" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs font-bold leading-none mb-1 truncate max-w-[150px] md:max-w-none">
                                                            {file.display_name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                                                            <span className="flex items-center gap-1 font-medium bg-secondary px-1 rounded-sm text-army-400">
                                                                v{file.revit_version}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{formatSize(file.file_size)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider h-5 bg-background border-border/50 text-muted-foreground">
                                                    {file.category.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4 hidden lg:table-cell">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                        <Download className="w-3 h-3 text-army-500" />
                                                        <span className="font-bold text-foreground">{file.download_count}</span>
                                                        <span>downloads</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(file.created).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(file)}
                                                        className="h-7 w-7 rounded-sm hover:bg-army-500/10 hover:text-army-400"
                                                        title="Edit File"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(file)}
                                                        disabled={isDeleting === file.id}
                                                        className="h-7 w-7 rounded-sm hover:bg-red-500/10 hover:text-red-500"
                                                        title="Delete File"
                                                    >
                                                        {isDeleting === file.id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>

                {/* Compact Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-border/30 bg-secondary/10 flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground font-medium">
                            Showing <span className="text-foreground font-bold">{files.length}</span> of <span className="text-foreground font-bold">{totalItems}</span> files
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="h-7 w-7 rounded-sm border-grow/20"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </Button>
                            <div className="flex items-center px-3 h-7 bg-background rounded-sm border border-border/20 text-[10px] font-bold">
                                {page} / {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="h-7 w-7 rounded-sm border-grow/20"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Modals */}
            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchFiles}
                editFile={editingFile}
            />

            <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
                <AlertDialogContent className="max-w-[320px] rounded-sm p-4 lg:p-6 gap-6 border-border/50">
                    <AlertDialogHeader className="gap-2">
                        <AlertDialogTitle className="text-base font-bold uppercase tracking-wider">Delete Revit File?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
                            "{fileToDelete?.display_name}" will be permanently removed. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-2">
                        <AlertDialogCancel className="flex-1 h-9 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-secondary/50 border-0 mt-0">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="flex-1 h-9 rounded-sm bg-red-600 hover:bg-red-700 text-[10px] font-bold uppercase tracking-widest text-white border-0"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
