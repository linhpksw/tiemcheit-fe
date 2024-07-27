'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { robustFetchWithoutAT } from '@/helpers';
import { toast } from 'sonner';
import { setCookie } from '@/helpers';
import { useShoppingContext } from '@/context';

const OAuth2 = () => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const { fetchCartData, fetchWishlistData } = useShoppingContext();
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			const authCode = searchParams.get('code');

			if (authCode) {
				const URL = `${BASE_URL}/auth/oauth2?code=${authCode}`;

				try {
					const response = await robustFetchWithoutAT(
						URL,
						'POST',
						'Đăng nhập bằng Google thành công'
					);

					const { accessToken, refreshToken } = response.data;
					setCookie('accessToken', accessToken, 3600);
					setCookie('refreshToken', refreshToken, 604800);

					fetchCartData();
					fetchWishlistData();
					router.push('/');
				} catch (error) {
					if (error.message === 'This account has been banned') {
						router.push('/auth/login');
					}
					console.error('Error:', error.message);
				}
			}
		};

		fetchData();
	}, []);

	return (
		<div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-default-700 opacity-75 flex flex-col items-center justify-center">
			<div>
				<svg
					aria-hidden="true"
					class="w-16 h-16 text-default-200 animate-spin dark:text-default-600 fill-primary-600"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
				<span class="sr-only">Loading...</span>
			</div>

			<h2 class="mt-6 text-center text-default-50 text-xl font-semibold">
				Đang xác thực...
			</h2>
			<p class="mt-3 text-center text-default-50">
				Quá trình này có thể mất vài phút, vui lòng giữ nguyên trang hiện tại.
			</p>
		</div>
	);
};

export default OAuth2;
