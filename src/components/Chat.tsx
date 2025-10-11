import { ArrowUpIcon } from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ChatSidebar";


export default function Chat({ children }: {children: React.ReactNode}) {
    return(
        <SidebarProvider>
            <div className="flex h-screen w-full">
                {/* Sidebar - fixed on the left */}
                <AppSidebar />
            
                {/* Main content area */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Header with trigger */}
                    <div className="p-4 border-b">
                        <SidebarTrigger />
                    </div>
                
                    {/* Chat messages area - scrollable */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {children}
                        {/* Your chat messages will go here */}
                    </div>
                    
                    {/* Search Overlay */}
                    <div>{/* Search overlay content */}</div>
                
                    {/* Input area - fixed at bottom */}
                    <div className="border-t bg-white px-4 py-4">
                        <div className="max-w-3xl mx-auto">
                            <InputGroup>
                                <InputGroupTextarea placeholder="Ask about any Cryptocurrency..." />
                                <InputGroupAddon align="block-end">
                                    <InputGroupButton
                                        variant="outline"
                                        className="rounded-full"
                                        size="icon-xs"
                                    >
                                        <IconPlus />
                                    </InputGroupButton>

                                    <InputGroupText className="ml-auto">52% used</InputGroupText>
                                    <Separator orientation="vertical" className="!h-4" />
                                    <InputGroupButton
                                        variant="default"
                                        className="rounded-full"
                                        size="icon-xs"
                                        disabled
                                    >
                                        <ArrowUpIcon />
                                        <span className="sr-only">Send</span>
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}