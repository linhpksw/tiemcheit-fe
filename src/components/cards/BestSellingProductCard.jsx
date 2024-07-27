import Image from "next/image";
import Link from "next/link";
import { calculatedPrice } from "@/helpers";
import { currentCurrency } from "@/common";
import { getImagePath } from "@/utils";

const BestSellingProductCard = ({ product }) => {
	const { image, name } = product;

	const discountedPrice = calculatedPrice(product);

	return (
		<Link
			href=""
			className="overflow-hidden rounded-lg border border-default-200 p-4 transition-all duration-300 hover:border-primary"
		>
			<div className="relative divide-y divide-default-200 overflow-hidden rounded-lg">
				<div className="mx-auto mb-4">
					<Image
						src={getImagePath(image)}
						width={204}
						height={159}
						style={{ objectFit: "cover", height: "240px" }}
						className="w-full"
						alt={name}
					/>
				</div>
				<div className="pt-2">
					<h4 className="mb-2 line-clamp-1 text-xl font-semibold text-default-800">
						{name}
					</h4>
					<h6 className="text-lg font-semibold text-default-500">
						{currentCurrency}
						{discountedPrice}
					</h6>
				</div>
			</div>
		</Link>
	);
};

export default BestSellingProductCard;
