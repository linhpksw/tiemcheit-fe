import { useRef, useState, useEffect } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { debounce } from 'lodash';
import { getImagePath } from '@/utils';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageCrop);

const EditDishUploader = ({ setImages, handleSubmit, onSubmit, imageList }) => {
	const [files, setFiles] = useState([]);
	const [isFilesSet, setIsFilesSet] = useState(false);
	const [images, updateImages] = useState([]);

	useEffect(() => {
		if (imageList) {
			const defaultFiles = imageList.map((imageName) => ({
				source: getImagePath(imageName),
				options: {
					type: 'local',
					file: {
						name: imageName,
						type: 'image/jpeg',
					},
				},
			}));
			setFiles(defaultFiles);
			setIsFilesSet(true);
		}
	}, [imageList, isFilesSet]);

	const handleMainImageAdd = debounce((fileItems) => {
		if (fileItems === null) {
			return;
		}
		const updatedImage = fileItems.map((fileItem) => ({
			file: fileItem.file,
			metadata: fileItem.getMetadata(),
		}))[0];
		updateImages((prevImages) => {
			const newImages = [...prevImages];
			newImages[0] = updatedImage;
			return newImages;
		});
		console.log(images);
	}, 300);

	const handleOptionalImage1Add = debounce((fileItems) => {
		if (fileItems === null) {
			return;
		}
		const updatedImage = fileItems.map((fileItem) => ({
			file: fileItem.file,
			metadata: fileItem.getMetadata(),
		}))[0];
		updateImages((prevImages) => {
			const newImages = [...prevImages];
			if (newImages.length < 2) {
				newImages.splice(1, 0, updatedImage);
			} else {
				newImages[1] = updatedImage;
			}
			return newImages;
		});
		console.log(images);
	}, 300);

	const handleOptionalImage2Add = debounce((fileItems) => {
		if (fileItems === null) {
			return;
		}
		const updatedImage = fileItems.map((fileItem) => ({
			file: fileItem.file,
			metadata: fileItem.getMetadata(),
		}))[0];
		updateImages((prevImages) => {
			const newImages = [...prevImages];
			if (newImages.length < 2) {
				newImages.push(updatedImage);
			} else if (newImages.length === 2) {
				newImages.splice(2, 0, updatedImage);
			} else {
				newImages[2] = updatedImage;
			}
			return newImages;
		});
		console.log(images);
	}, 300);

	// Log images whenever it changes
	useEffect(() => {
		setImages(images);
	}, [images]);

	if (!isFilesSet) {
		return <div></div>;
	}

	return (
		<div className='rounded-lg border border-default-200 p-6'>
			<div className='mb-4 flex h-96 flex-col items-center justify-center rounded-lg border border-default-200 p-6'>
				<FilePond
					name='mainImage'
					className='h-28 w-28 md:h-56 md:w-56 lg:h-64 lg:w-64 '
					labelIdle='<div class="lg:mt-44 md:mt-36 mt-9">Upload Image</div>'
					imagePreviewHeight={350}
					imageCropAspectRatio='1:1'
					styleButtonRemoveItemPosition='center bottom'
					onaddfile={handleMainImageAdd}
					required
					files={files.length > 0 ? [files[0].source] : []}
				/>
			</div>
			<h4 className='mb-4 text-base font-medium text-default-800'>
				Additional Images <span className='text-sm text-default-600'>(Optional)</span>
			</h4>
			<div className='grid grid-cols-2 gap-6'>
				<div className='flex h-40 flex-col items-center justify-center rounded-lg border border-default-200 p-6'>
					<FilePond
						name='optionalImage1'
						className='h-24 w-24 p-0'
						labelIdle='<div class="lg:mt-8 md:mt-10 sm:mt-12 mt-14">Upload Image</div>'
						imageCropAspectRatio='1:1'
						styleButtonRemoveItemPosition='center bottom'
						onaddfile={handleOptionalImage1Add}
						files={files.length > 1 ? [files[1].source] : []}
					/>
				</div>
				<div className='flex h-40 flex-col items-center justify-center rounded-lg border border-default-200 p-6'>
					<FilePond
						name='optionalImage2'
						className='h-24 w-24 p-0'
						labelIdle='<div class="lg:mt-8 md:mt-10 sm:mt-12 mt-14">Upload Image</div>'
						imageCropAspectRatio='1:1'
						styleButtonRemoveItemPosition='center bottom'
						onaddfile={handleOptionalImage2Add}
						files={files.length > 2 ? [files[2].source] : []}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditDishUploader;
