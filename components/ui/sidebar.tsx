"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Menu } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// -----------------------------------------------------------------------------
// Sidebar
// -----------------------------------------------------------------------------

interface SidebarContextProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.ComponentPropsWithoutRef<"aside"> {}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "flex h-full flex-col border-r bg-background",
          className
        )}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

// -----------------------------------------------------------------------------
// Sidebar Trigger
// -----------------------------------------------------------------------------

interface SidebarTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SheetTrigger> {}

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof SheetTrigger>,
  SidebarTriggerProps
>(({ className, children, ...props }, ref) => {
  const { setIsOpen } = useSidebar()
  return (
    <SheetTrigger asChild onClick={() => setIsOpen(true)} ref={ref} {...props}>
      {children || (
        <Button variant="ghost" size="icon" className={className}>
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </SheetTrigger>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

// -----------------------------------------------------------------------------
// Sidebar Content
// -----------------------------------------------------------------------------

interface SidebarContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetContent> {}

const SidebarContent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  SidebarContentProps
>(({ className, children, side = "left", ...props }, ref) => {
  const { setIsOpen } = useSidebar()
  return (
    <SheetContent
      ref={ref}
      side={side}
      className={cn("w-64 p-0", className)}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
      onPointerDownOutside={() => setIsOpen(false)}
      {...props}
    >
      {children}
    </SheetContent>
  )
})
SidebarContent.displayName = "SidebarContent"

// -----------------------------------------------------------------------------
// Sidebar Rail
// -----------------------------------------------------------------------------

interface SidebarRailProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarRail = React.forwardRef<HTMLDivElement, SidebarRailProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center gap-4 p-2", className)}
      {...props}
    />
  )
)
SidebarRail.displayName = "SidebarRail"

// -----------------------------------------------------------------------------
// Sidebar Inset
// -----------------------------------------------------------------------------

interface SidebarInsetProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarInset = React.forwardRef<HTMLDivElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4", className)} {...props} />
  )
)
SidebarInset.displayName = "SidebarInset"

// -----------------------------------------------------------------------------
// Sidebar Header
// -----------------------------------------------------------------------------

interface SidebarHeaderProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-4", className)}
      {...props}
    />
  )
)
SidebarHeader.displayName = "SidebarHeader"

// -----------------------------------------------------------------------------
// Sidebar Footer
// -----------------------------------------------------------------------------

interface SidebarFooterProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-auto flex items-center justify-between p-4", className)}
      {...props}
    />
  )
)
SidebarFooter.displayName = "SidebarFooter"

// -----------------------------------------------------------------------------
// Sidebar Input
// -----------------------------------------------------------------------------

interface SidebarInputProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarInput = React.forwardRef<HTMLDivElement, SidebarInputProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4", className)} {...props} />
  )
)
SidebarInput.displayName = "SidebarInput"

// -----------------------------------------------------------------------------
// Sidebar Separator
// -----------------------------------------------------------------------------

interface SidebarSeparatorProps
  extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarSeparator = React.forwardRef<HTMLDivElement, SidebarSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-px bg-border", className)}
      role="separator"
      {...props}
    />
  )
)
SidebarSeparator.displayName = "SidebarSeparator"

// -----------------------------------------------------------------------------
// Sidebar Menu
// -----------------------------------------------------------------------------

interface SidebarMenuProps extends React.ComponentPropsWithoutRef<"nav"> {}

const SidebarMenu = React.forwardRef<HTMLElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn("flex flex-col gap-1 p-2", className)} {...props} />
  )
)
SidebarMenu.displayName = "SidebarMenu"

// -----------------------------------------------------------------------------
// Sidebar Menu Item
// -----------------------------------------------------------------------------

interface SidebarMenuItemProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props} />
  )
)
SidebarMenuItem.displayName = "SidebarMenuItem"

// -----------------------------------------------------------------------------
// Sidebar Menu Button
// -----------------------------------------------------------------------------

interface SidebarMenuButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  active?: boolean
}

const SidebarMenuButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  SidebarMenuButtonProps
>(({ className, active, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className={cn(
      "w-full justify-start",
      active && "bg-muted hover:bg-muted",
      className
    )}
    {...props}
  />
))
SidebarMenuButton.displayName = "SidebarMenuButton"

// -----------------------------------------------------------------------------
// Sidebar Menu Link
// -----------------------------------------------------------------------------

interface SidebarMenuLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  active?: boolean
}

const SidebarMenuLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  SidebarMenuLinkProps
>(({ className, active, ...props }, ref) => {
  const pathname = usePathname()
  const isActive = active ?? pathname === props.href
  return (
    <Link
      ref={ref}
      className={cn(
        "inline-flex h-9 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-muted hover:bg-muted",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuLink.displayName = "SidebarMenuLink"

// -----------------------------------------------------------------------------
// Sidebar Menu Badge
// -----------------------------------------------------------------------------

interface SidebarMenuBadgeProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, SidebarMenuBadgeProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "ml-auto inline-flex h-5 items-center justify-center rounded-full bg-primary px-2.5 text-xs font-semibold text-primary-foreground",
        className
      )}
      {...props}
    />
  )
)
SidebarMenuBadge.displayName = "SidebarMenuBadge"

// -----------------------------------------------------------------------------
// Sidebar Menu Sub
// -----------------------------------------------------------------------------

interface SidebarMenuSubProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarMenuSub = React.forwardRef<HTMLDivElement, SidebarMenuSubProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props} />
  )
)
SidebarMenuSub.displayName = "SidebarMenuSub"

// -----------------------------------------------------------------------------
// Sidebar Menu Sub Button
// -----------------------------------------------------------------------------

interface SidebarMenuSubButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  active?: boolean
}

const SidebarMenuSubButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  SidebarMenuSubButtonProps
>(({ className, active, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className={cn(
      "w-full justify-start text-muted-foreground",
      active && "bg-muted hover:bg-muted",
      className
    )}
    {...props}
  />
))
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

// -----------------------------------------------------------------------------
// Sidebar Menu Sub Item
// -----------------------------------------------------------------------------

interface SidebarMenuSubItemProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  active?: boolean
}

const SidebarMenuSubItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  SidebarMenuSubItemProps
>(({ className, active, ...props }, ref) => {
  const pathname = usePathname()
  const isActive = active ?? pathname === props.href
  return (
    <Link
      ref={ref}
      className={cn(
        "inline-flex h-9 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-muted hover:bg-muted",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

// -----------------------------------------------------------------------------
// Sidebar Menu Action
// -----------------------------------------------------------------------------

interface SidebarMenuActionProps
  extends React.ComponentPropsWithoutRef<typeof Button> {}

const SidebarMenuAction = React.forwardRef<
  React.ElementRef<typeof Button>,
  SidebarMenuActionProps
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn("h-8 w-8", className)}
    {...props}
  />
))
SidebarMenuAction.displayName = "SidebarMenuAction"

// -----------------------------------------------------------------------------
// Sidebar Menu Skeleton
// -----------------------------------------------------------------------------

interface SidebarMenuSkeletonProps
  extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  SidebarMenuSkeletonProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  >
    <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
    <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
    <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
  </div>
))
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

// -----------------------------------------------------------------------------
// Sidebar Group
// -----------------------------------------------------------------------------

interface SidebarGroupProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props} />
  )
)
SidebarGroup.displayName = "SidebarGroup"

// -----------------------------------------------------------------------------
// Sidebar Group Label
// -----------------------------------------------------------------------------

interface SidebarGroupLabelProps extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-4 py-2 text-sm font-semibold", className)}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

// -----------------------------------------------------------------------------
// Sidebar Group Content
// -----------------------------------------------------------------------------

interface SidebarGroupContentProps
  extends React.ComponentPropsWithoutRef<"div"> {}

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  SidebarGroupContentProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

// -----------------------------------------------------------------------------
// Sidebar Group Action
// -----------------------------------------------------------------------------

interface SidebarGroupActionProps
  extends React.ComponentPropsWithoutRef<typeof Button> {}

const SidebarGroupAction = React.forwardRef<
  React.ElementRef<typeof Button>,
  SidebarGroupActionProps
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn("h-8 w-8", className)}
    {...props}
  >
    {children || <ChevronRight className="h-4 w-4" />}
  </Button>
))
SidebarGroupAction.displayName = "SidebarGroupAction"

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarRail,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarInput,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuLink,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuAction,
  SidebarMenuSkeleton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
}
