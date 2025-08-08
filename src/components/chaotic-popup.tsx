'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, WifiOff, ServerCrash } from "lucide-react";
import React from "react";

const popups = [
    {
        title: "Connection Lost?",
        description: "Your soulmate is buffering...",
        icon: <WifiOff className="h-12 w-12 text-destructive" />,
    },
    {
        title: "Emotional Baggage Warning",
        description: "Your emotional baggage exceeds our server limit. Please consider upgrading to a premium heartbreak.",
        icon: <ServerCrash className="h-12 w-12 text-destructive" />,

    },
    {
        title: "Are you lost?",
        description: "Did you mean to apply to therapy instead? This is a dating site. Allegedly.",
        icon: <AlertTriangle className="h-12 w-12 text-destructive" />,
    }
];

interface ChaoticPopupProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChaoticPopup({ isOpen, onOpenChange }: ChaoticPopupProps) {
    const [popupContent, setPopupContent] = React.useState(popups[0]);

    React.useEffect(() => {
        if(isOpen) {
            setPopupContent(popups[Math.floor(Math.random() * popups.length)]);
        }
    }, [isOpen]);

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex justify-center mb-4">
                        {popupContent.icon}
                    </div>
                    <AlertDialogTitle className="font-headline text-center text-2xl">{popupContent.title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-md text-foreground/80 pt-2">
                       {popupContent.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction className="w-full font-headline">Continue My Descent</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
