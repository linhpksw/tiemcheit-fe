import dynamic from "next/dynamic";
import { BiFoodTag } from "react-icons/bi";
import { FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { LuEye } from "react-icons/lu";
import { kebabToTitleCase } from "@/utils";
import { calculatedPrice, getRestaurantById } from "@/helpers";
import { currentCurrency } from "@/common";
const OrderInteraction = dynamic(() => import("./OrderInteraction"));

const ProductDetailView = async ({ dish, showButtons }) => {
  console.log(dish);
  //const { name, price, review, tags, type, sale } = dish;

  // const restaurant = await getRestaurantById(restaurant_id).then(
  //   (restaurant) => restaurant
  // );
  //const discountedPrice = calculatedPrice(dish);

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-end justify-between font-medium text-default-800">
        <h4 className="text-5xl">{dish.name}</h4>
        <h3 className="text-4xl">
          {currentCurrency}
          {/* {discountedPrice}&nbsp;
          {sale && (
            <span className="ms-1 text-base text-gray-400 line-through">
              {currentCurrency}
              {price}
            </span>
          )} */}
          {dish.price}
        </h3>
      </div>

      {/* {restaurant && (
        <h5 className="mb-2 text-lg font-medium text-default-600">
          <span className="text-base font-normal text-default-500">by </span>
          {restaurant.name}
        </h5>
      )} */}

      {/* <div className="mb-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          {Array.from(new Array(Math.floor(review.stars))).map((_star, idx) => (
            <FaStar key={idx} size={18} className="text-yellow-400" />
          ))}
          {!Number.isInteger(review.stars) && (
            <FaStarHalfStroke size={18} className="text-yellow-400" />
          ))}
          {review.stars < 5 &&
            Array.from(new Array(5 - Math.ceil(review.stars))).map(
              (_val, idx) => (
                <FaStar key={idx} size={18} className="text-default-400" />
              )
            )}
        </div>
        <div className="h-4 w-px bg-default-400" />
        <h5 className="text-sm text-default-500">{review.count} Reviews</h5>
      </div> */}
      <p className="mb-4 text-sm text-default-500">
        {dish.description}
      </p>
      <div className="mb-5 flex gap-2">
        {/* <div className="flex items-center gap-2.5 rounded-full border border-default-200 px-3 py-1.5">
          <BiFoodTag
            height={16}
            width={16}
            color={
              type == "non-veg" ? "red" : type == "veg" ? "green" : "orange"
            }
          />
          <span className="text-xs">{kebabToTitleCase(type)}</span>
        </div> */}

        {/* {tags.map((tag, idx) => (
          <div
            key={tag + idx}
            className="flex items-center rounded-full border border-default-200 px-3 py-1.5"
          >
            <span className="text-xs">{tag}</span>
          </div>
        ))} */}
      </div>
      
      {dish.status != 'disabled' ? (
        dish.optionList && Array.isArray(dish.optionList) && dish.optionList.length > 0 ? (
          dish.optionList.map((option, optionId) => {
            // Sắp xếp các giá trị lựa chọn theo tên
            const sortedOptionValues = option.optionValues.sort((a, b) => a.id - b.id);
            
            return (
              <div key={optionId} className="mb-8 flex items-center gap-3">
                <h4 className="text-sm text-default-700">{option.name}</h4>
    
                {sortedOptionValues.map((value, valueId) => (
                  <div key={option.name + valueId}>
                    <input
                      type="radio"
                      name={optionId}
                      id={option.name + valueId}
                      value={value.name}
                      className="peer hidden"
                      disabled={dish.quantity === 0}
                      defaultChecked={valueId === 2} 
                    />
    
                    <label
                      htmlFor={option.name + valueId}
                      className={`flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full bg-default-200 text-center text-sm peer-checked:bg-primary peer-checked:text-white ${dish.quantity === 0 && 'opacity-50 cursor-not-allowed'}`}
                    >
                      {value.name}
                    </label>
                  </div>
                ))}
              </div>
            );
          })
        ) : null

        (dish.quantity > 0 ? (
          <div className="text-default-800 mb-1 flex flex-wrap items-end justify-between font-medium">
            <h2 className="text-2xl">
              Số lượng: {dish.quantity}
            </h2>
          </div>
        ):(
          <div className="mb-4 text-red-600 text-xl">
            Sản phẩm hiện đã hết hàng.
          </div>
        ))

        (showButtons && dish.quantity > 0 && <OrderInteraction dish={dish} />)
      ) : (
        <div className="mb-4 text-red-600 text-xl">
            Sản phẩm hiện đã ngừng kinh doanh.
        </div>
      )}
      
      <div className="mb-6">
        <h4 className="mb-4 text-lg font-medium text-default-700">
          Ingredients{" "}
          {/* <span className="text-sm text-default-400">(per serving)</span> */}
        </h4>
        <div className="rounded-lg border border-default-200 p-3">
          <div className="grid grid-cols-4 justify-center">
            {dish.ingredientList.map((ingredient, idx) => (
              <div key={ingredient.name + idx} className="text-center">
                {/* <h4 className="mb-1 text-base font-medium text-default-700">
                  {ingredient.qty}
                </h4> */}
                <h4 className="text-base text-default-700">{ingredient.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="flex items-center">
        <LuEye size={20} className="me-2 text-primary" />
        <h5 className="text-sm text-default-600">
          <span className="font-semibold text-primary">152</span>&nbsp; People
          are viewing this right now
        </h5>
      </div> */}
    </div>
  );
};

export default ProductDetailView;
