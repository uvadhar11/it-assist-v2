"use client";

import { Phone, Ticket, BarChart2, BookOpen, Settings, Users, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * SidebarItemProps interface defines the properties for a sidebar item
 * @param icon - React node representing the icon to display
 * @param label - Text label for the sidebar item
 * @param active - Boolean indicating if the item is currently active
 * @param isSubItem - Boolean indicating if the item is a sub-item (indented)
 */
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isSubItem?: boolean;
}

/**
 * SidebarItem component renders a single navigation item in the sidebar
 * It handles styling for active state and sub-items with proper indentation
 */
function SidebarItem({ icon, label, active = false, isSubItem = false }: SidebarItemProps) {
  return (
    <div 
      className={cn(
        // Base styles for all sidebar items
        "flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer",
        // Conditional styling based on active state
        active ? "bg-secondary" : "hover:bg-secondary/50",
        // Additional padding for sub-items to create indentation
        isSubItem ? "pl-8" : ""
      )}
    >
      {/* Icon is positioned to the left of the label */}
      {icon}
      {/* Text label with consistent styling */}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

/**
 * Sidebar component renders the main navigation sidebar of the application
 * It contains the logo, main navigation items, section headers, and profile link
 */
export function Sidebar() {
  return (
    <div className="w-64 border-r bg-background flex flex-col h-full">
      {/* Logo section at the top of the sidebar */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">LOGOOOOO</h2>
      </div>
      
      {/* Main navigation items section with flex-1 to push profile to bottom */}
      <div className="flex-1 py-4 space-y-1">
        {/* Primary navigation items */}
        <SidebarItem icon={<Phone size={18} />} label="Active Calls" />
        <SidebarItem icon={<Ticket size={18} />} label="Tickets" active />
        <SidebarItem icon={<BarChart2 size={18} />} label="Data Reports" />
        <SidebarItem icon={<BookOpen size={18} />} label="Knowledge Base" />
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
        <SidebarItem icon={<Users size={18} />} label="Quick Contacts" />
        
        {/* Section header for Conversations */}
        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-semibold text-muted-foreground">Conversations</p>
        </div>
        
        {/* Conversation-related navigation items */}
        <SidebarItem icon={<MessageSquare size={18} />} label="Customer Line" />
      </div>
      
      {/* Profile section at the bottom of the sidebar */}
      <div className="border-t">
        {/* Using the same padding and styling as other sidebar items for consistency */}
        <SidebarItem icon={<User size={18} />} label="Profile" />
      </div>
    </div>
  );
}