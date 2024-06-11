"use client";
import { set, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactQuill from "react-quill";
import { LuEraser, LuSave } from "react-icons/lu";
import { useState, useEffect } from "react";
import Checkbox from "@/components/Checkbox";
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
  productCategory: yup.string().required("Please select your product category"),
  sellingPrice: yup.number().required("Please enter your selling price"),
  quantity: yup.number().required("Please enter your quantity"),
  description: yup.string().required("Please enter your description"),
  ingredients: yup.array().min(1, "Please select at least one ingredient"),
});

const AddDishForm = () => {
  let valueSnow = "";
  valueSnow = `<h5><span class="ql-size-large">Add a long description for your product</span></h5>`;

  const [category, setCategory] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

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

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(selectedIngredients.map(ingredient => ingredient.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck(prev => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter(item => item !== id);
      }
    });
  };

  const handleDeleteSelected = () => {
    const remainingIngredients = selectedIngredients.filter(ingredient => !isCheck.includes(ingredient.id));
    setSelectedIngredients(remainingIngredients);
    setIsCheck([]); // Clear the checked items
    setIsCheckAll(false); // Uncheck the "Select All" checkbox
    setSelectedIngredient(null); // Reset SelectFormInput
  };


  // Handle ingredient selection
  const handleIngredientSelect = (selectedId) => {
    const selectedIngredient = ingredients.find(
      (ingredient) => ingredient.id === selectedId
    );
    setSelectedIngredient(selectedIngredient);
    if (
      selectedIngredient &&
      !selectedIngredients.find((ingredient) => ingredient.id === selectedId)
    ) {
      setSelectedIngredients((prev) => [...prev, {...selectedIngredient, isSelected: true}]);
    }
  };
  

  //form submit
  const onSubmit = async (data) => {
    try {
      const response = await addProduct(data);
      if (response !== null) {
        console.log("Success added");
        reset(); 
        setSelectedIngredients([]); 
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
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
                name="productCategory"
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
                    value={selectedIngredient}
                    onChange={(selectedId) => {
                      handleIngredientSelect(selectedId);
                      setSelectedIngredient(null); 
                    }}
                    fullWidth
                />
                {selectedIngredients.length > 0 && (
                  <div > 
                    <div className=" flex flex-row justify-between ">
                      <h3>Selected Ingredients</h3>
                    </div>
                    <div className="space-y-2 mb-4 flex flex-col rounded-lg border border-default-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="selectAll"
                            type="checkbox"
                            name="selectAll"
                            handleClick={handleSelectAll}
                            isChecked={isCheckAll}
                          />
                          <div>Select All</div>
                        </div>
                        <button
                          type="button"
                           onClick={handleDeleteSelected}
                          className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-1.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
                        >
                          <LuEraser size={20} />
                          <span>Xóa</span>
                        </button>
                      </div>
                      <hr className="my-4 border-t border-gray-300" />
                          {selectedIngredients.map((ingredient) => (
                            <div key={ingredient.id} className="flex items-center space-x-2">
                              <Checkbox
                                key={ingredient.id}
                                type="checkbox"
                                name={ingredient.name}
                                id={ingredient.id}
                                handleClick={handleClick}
                                isChecked={isCheck.includes(ingredient.id)}
                              />
                              <div>{ingredient.name}</div>
                            </div>
                          ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-wrap items-center justify-end gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="reset"
                onClick={() => {reset();
                  setSelectedIngredients([]); 
                  setIsCheckAll(false);
                  }}
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
