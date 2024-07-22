import {
	appetizerBanner1Img,
	appetizerBanner2Img,
	appetizerBanner3Img,
	appetizerBanner4Img,
	burger1IconCategoryImg,
	burgerBanner1Img,
	burgerBanner2Img,
	burgerBanner3Img,
	burgerBanner4Img,
	burgerImg,
	butterCookiesImg,
	cakeBanner1Img,
	cakeBanner2Img,
	cakeBanner3Img,
	cakeBanner4Img,
	chickpeaHummusImg,
	coffeeBanner1Img,
	coffeeBanner2Img,
	coffeeBanner3Img,
	coffeeBanner4Img,
	cupIconCategoryImg,
	dessertIconCategoryImg,
	hotChocolateImg,
	noodlesBanner1Img,
	noodlesBanner2Img,
	noodlesIconCategoryImg,
	noodlesImg,
	pizzaBanner1Img,
	pizzaBanner2Img,
	pizzaBanner3Img,
	pizzaBanner4Img,
	pizzaIconCategoryImg,
	pizzaImg,
	redVelvetPastryImg,
	skewerIconCategoryImg,
	spaghettiImg,
	steamedDumplingImg,
	tacoIconCategoryImg,
	vegRiceImg,
	wrapsBanner1Img,
	wrapsBanner2Img,
	wrapsBanner3Img,
	wrapsBanner4Img,
} from './images';

export const categoriesData = [
	{
		id: 1,
		name: 'Chè',
		image: cupIconCategoryImg,
	},
	{
		id: 2,
		name: 'Trà sữa',
		image: burger1IconCategoryImg,
	},
	{
		id: 3,
		name: 'Sữa chua',
		image: noodlesIconCategoryImg,
	},
];

export const specialMenuData = [
	{
		id: 101,
		category_id: 1,
		name: 'Cappuccino',
		price: 419.45,
		images: [coffeeBanner1Img.src],
		type: 'veg',
		tags: ['Beverages', 'Coffee'],
		quantity: 23,
		review: {
			count: 1055,
			stars: 5,
		},
	},
	{
		id: 102,
		category_id: 1,
		name: 'Espresso Coffee',
		price: 40.14,
		images: [coffeeBanner2Img.src],
		type: 'veg',
		tags: ['Beverages', 'Coffee'],
		quantity: 34,
		review: {
			count: 680,
			stars: 5,
		},
		is_popular: true,
	},
	{
		id: 103,
		category_id: 1,
		name: 'Iced Cold Coffee',
		price: 49.75,
		images: [coffeeBanner3Img.src],
		type: 'veg',
		tags: ['Beverages', 'Coffee'],
		quantity: 0,
		review: {
			count: 2394,
			stars: 4.5,
		},
	},
	{
		id: 104,
		category_id: 1,
		name: 'Flat White',
		price: 14.99,
		images: [coffeeBanner4Img.src],
		type: 'veg',
		tags: ['Beverages', 'Coffee'],
		quantity: 230,
		review: {
			count: 588,
			stars: 5,
		},
	},
	{
		id: 105,
		category_id: 2,
		name: 'Cheese Burger',
		price: 23,
		images: [burgerBanner1Img.src],
		type: 'veg',
		tags: ['Burger', 'Bread'],
		quantity: 390,
		review: {
			count: 650,
			stars: 5,
		},
	},
	{
		id: 106,
		category_id: 2,
		name: 'Fried Egg Burger',
		price: 39.75,
		images: [burgerBanner2Img.src],
		type: 'eggetarian',
		tags: ['Burger', 'Bread'],
		quantity: 209,
		review: {
			count: 129,
			stars: 5,
		},
	},
	{
		id: 107,
		category_id: 2,
		name: 'Meat Burger',
		price: 488,
		images: [burgerBanner3Img.src],
		type: 'non-veg',
		tags: ['Burger', 'Meal', 'Bread'],
		quantity: 20,
		review: {
			count: 523,
			stars: 5,
		},
	},
	{
		id: 108,
		category_id: 2,
		name: 'Gourmet cheeseburger',
		price: 549,
		images: [burgerBanner4Img.src],
		type: 'non-veg',
		tags: ['Burger', 'Meal', 'Hot & Spicy', 'Bread'],
		quantity: 14,
		review: {
			count: 241,
			stars: 5,
		},
		is_popular: true,
	},
	{
		id: 109,
		category_id: 3,
		name: 'Asian Noodles',
		price: 119,
		images: [noodlesBanner1Img.src],
		type: 'veg',
		tags: ['Noodles', 'Hot & Spicy', 'Meal'],
		quantity: 45,
		review: {
			count: 4325,
			stars: 5,
		},
		is_popular: true,
	},
	{
		id: 110,
		category_id: 3,
		name: 'Spaghetti',
		price: 23,
		images: [noodlesBanner2Img.src],
		type: 'veg',
		tags: ['Noodles', 'Hot & Spicy', 'Meal'],
		quantity: 10,
		review: {
			count: 6667,
			stars: 4.5,
		},
	},
	{
		id: 111,
		category_id: 3,
		name: 'Veg Noodles',
		price: 108,
		images: [noodlesBanner1Img.src],
		type: 'veg',
		tags: ['Noodles', 'Meal'],
		quantity: 70,
		review: {
			count: 23,
			stars: 5,
		},
	},
	{
		id: 112,
		category_id: 3,
		name: 'Italian Noodle Pasta',
		price: 223,
		images: [noodlesBanner2Img.src],
		type: 'veg',
		tags: ['Noodles', 'Hot & Spicy', 'Meal'],
		quantity: 67,
		review: {
			count: 223,
			stars: 5,
		},
	},
	{
		id: 113,
		category_id: 4,
		name: 'Italian Pizza',
		price: 79,
		images: [pizzaBanner1Img.src],
		type: 'non-veg',
		tags: ['Pizza', 'Hot & Spicy', 'Meal', 'Bread'],
		quantity: 16,
		review: {
			count: 231,
			stars: 4.5,
		},
	},
	{
		id: 114,
		category_id: 4,
		name: 'Margarita Pizza',
		price: 14,
		images: [pizzaBanner2Img.src],
		type: 'veg',
		tags: ['Pizza', 'Hot & Spicy', 'Meal', 'Bread'],
		quantity: 4,
		review: {
			count: 12,
			stars: 4,
		},
	},
	{
		id: 115,
		category_id: 4,
		name: 'Vegetarian Pizza',
		price: 25,
		images: [pizzaBanner3Img.src],
		type: 'veg',
		tags: ['Pizza', 'Meal', 'Bread'],
		quantity: 12,
		review: {
			count: 188,
			stars: 5,
		},
	},
	{
		id: 116,
		category_id: 4,
		name: 'Turkish Pizza',
		price: 16,
		images: [pizzaBanner4Img.src],
		type: 'veg',
		tags: ['Pizza', 'Hot & Spicy', 'Meal', 'Bread'],
		quantity: 23,
		review: {
			count: 19,
			stars: 4,
		},
		is_popular: true,
	},
	{
		id: 117,
		category_id: 5,
		name: 'Asian wraps',
		price: 229,
		images: [wrapsBanner1Img.src],
		type: 'veg',
		tags: ['Wraps', 'Hot & Spicy'],
		quantity: 404,
		review: {
			count: 99,
			stars: 4.5,
		},
	},
	{
		id: 118,
		category_id: 5,
		name: 'Meat wraps',
		price: 59,
		images: [wrapsBanner2Img.src],
		type: 'non-veg',
		tags: ['Wraps', 'Hot & Spicy', 'Meal'],
		quantity: 230,
		review: {
			count: 322,
			stars: 4.5,
		},
	},
	{
		id: 119,
		category_id: 5,
		name: 'Frankie',
		price: 349,
		images: [wrapsBanner3Img.src],
		type: 'veg',
		tags: ['Wraps', 'Hot & Spicy'],
		quantity: 120,
		review: {
			count: 228,
			stars: 4.5,
		},
		is_popular: true,
	},
	{
		id: 120,
		category_id: 5,
		name: 'Burrito wraps Pasta',
		price: 10.99,
		images: [wrapsBanner4Img.src],
		type: 'veg',
		tags: ['Wraps', 'Hot & Spicy', 'Meal'],
		quantity: 40,
		review: {
			count: 2134,
			stars: 5,
		},
	},
	{
		id: 121,
		category_id: 6,
		name: 'Veg Salad',
		price: 58.5,
		images: [appetizerBanner1Img.src],
		type: 'veg',
		tags: ['Meal'],
		quantity: 34,
		review: {
			count: 1221,
			stars: 3,
		},
	},
	{
		id: 122,
		category_id: 6,
		name: 'Chicken Skewers',
		price: 485.32,
		images: [appetizerBanner2Img.src],
		type: 'non-veg',
		tags: ['Meal', 'Hot & Spicy'],
		quantity: 23,
		review: {
			count: 523,
			stars: 5,
		},
	},
	{
		id: 123,
		category_id: 6,
		name: 'Nachos Salsa Dip',
		price: 358,
		images: [appetizerBanner3Img.src],
		type: 'veg',
		tags: ['Meal', 'Hot & Spicy'],
		quantity: 34,
		review: {
			count: 241,
			stars: 5,
		},
	},
	{
		id: 124,
		category_id: 6,
		name: 'Paneer tikka Skewers',
		price: 645.2,
		images: [appetizerBanner4Img.src],
		type: 'non-veg',
		tags: ['Meal', 'Hot & Spicy'],
		quantity: 0,
		review: {
			count: 4325,
			stars: 5,
		},
		is_popular: true,
	},
	{
		id: 125,
		category_id: 7,
		name: 'Brownie Cake',
		price: 350,
		images: [cakeBanner1Img.src],
		type: 'veg',
		tags: ['Sweeties', 'Finishers', 'Dessert'],
		quantity: 230,
		review: {
			count: 6667,
			stars: 4.5,
		},
	},
	{
		id: 126,
		category_id: 7,
		name: 'Berry Cheesecake',
		price: 420.8,
		images: [cakeBanner2Img.src],
		type: 'veg',
		tags: ['Finishers', 'Dessert'],
		quantity: 390,
		review: {
			count: 23,
			stars: 5,
		},
	},
	{
		id: 127,
		category_id: 7,
		name: 'Chocolate Donuts',
		price: 665,
		images: [cakeBanner3Img.src],
		type: 'veg',
		tags: ['Sweeties', 'Finishers', 'Dessert'],
		quantity: 209,
		review: {
			count: 223,
			stars: 5,
		},
		is_popular: true,
	},
	{
		id: 128,
		category_id: 7,
		name: 'Carrot Cake',
		price: 509,
		images: [cakeBanner4Img.src],
		type: 'veg',
		tags: ['Finishers', 'Dessert'],
		quantity: 20,
		review: {
			count: 231,
			stars: 4.5,
		},
	},
].map((dish) => {
	return {
		...dish,
		category: categoriesData[dish.category_id - 1],
	};
});

export const dishesData = [
	{
		id: 1001,
		category_id: 4,
		restaurant_id: 901,
		name: 'Italian Pizza',
		images: [pizzaImg.src],
		price: 79,
		type: 'non-veg',
		tags: ['Pizza', 'Hot & Spicy', 'Meal', 'Bread'],
		quantity: 16,
		review: {
			count: 231,
			stars: 4.5,
		},
		sale: {
			discount: 50,
			type: 'percent',
		},
		is_popular: true,
	},
	{
		id: 1002,
		category_id: 2,
		restaurant_id: 902,
		name: 'Veg Burger',
		price: 488,
		images: [burgerImg.src],
		type: 'veg',
		tags: ['Burger', 'Meal', 'Bread'],
		quantity: 20,
		review: {
			count: 523,
			stars: 5,
		},
		sale: {
			discount: 5,
			type: 'amount',
		},
		is_popular: true,
	},
	{
		id: 1003,
		category_id: 3,
		restaurant_id: 903,
		name: 'Spaghetti',
		price: 23,
		images: [noodlesImg.src],
		type: 'veg',
		tags: ['Noodles', 'Hot & Spicy', 'Meal'],
		quantity: 10,
		review: {
			count: 6667,
			stars: 4.5,
		},
		is_popular: true,
	},
	{
		id: 1004,
		category_id: 7,
		restaurant_id: 904,
		name: 'Red Velvet Cake',
		price: 350,
		images: [redVelvetPastryImg.src],
		type: 'veg',
		tags: ['Sweeties', 'Finishers', 'Dessert'],
		quantity: 230,
		review: {
			count: 6667,
			stars: 4.5,
		},
		sale: {
			discount: 12,
			type: 'amount',
		},
		is_popular: true,
	},
	{
		id: 1005,
		category_id: 6,
		restaurant_id: 905,
		name: 'Mix Salad',
		price: 645.2,
		images: [spaghettiImg.src],
		type: 'non-veg',
		tags: ['Meal', 'Hot & Spicy'],
		quantity: 0,
		review: {
			count: 4325,
			stars: 5,
		},
	},
	{
		id: 1006,
		category_id: 1,
		restaurant_id: 906,
		name: 'Espresso Coffee',
		price: 419.45,
		images: [hotChocolateImg.src],
		type: 'veg',
		tags: ['Beverages', 'Coffee'],
		quantity: 23,
		review: {
			count: 1055,
			stars: 5,
		},
	},
	{
		id: 1007,
		category_id: 6,
		restaurant_id: 907,
		name: 'Steamed Dumplings',
		price: 58.5,
		images: [steamedDumplingImg.src],
		type: 'veg',
		tags: ['Meal'],
		quantity: 34,
		review: {
			count: 1221,
			stars: 3,
		},
	},
	{
		id: 1008,
		category_id: 6,
		restaurant_id: 908,
		name: 'Gujarati Thali',
		price: 58.5,
		images: [vegRiceImg.src],
		type: 'veg',
		tags: ['Meal'],
		quantity: 34,
		review: {
			count: 1221,
			stars: 4.5,
		},
		sale: {
			discount: 40,
			type: 'percent',
		},
	},
	{
		id: 1009,
		category_id: 6,
		restaurant_id: 901,
		name: 'Chickenpea Hummus',
		price: 58.5,
		images: [chickpeaHummusImg.src],
		type: 'eggetarian',
		tags: ['Meal'],
		quantity: 34,
		review: {
			count: 1221,
			stars: 3.5,
		},
	},
	{
		id: 1010,
		category_id: 7,
		restaurant_id: 902,
		name: 'Butter Cookies',
		price: 665,
		images: [butterCookiesImg.src],
		type: 'veg',
		tags: ['Sweeties', 'Finishers', 'Dessert'],
		quantity: 209,
		review: {
			count: 223,
			stars: 5,
		},
	},
].map((dish) => {
	return {
		...dish,
		category: categoriesData[dish.category_id - 1],
	};
});
