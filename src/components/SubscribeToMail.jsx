"use client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuMail } from "react-icons/lu";
import { TextFormInput } from "@/components";

const SubscribeToMail = () => {
    const subscribeSchema = yup.object({
        email: yup
            .string()
            .email("Please enter a valid email")
            .required("Please enter your email"),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(subscribeSchema),
    });

    return (
        <div className="col-span-1">
            <div className="flex flex-col gap-3">
                <div className="rounded-lg bg-primary/10">
                    <div className="p-8">
                        <form className="mb-6 space-y-2" onSubmit={handleSubmit(() => { })}>
                            <label
                                htmlFor="subscribeEmail"
                                className="mb-4 text-lg font-medium text-default-950"
                            >
                                Đăng ký nhận thông báo qua email
                            </label>
                            <div className="flex rounded-md shadow-sm">
                                <TextFormInput
                                    name="email"
                                    className="form-input  bg-white"
                                    control={control}
                                    placeholder="Điền email của bạn"
                                    endButtonIcon={<LuArrowRight size={20} />}
                                    startInnerIcon={<LuMail size={20} />}
                                    fullWidth
                                />
                            </div>
                        </form>
                        <p className="mb-6 text-sm text-default-500">
                            Đăng ký để nhận thông báo về các sản phẩm mới, ưu đãi và các tin tức
                            khác từ chúng tôi.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscribeToMail;
