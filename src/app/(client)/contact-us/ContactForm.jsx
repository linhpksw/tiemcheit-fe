"use client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { TextAreaFormInput, TextFormInput } from "@/components";
import { robustFetchWithoutAT } from "@/helpers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ContactForm = () => {
	yup.addMethod(yup.string, "name", function (message) {
		return this.test("name", message, function (value) {
			const { path, createError } = this;
			const regex = /^[a-zA-Z\s]*$/; // Regex to allow only letters and spaces

			if (/[^a-zA-Z\s]/.test(value)) {
				return createError({ path, message: "Tên không hợp lệ" });
			}

			if (value.length > 256) {
				return createError({ path, message: "Tên quá dài" });
			}

			return true;
		});
	});
	yup.addMethod(yup.string, "email", function (message) {
		return this.test("email", message, function (value) {
			const { path, createError } = this;
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex

			if (!emailRegex.test(value)) {
				return createError({ path, message: "Email không hợp lệ" });
			}

			if (value.length > 320) {
				return createError({ path, message: "Email quá dài" });
			}

			return true;
		});
	});
	const contactFormSchema = yup.object().shape({
		email: yup
			.string()
			.email("Nhập email hợp lệ")
			.required("Email không thể bị bỏ trống"),
		// subject: yup.string().required("Please enter your subject"),
		message: yup.string().required("Tin nhắn không thể bị bỏ trống"),
		name: yup
			.string()
			.name("Tên không hợp lệ")
			.required("Tên không thể bị bỏ trống"),
	});

	const { control, handleSubmit } = useForm({
		resolver: yupResolver(contactFormSchema),
	});

	const formData = {
		name: "",
		email: "",
		message: "",
		isRead: false,
	};

	const onSubmit = async (data) => {
		try {
			formData.name = data.name;
			formData.email = data.email;
			formData.message = data.message;

			const response = await robustFetchWithoutAT(
				`${BASE_URL}/feedback`,
				"POST",
				"Gửi thành công",
				formData
			);
		} catch (error) {
			console.error("Lỗi khi gửi thông tin:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="grid gap-6 lg:grid-cols-2">
				<TextFormInput
					name="name"
					label="Tên"
					type="text"
					placeholder="Tên"
					control={control}
					fullWidth
				/>
				{/* <TextFormInput
					name="lName"
					type="text"
					label="Last Name"
					placeholder="Last Name"
					control={control}
					fullWidth
				/> */}
				<TextFormInput
					name="email"
					label="E-mail"
					type="email"
					placeholder="Enter Your Email"
					control={control}
					fullWidth
					containerClassName="lg:col-span-2"
				/>
				<TextAreaFormInput
					name="message"
					label="Message"
					rows={5}
					className="bg-transparent"
					placeholder="Enter Your Message"
					control={control}
					containerClassName="lg:col-span-2"
					fullWidth
				/>
				<div>
					<button
						type="submit"
						className="inline-flex items-center justify-center rounded-lg bg-primary px-10 py-3 text-base font-medium capitalize text-white transition-all hover:bg-primary-500"
					>
						Send Message
					</button>
				</div>
			</div>
		</form>
	);
};

export default ContactForm;
