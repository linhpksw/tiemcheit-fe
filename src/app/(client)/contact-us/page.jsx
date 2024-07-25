import Image from 'next/image';
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { Breadcrumb } from '@/components';
import ContactForm from './ContactForm';
import { contactOtherImg } from '@/assets/data/images';
import Link from 'next/link';

export const metadata = {
	title: 'Gửi phản hồi',
};

const ContactUs = () => {
	return (
		<>
			<Breadcrumb title="Gửi phản hồi" />
			<section className="py-6 lg:py-16">
				<div className="container">
					<div className="grid gap-10 lg:grid-cols-5">
						<div className="lg:col-span-2">
							<h1 className="mb-2 text-2xl font-semibold text-default-800">
								Gửi phản hồi cho chúng mình
							</h1>
							<p className="mb-8 max-w-xl text-sm text-default-600">
								Cửa hàng chúng mình luôn luôn tiếp nhận những lời phản hồi của
								mọi người để có thể nâng cấp trải nghiệm người dùng và phục vụ
								những gì tốt nhất cho các bạn!
							</p>
							<div className="flex items-center justify-center">
								<Image
									src={contactOtherImg}
									className="h-full max-w-full"
									alt="contact"
								/>
							</div>
						</div>
						<div className="lg:col-span-3">
							<ContactForm />
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default ContactUs;
