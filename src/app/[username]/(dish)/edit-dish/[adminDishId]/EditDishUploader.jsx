  import { useRef, useState, useEffect } from "react";
  import { FilePond, registerPlugin } from "react-filepond";
  import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
  import FilePondPluginImagePreview from "filepond-plugin-image-preview";
  import FilePondPluginImageCrop from "filepond-plugin-image-crop";
  import "filepond/dist/filepond.min.css";
  import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
  import { debounce } from "lodash";
  import { getImagePath } from "@/utils";

  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop
  );

  const EditDishUploader = ({ setImages, handleSubmit, onSubmit, imageList }) => {
    const [files, setFiles] = useState([]);
    const [isFilesSet, setIsFilesSet] = useState(false);

    useEffect(() => {
      if (imageList) {
        const defaultFiles = imageList.map((imageName) => ({
          source: getImagePath(imageName),
          options: {
            type: "local",
            file: {
              name: imageName,
              type: "image/jpeg",
            },
          },
        }));
        setFiles(defaultFiles);
        setIsFilesSet(true);
      }
    }, [imageList, isFilesSet]);

    const handleFilePondUpdate = debounce((fileItems) => {
      const updatedImages = fileItems.map((fileItem) => ({
        file: fileItem.file,
        metadata: fileItem.getMetadata(),
      }));
      if (fileItems !== null) {
        setImages((prevImages) => [...prevImages, ...updatedImages]);
      }
    }, 300);

    if (!isFilesSet) {
      return <div></div>;
    }

    return (
      <div className="rounded-lg border border-default-200 p-6">
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
          <div className="mb-4 flex h-96 flex-col items-center justify-center rounded-lg border border-default-200 p-6">
            <FilePond
              name="mainImage"
              className="h-28 w-28 md:h-56 md:w-56 lg:h-64 lg:w-64 "
              labelIdle='<div class="lg:mt-44 md:mt-36 mt-9">Upload Image</div>'
              imagePreviewHeight={350}
              imageCropAspectRatio="1:1"
              styleButtonRemoveItemPosition="center bottom"
              onupdatefiles={handleFilePondUpdate}
              required
              files={files.length > 0 ? [files[0].source] : []}
            />
          </div>
          <h4 className="mb-4 text-base font-medium text-default-800">
            Additional Images{" "}
            <span className="text-sm text-default-600">(Optional)</span>
          </h4>
          <div className="grid grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex h-40 flex-col items-center justify-center rounded-lg border border-default-200 p-6">
                <FilePond
                  id={`${index}`}
                  name="optionalImage"
                  className="h-24 w-24 p-0"
                  labelIdle='<div class="lg:mt-8 md:mt-10 sm:mt-12 mt-14">Upload Image</div>'
                  imageCropAspectRatio="1:1"
                  styleButtonRemoveItemPosition="center bottom"
                  onupdatefiles={handleFilePondUpdate}
                  files={files.length > index + 1 ? [files[index + 1].source] : []}
                />
              </div>
            ))}
          </div>
        {/* </form> */}
      </div>
    );
  };

  export default EditDishUploader;
