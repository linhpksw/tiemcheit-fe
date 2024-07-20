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
	LuFileClock,
} from 'react-icons/lu';
import { RiCouponLine } from 'react-icons/ri';

const getVerticalMenuItems = (username) => {
	const items = [
		{
			key: 'dashboard-page',
			label: 'Bảng điều khiển',
			icon: LuLayoutGrid,
			url: `/${username}/dashboard`,
			isTitle: true,
			allowedRoles: ['ROLE_ADMIN'],
		},
		{
			key: 'logs',
			label: 'Nhật ký hệ thống',
			icon: LuFileClock,
			url: `/${username}/logs`,
			isTitle: true,
			allowedRoles: ['ROLE_ADMIN'],
		},
		{
			key: 'orders',
			label: 'Đơn hàng',
			icon: LuListOrdered,
			isTitle: true,
			allowedRoles: ['ROLE_CUSTOMER', 'ROLE_ADMIN'],
			url: `/${username}/orders`,
		},
		{
			key: 'custom-dish',
			label: 'Chè tự chọn',
			icon: LuSoup,
			isTitle: true,
			allowedRoles: ['ROLE_CUSTOMER'],
			url: `/${username}/custom-dish`,
		},
		{
			key: 'customers',
			label: 'Khách hàng',
			icon: LuUsers,
			isTitle: true,
			allowedRoles: ['ROLE_ADMIN'],
			url: `/${username}/customers`,
		},
		{
			key: 'employees',
			label: 'Nhân viên',
			icon: LuUsers,
			isTitle: true,
			allowedRoles: ['ROLE_ADMIN'],
			url: `/${username}/employees`,
		},
		{
			key: 'dishes',
			label: 'Sản phẩm',
			icon: LuSoup,
			isTitle: true,
			url: `/${username}/dishes`,
			allowedRoles: ['ROLE_ADMIN'],
		},
		{
			key: 'ingredients',
			label: 'Nguyên liệu',
			icon: LuSoup,
			isTitle: true,
			url: `/${username}/ingredients`,
			allowedRoles: ['ROLE_ADMIN'],
		},
		{
			key: 'categories',
			label: 'Loại sản phẩm',
			icon: LuSoup,
			isTitle: true,
			url: `/${username}/categories`,
			allowedRoles: ['ROLE_ADMIN'],
		},
		{
			key: 'coupons',
			label: 'Mã giảm giá',
			icon: RiCouponLine,
			isTitle: true,
			allowedRoles: ['ROLE_ADMIN'],
			children: [
				{
					key: 'coupons-list',
					label: 'Coupons List',
					url: `/${username}/coupons`,
					parentKey: 'coupons',
				},
				{
					key: 'coupons-add',
					label: 'Add Coupon',
					url: `/${username}/add-coupon`,
					parentKey: 'coupons',
				},
			],
		},
		{
			key: 'feedbacks',
			label: 'Đánh giá',
			icon: LuSoup,
			isTitle: true,
			url: `/${username}/feedbacks`,
			allowedRoles: ['ROLE_ADMIN'],
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
