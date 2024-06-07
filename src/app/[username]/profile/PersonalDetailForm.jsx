"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import { SelectFormInput, TextFormInput, DateFormInput } from "@/components";
import { useUser } from "@/hooks";

// styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop
);

const PersonalDetailForm = ({ user }) => {
    console.log(user);
    const { fullname, username, email, phone } = user.data;

    const personalDetailsFormSchema = yup.object({
        fullname: yup.string().required("Vui lòng nhập họ và tên của bạn"),
        username: yup.string().required("Vui lòng nhập tên tài khoản của bạn"),
        email: yup
            .string()
            .email("Vui lòng nhập email hợp lệ")
            .required("Vui lòng nhập email của bạn"),
        phone: yup.string().required("Vui lòng nhập số điện thoại của bạn"),
        dob: yup.date().required("Vui lòng chọn ngày sinh của bạn"),
        gender: yup.string().required("Vui lòng chọn giới tính của bạn"),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(personalDetailsFormSchema),
        defaultValues: {
            fullname: fullname,
            username: username,
            email: email,
            phone: phone
        },
    });

    return (
        <div className="mb-6 rounded-lg border border-default-200 p-6">
            <div>
                <h4 className="mb-4 text-xl font-medium text-default-900">
                    Thông tin chung
                </h4>
                <div className="grid gap-6 xl:grid-cols-5">
                    <div className="xl:col-span-1">
                        <div className="mx-auto">
                            <FilePond
                                className="mx-auto h-44 w-44 lg:h-48 lg:w-48 "
                                labelIdle="Tải ảnh lên"
                                imagePreviewHeight={110}
                                imageCropAspectRatio="1:1"
                                stylePanelLayout="compact circle"
                                styleButtonRemoveItemPosition="center bottom"
                            />
                        </div>
                    </div>
                    <div className="xl:col-span-4">
                        <form
                            onSubmit={handleSubmit(() => { })}
                            className="grid gap-6 lg:grid-cols-2"
                        >

                            <TextFormInput
                                name="fullname"
                                label="Họ và tên"
                                type="text"
                                placeholder="Nhập họ và tên của bạn"
                                control={control}
                                fullWidth
                            />

                            <TextFormInput
                                name="username"
                                label="Tên tài khoản"
                                type="text"
                                placeholder="Nhập tên tài khoản của bạn"
                                control={control}
                                fullWidth
                            />

                            <TextFormInput
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="nguyenvana@gmail.com"
                                control={control}
                                fullWidth
                            />
                            <TextFormInput
                                name="phone"
                                label="Số điện thoại"
                                type="text"
                                placeholder="0912345678"
                                control={control}
                                fullWidth
                            />
                            <SelectFormInput
                                name="gender"
                                label="Giới tính"
                                control={control}
                                placeholder="Chọn..."
                                id="gender"
                                instanceId="gender"
                                options={[
                                    { value: "Nam", label: "Nam" },
                                    { value: "Nữ", label: "Nữ" },
                                    { value: "Khác", label: "Khác" },
                                ]}
                            />

                            <DateFormInput
                                name="dob"
                                type="date"
                                label="Ngày sinh"
                                placeholder="Chọn..."
                                className="block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50"
                                options={{ dateFormat: "d/m/Y" }}
                                fullWidth
                                control={control}
                            />

                            <div>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-600"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailForm;
