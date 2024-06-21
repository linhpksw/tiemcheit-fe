import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { debounce } from 'lodash';
import { useRef } from "react";

registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop
);



const DishUploader = ({ setImages, handleSubmit, onSubmit }) => {

    const handleFilePondUpdate = debounce((fileItems) => {
        const updatedImages = fileItems.map(fileItem => ({
            file: fileItem.file,
            metadata: fileItem.getMetadata()
        }));
        setImages((prevImages) => [...prevImages, ...updatedImages]);
    }, 300);



    return (
        <div className="rounded-lg border border-default-200 p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 flex h-96 flex-col items-center justify-center rounded-lg border border-default-200 p-6">
                    <FilePond
                        className="h-28 w-28 md:h-56 md:w-56 lg:h-64 lg:w-64"
                        labelIdle='<div class="lg:mt-44 md:mt-36 mt-9">Upload Image</div>'
                        imagePreviewHeight={250}
                        imageCropAspectRatio="1:1"
                        styleButtonRemoveItemPosition="center bottom"
                        onupdatefiles={handleFilePondUpdate}
                        required
                    />
                </div>
                <h4 className="mb-4 text-base font-medium text-default-800">
                    Additional Images <span className="text-sm text-default-600">(Optional)</span>
                </h4>
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-default-200 p-6">
                        <FilePond
                            className="h-24 w-24 p-0"
                            labelIdle='<div class="lg:mt-4 md:mt-5 sm:mt-6 mt-7">Upload Image</div>'
                            imageCropAspectRatio="1:1"
                            styleButtonRemoveItemPosition="center bottom"
                            onupdatefiles={handleFilePondUpdate}
                        />
                    </div>
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-default-200 p-6">
                        <FilePond
                            className="h-24 w-24 p-0"
                            labelIdle='<div class="lg:mt-4 md:mt-5 sm:mt-6 mt-7">Upload Image</div>'
                            imageCropAspectRatio="1:1"
                            styleButtonRemoveItemPosition="center bottom"
                            onupdatefiles={handleFilePondUpdate}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DishUploader;
