"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactQuill from "react-quill";
import { LuEraser, LuSave, LuUndo } from "react-icons/lu";
import { useState } from "react";
import {
  DateFormInput,
  SelectFormInput,
  TextAreaFormInput,
  TextFormInput,
} from "@/components";

//style
import "react-quill/dist/quill.snow.css";

const EditDishForm = () => {
  let valueSnow = "";
  valueSnow = `<h5><span class="ql-size-large">Mexican burritos are usually made with a wheat tortilla and contain grilled meat, cheese toppings</span></h5>`;

  const editDishFormSchema = yup.object({
    productname: yup.string().required("Please enter your product name"),
    productCategory: yup
      .string()
      .required("Please select your product category"),
    sellingPrice: yup.number().required("Please enter your selling price"),
    quantity: yup.number().required("Please enter your quantity"),
    description: yup.string().required("Please enter your description"),
    saleStartDate: yup.string().required("Please select Sale Start Date"),
    saleEndDate: yup.string().required("Please select Sale End Date"),
  });

  const defaultValue = {
    productname: "Burrito Bowl",
    productCategory: "Mexican",
    sellingPrice: 45,
    quantity: 80,
    description:
      "Mexican burritos are usually made with a wheat tortilla and contain grilled meat, cheese toppings, and fresh vegetables which are sources of vitamins, proteins, fibers, minerals, and antioxidants.",
    saleStartDate: "",
    saleEndDate: "",
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(editDishFormSchema),
    defaultValues: defaultValue,
  });

  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [isEndDateVisible, setIsEndDateVisible] = useState(false);

  const handleDiscountCheckboxChange = (e) => {
    setIsDiscountVisible(e.target.checked);
  };

  const handleEndDateCheckboxChange = (e) => {
    setIsEndDateVisible(e.target.checked);
  };

  const undoChanges = () => {
    reset(defaultValue);
  };

  return (
    <div className="xl:col-span-2">
      <form onSubmit={handleSubmit(() => {})} className="space-y-6">
        <div className="rounded-lg border border-default-200 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <TextFormInput
                name="productname"
                type="text"
                label="Product Name"
                placeholder="Product Name"
                control={control}
                fullWidth
              />

              <SelectFormInput
                name="productCategory"
                label="Product Category"
                id="product-category"
                instanceId="product-category"
                control={control}
                options={[
                  { value: "Italian", label: "Italian" },
                  { value: "BBQ", label: "BBQ" },
                  { value: "Mexican", label: "Mexican" },
                ]}
                fullWidth
              />
              <div className="grid gap-6 lg:grid-cols-2">
                <TextFormInput
                  name="sellingPrice"
                  type="text"
                  label="Selling Price"
                  placeholder="Selling Price"
                  control={control}
                  fullWidth
                />
              </div>
              <TextFormInput
                name="quantity"
                type="text"
                label="Quantity"
                placeholder="Quantity in Stock"
                control={control}
                fullWidth
              />
              <TextAreaFormInput
                name="description"
                label="Description"
                placeholder="Description"
                rows={5}
                control={control}
                fullWidth
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <label
                  className="block text-sm text-default-600"
                  htmlFor="addDiscount"
                >
                  Add Discount
                </label>
                <input
                  type="checkbox"
                  id="addDiscount"
                  className="relative h-7 w-[3.25rem] cursor-pointer appearance-none rounded-full border-2 border-transparent bg-default-200 transition-colors duration-200 ease-in-out before:inline-block before:h-6 before:w-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:transition before:duration-200 before:ease-in-out checked:!bg-primary checked:bg-none checked:before:translate-x-full focus:ring-0 focus:ring-transparent"
                  onChange={handleDiscountCheckboxChange}
                />
              </div>
              {isDiscountVisible && (
                <>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <TextFormInput
                        name="discount"
                        type="text"
                        placeholder="Discount"
                        control={control}
                        className={"w-4/5"}
                        fullWidth={false}
                      />
                    </div>
                    <div className="flex items-center gap-5">
                      <label
                        className="block text-sm text-default-600"
                        htmlFor="hasEndDate"
                      >
                        End Date
                      </label>
                      <input
                        type="checkbox"
                        id="hasEndDate"
                        className="relative h-7 w-[3.25rem] cursor-pointer appearance-none rounded-full border-2 border-transparent bg-default-200 transition-colors duration-200 ease-in-out before:inline-block before:h-6 before:w-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:transition before:duration-200 before:ease-in-out checked:!bg-primary checked:bg-none checked:before:translate-x-full focus:ring-0 focus:ring-transparent"
                        onChange={handleEndDateCheckboxChange}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <div className="w-1/2">
                      <DateFormInput
                        name="saleStartDate"
                        type="date"
                        label="Start Date"
                        className="block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50"
                        placeholder="Start Date"
                        options={{
                          dateFormat: "d/m/Y",
                          enableTime: true,
                        }}
                        fullWidth
                        control={control}
                      />
                    </div>
                    {isEndDateVisible && (
                      <div className="w-1/2">
                        <DateFormInput
                          name="saleEndDate"
                          type="date"
                          label="End Date"
                          className="block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50"
                          placeholder="End Date"
                          options={{
                            dateFormat: "d/m/Y",
                            enableTime: true,
                          }}
                          fullWidth
                          control={control}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-wrap items-center justify-end gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="reset"
                onClick={undoChanges}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
              >
                <LuUndo size={20} />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500"
              >
                <LuSave size={20} />
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditDishForm;
