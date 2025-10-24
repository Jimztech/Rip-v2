import { LoaderCircle } from 'lucide-react';
export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
}