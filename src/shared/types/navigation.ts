export interface NavigationItem {
    label: string
    href: string
    icon: React.ElementType
    roles: Role[]
    priority?: number 
}
