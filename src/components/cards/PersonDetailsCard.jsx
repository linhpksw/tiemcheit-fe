'use client';

import Image from 'next/image';
import { cn, dictionary, toSentenceCase } from '@/utils';

const PersonDetailsCard = ({ user = {} }) => {
	const { phone, email, location, fullname, photo, status } = user;

	console.log(status);

	return (
		<div className="rounded-lg border border-default-200 p-6">
			<Image
				src={photo}
				width={96}
				height={96}
				className="w-24 rounded-full border border-gray-200 bg-gray-100 p-1 dark:border-gray-600 dark:bg-gray-700"
				alt="avatar"
			/>
			<h4 className="mb-1 mt-3 text-lg">{fullname}</h4>
			<div className="mt-6 text-start">
				{/* <h4 className="mb-2.5 text-sm uppercase">About Me :</h4>
        <p className="mb-6 text-gray-400">
          Hi I&apos;m Kaiya Botosh,has been the industry&apos;s standard dummy
          text ever since the 1500s, when an unknown printer took a galley of
          type.
        </p> */}
				<p className="mb-3 text-zinc-400">
					<b>Họ và tên :</b> <span className="ms-2">{fullname}</span>
				</p>
				<p className="mb-3 text-zinc-400">
					<b>Số điện thoại :</b>
					<span className="ms-2">{phone ? phone : 'Không'}</span>
				</p>
				<p className="mb-3 text-zinc-400">
					<b>Email :</b> <span className="ms-2 ">{email}</span>
				</p>
				<p className="mb-3 text-zinc-400">
					<b>Trạng thái :</b>
					<span
						className={cn(
							'ms-2 rounded-md px-3 py-1 text-xs font-medium',
							status == 'ACTIVE'
								? 'bg-green-500/10 text-green-500'
								: 'bg-red-500/10 text-red-500'
						)}
					>
						{dictionary(status)}
					</span>
				</p>
				{/* <p className="mb-1.5 text-zinc-400">
          <b>Location :</b> <span className="ms-2">{location}</span>
        </p> */}
			</div>
		</div>
	);
};

export default PersonDetailsCard;
