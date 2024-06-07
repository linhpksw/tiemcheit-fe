import { ADMIN_VERTICAL_MENU_ITEMS, CLIENT_VERTICAL_MENU_ITEMS, HORIZONTAL_MENU_ITEMS } from '@/assets/data';
import {
    LuHotel,
    LuLayoutGrid,
    LuListOrdered,
    LuSettings2,
    LuSoup,
    LuUserCog,
    LuUsers,
    LuWallet,
} from 'react-icons/lu';

const getVerticalMenuItems = (username) => {
    const items = [
        {
            key: 'dashboard-page',
            label: 'Bảng điều khiển',
            icon: LuLayoutGrid,
            url: `/${username}/dashboard`,
            isTitle: true,
            allowedRoles: ['ROLE_CUSTOMER'],
        },
        {
            key: 'manage-page',
            label: 'Quản lý',
            icon: LuSettings2,
            url: `/${username}/manage`,
            isTitle: true,
            allowedRoles: ['ROLE_CUSTOMER'],
        },
        {
            key: 'orders',
            label: 'Orders',
            icon: LuListOrdered,
            isTitle: true,
            allowedRoles: ['ROLE_CUSTOMER'],
            children: [
                {
                    key: 'orders-list',
                    label: 'Orders List',
                    url: `/${username}/orders`,
                    parentKey: 'orders',
                },
                {
                    key: 'orders-details',
                    label: 'Order Details',
                    url: `/${username}/orders/1001`,
                    parentKey: 'orders',
                },
            ],
        },
        {
            key: 'customers',
            label: 'Customers',
            icon: LuUsers,
            isTitle: true,
            allowedRoles: ['ROLE_CUSTOMER'],
            children: [
                {
                    key: 'customers-list',
                    label: 'Customers List',
                    url: `/${username}/customers`,
                    parentKey: 'customers',
                },
                {
                    key: 'customers-details',
                    label: 'Customer Details',
                    url: `/${username}/customers/1001`,
                    parentKey: 'customers',
                },
                {
                    key: 'customers-add',
                    label: 'Add Customer',
                    url: `/${username}/add-customer`,
                    parentKey: 'customers',
                },
                {
                    key: 'customers-edit',
                    label: 'Edit Customer',
                    url: `/${username}/edit-customer`,
                    parentKey: 'customers',
                },
            ],
        },
        {
            key: 'restaurants',
            label: 'Restaurants',
            icon: LuHotel,
            isTitle: true,
            allowedRoles: ['ROLE_CUSTOMER'],
            children: [
                {
                    key: 'restaurants-list',
                    label: 'Restaurants List',
                    url: `/${username}/restaurants`,
                    parentKey: 'restaurants',
                },
                {
                    key: 'restaurants-details',
                    label: 'Restaurant Details',
                    url: `/${username}/restaurants/1001`,
                    parentKey: 'restaurants',
                },
                {
                    key: 'restaurants-add',
                    label: 'Add Restaurant',
                    url: `/${username}/add-restaurant`,
                    parentKey: 'restaurants',
                },
                {
                    key: 'restaurants-edit',
                    label: 'Edit Restaurant',
                    url: `/${username}/edit-restaurant`,
                    parentKey: 'restaurants',
                },
            ],
        },
        {
            key: 'dishes',
            label: 'Dishes',
            icon: LuSoup,
            isTitle: true,
            allowedRoles: ['ROLE_CUSTOMER'],
            children: [
                {
                    key: 'dishes-list',
                    label: 'Dishes List',
                    url: `/${username}/dishes`,
                    parentKey: 'dishes',
                },
                {
                    key: 'dishes-details',
                    label: 'Dish Details',
                    url: `/${username}/dishes/1001`,
                    parentKey: 'dishes',
                },
                {
                    key: 'dishes-add',
                    label: 'Add Dish',
                    url: `/${username}/add-dish`,
                    parentKey: 'dishes',
                },
                {
                    key: 'dishes-edit',
                    label: 'Edit Dish',
                    url: `/${username}/edit-dish`,
                    parentKey: 'dishes',
                },
            ],
        },
        {
            key: 'sellers',
            label: 'Sellers',
            icon: LuUserCog,
            isTitle: true,
            allowedRoles: ['ROLE_CUSTOMER'],
            children: [
                {
                    key: 'sellers-list',
                    label: 'Sellers List',
                    url: `/${username}/sellers`,
                    parentKey: 'sellers',
                },
                {
                    key: 'sellers-details',
                    label: 'Seller Details',
                    url: `/${username}/sellers/1001`,
                    parentKey: 'sellers',
                },
                {
                    key: 'sellers-add',
                    label: 'Add Seller',
                    url: `/${username}/add-seller`,
                    parentKey: 'sellers',
                },
                {
                    key: 'sellers-edit',
                    label: 'Edit Seller',
                    url: `/${username}/edit-seller`,
                    parentKey: 'sellers',
                },
            ],
        },
        {
            key: 'wallet-page',
            label: 'Wallet',
            icon: LuWallet,
            url: `/${username}/wallet`,
            isTitle: true,
            allowedRoles: ['ROLE_CUSTOMER'],
        },
    ];

    return items;
};

const getClientVerticalMenuItems = () => {
    // NOTE - You can fetch from server and return here as well
    return CLIENT_VERTICAL_MENU_ITEMS;
};

const getAdminVerticalMenuItems = () => {
    // NOTE - You can fetch from server and return here as well
    return ADMIN_VERTICAL_MENU_ITEMS;
};

const getHorizontalMenuItems = () => {
    // NOTE - You can fetch from server and return here as well
    return HORIZONTAL_MENU_ITEMS;
};

const findAllParent = (menuItems, menuItem) => {
    let parents = [];
    const parent = findMenuItem(menuItems, menuItem.parentKey);

    if (parent) {
        parents.push(parent.key);
        if (parent.parentKey) {
            parents = [...parents, ...findAllParent(menuItems, parent)];
        }
    }
    return parents;
};

const getMenuItemFromURL = (items, url) => {
    if (items instanceof Array) {
        for (const item of items) {
            const foundItem = getMenuItemFromURL(item, url);
            if (foundItem) return foundItem;
        }
    } else {
        if (items.url == url) return items;
        if (items.children != null) {
            for (const item of items.children) {
                if (item.url == url) return item;
            }
        }
    }
};

const findMenuItem = (menuItems, menuItemKey) => {
    if (menuItems && menuItemKey) {
        for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i].key === menuItemKey) {
                return menuItems[i];
            }
            const found = findMenuItem(menuItems[i].children, menuItemKey);
            if (found) return found;
        }
    }
    return null;
};

export {
    getHorizontalMenuItems,
    getClientVerticalMenuItems,
    getAdminVerticalMenuItems,
    getVerticalMenuItems,
    findAllParent,
    findMenuItem,
    getMenuItemFromURL,
};
