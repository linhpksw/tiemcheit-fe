"use client";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import { SelectFormInput, TextFormInput, DateFormInput } from "@/components";
import useUpdateProfile from "./useUpdateProfile";

// styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "./useUpdateProfile"

// Register the plugins
registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop
);

const PersonalDetailForm = ({ user }) => {
    const { loading, update, control } = useUpdateProfile(user);

    return (
        <div id="tabPersonalDetail"
            role="tabpanel" className="mb-6 rounded-lg border border-default-200 p-6">

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
                        onSubmit={update}
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
                            disabled
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
                            placeholder="Nhập số điện thoại của bạn"
                            control={control}
                            fullWidth
                        />
                        <SelectFormInput
                            name="gender"
                            label="Giới tính"
                            control={control}
                            placeholder="Chọn giới tính..."
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
                            placeholder="Chọn ngày sinh..."
                            className="block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50"
                            options={{ dateFormat: "d/m/Y" }}
                            fullWidth
                            control={control}
                        />

                        <div>
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-600"
                                disabled={loading}
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default PersonalDetailForm;