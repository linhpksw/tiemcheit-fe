"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactQuill from "react-quill";
import { LuEraser, LuSave } from "react-icons/lu";
import { useState, useEffect } from "react";
import {
  DateFormInput,
  SelectFormInput,
  TextAreaFormInput,
  TextFormInput,
} from "@/components";

import { addProduct, getAllCategories, getAllIngredients } from "@/helpers";
//style
import "react-quill/dist/quill.snow.css";

const credentialsManagementFormSchema = yup.object({
  productname: yup.string().required("Please enter your product name"),
  productCatagory: yup.string().required("Please select your product category"),
  sellingPrice: yup.number().required("Please enter your selling price"),
  quantity: yup.number().required("Please enter your quantity"),
  description: yup.string().required("Please enter your description"),
  saleStartDate: yup.string().required("Please select Sale Start Date"),
  saleEndDate: yup.string().required("Please select Sale End Date"),
  ingredients: yup.array().min(1, "Please select at least one ingredient"),

});

const AddDishForm = () => {
  let valueSnow = "";
  valueSnow = `<h5><span class="ql-size-large">Add a long description for your product</span></h5>`;

  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [isEndDateVisible, setIsEndDateVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleDiscountCheckboxChange = (e) => {
    setIsDiscountVisible(e.target.checked);
  };
  const handleEndDateCheckboxChange = (e) => {
    setIsEndDateVisible(e.target.checked);
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(credentialsManagementFormSchema),
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const fetchedCategory = await getAllCategories();
        setCategory(fetchedCategory);
      } catch (error) {
        console.error("Failed to fetch category in add dish form: ", error);
      }
    };
    fetchCategory();
  }, []);

  // Fetch ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const fetchedIngredients = await getAllIngredients();
        setIngredients(fetchedIngredients);
      } catch (error) {
        console.error("Failed to fetch ingredients: ", error);
      }
    };
    fetchIngredients();
  }, []);

  // Form submission handler
  const onSubmit = async (data) => {
    data.description = description;
    data.ingredients = selectedIngredients;
    try {
      const response = await addProduct(data);

      if (response.ok) {
        console.log("Success added");
        reset(); // Reset the form
        setSelectedIngredients([]); // Clear selected ingredients
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle ingredient selection
  const handleIngredientSelect = (selectedId) => {
    console.log("Selected ingredients: ", selectedIngredients);
    const selectedIngredient = ingredients.find(
        (ingredient) => ingredient.id === selectedId
    );
    
    if (
        selectedIngredient &&
        !selectedIngredients.find((ingredient) => ingredient.id === selectedId)
    ) {
        setSelectedIngredients((prev) => [...prev, selectedIngredient]);
    }
  };
  
  // Handle ingredient removal
  const handleIngredientRemove = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.filter((ing) => ing.id !== ingredient.id)
    );
  };

  return (
    <div className="xl:col-span-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                name="productCatagory"
                label="Product Category"
                id="product-category"
                instanceId="product-category"
                control={control}
                options={
                  category &&
                  category.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))
                }
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
              <div className="space-y-4">
                <SelectFormInput
                    name="ingredients"
                    label="Chọn Nguyên Liệu"
                    id="ingredient-selection"
                    instanceId="ingredient-selection"
                    control={control}
                    options={
                        ingredients &&
                        ingredients.map((ing) => ({
                            value: ing.id,
                            label: ing.name,
                        }))
                    }
                    onChange={(selectedId) => handleIngredientSelect(selectedId)}
                    fullWidth
                />
                {selectedIngredients.length > 0 && (
                    <div className="space-y-2">
                      <h3>Selected Ingredients</h3>
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedIngredients.map((ingredient) => (
                            <tr key={ingredient.id}>
                              <td className="px-4 py-2">{ingredient.name}</td>
                              <td className="px-4 py-2">
                                <button
                                  type="button"
                                  onClick={() => handleIngredientRemove(ingredient)}
                                  className="text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>

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
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
              >
                <LuEraser size={20} />
                Clear
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

export default AddDishForm;
