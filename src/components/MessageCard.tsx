"use client"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, Calendar } from "lucide-react";
import axios from "axios";
import { ApiResponse } from '@/types/ApiResponse';

export interface MessageType {
    _id: string;
    content: string;
    createdAt: Date | string;
}

interface MessageCardProps {
    message: MessageType;
    onMessageDelete: (messageId: string) => void;
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    
    const handleDelete = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            if (response.data.success) {
                onMessageDelete(message._id);
            }
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const formattedDate = new Date(message.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Card className="relative group overflow-hidden border border-zinc-200/60 bg-white/70 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-indigo-500/20 dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:hover:ring-indigo-500/30">
            {/* Corner Decorative Gradient Glow */}
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-linear-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1 pr-6">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed wrap-break-word">
                        {message.content}
                    </p>
                </div>

                {/* Delete Button with Dialog Trigger */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon-xs" 
                            className="h-7 w-7 rounded-lg text-zinc-400 hover:bg-rose-50/50 hover:text-rose-600 dark:text-zinc-500 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-2xl shadow-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-zinc-950 dark:text-white">
                                Delete Message?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400">
                                This action cannot be undone. This will permanently delete this anonymous message from your inbox.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 rounded-xl">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDelete}
                                className="bg-rose-600 text-white hover:bg-rose-500 active:scale-95 transition-all rounded-xl shadow-md shadow-rose-600/10"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            
            <CardContent>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDate}</span>
                </div>
            </CardContent>
        </Card>
    );
}
