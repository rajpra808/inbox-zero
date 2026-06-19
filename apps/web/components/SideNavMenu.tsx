"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  getAppPageFromNavItem,
  getAppPageFromPathname,
  getAppPageProperties,
  PRODUCT_ANALYTICS_EVENTS,
  APP_PAGES,
} from "@/utils/analytics/product";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon | ((props: ComponentProps<"svg">) => React.ReactNode);
  target?: "_blank";
  count?: number;
  hideInMail?: boolean;
  active?: boolean;
  beta?: boolean;
  new?: boolean;
};

export function SideNavMenu({
  items,
  activeHref,
}: {
  items: NavItem[];
  activeHref: string;
}) {
  const { closeMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const posthog = usePostHog();
  const currentAppPage = getAppPageFromPathname(pathname);

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.name} className="font-medium">
          <SidebarMenuButton
            asChild
            isActive={item.active || activeHref === item.href}
            className="relative h-9 rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground data-[active=true]:before:absolute data-[active=true]:before:inset-y-1.5 data-[active=true]:before:left-0 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-full data-[active=true]:before:bg-[hsl(217_91%_60%)] [&>svg]:text-current"
            tooltip={item.name}
            sidebarName="left-sidebar"
          >
            <Link
              href={item.href}
              onClick={() => {
                const destinationAppPage = getAppPageFromNavItem({
                  name: item.name,
                  href: item.href,
                });

                posthog.capture(PRODUCT_ANALYTICS_EVENTS.navigationClicked, {
                  ...getAppPageProperties(currentAppPage),
                  destination_page: destinationAppPage,
                  destination_page_label: destinationAppPage
                    ? APP_PAGES[destinationAppPage].label
                    : undefined,
                  nav_item: item.name,
                  nav_href_type: getNavHrefType(item.href),
                });
                closeMobileSidebar("left-sidebar");
              }}
            >
              <item.icon />
              <span>{item.name}</span>
              {item.new && (
                <Badge variant="green" className="ml-auto text-[10px]">
                  New!
                </Badge>
              )}
              {item.beta && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  Beta
                </Badge>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function getNavHrefType(href: string) {
  if (href.startsWith("?")) return "query";
  if (href.startsWith("http")) return "external";
  return "internal";
}
