"use client"
import { set, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuEraser, LuSave } from "react-icons/lu";
import { useState, useEffect } from "react";
import Checkbox from "@/components/Checkbox";
import { toNormalText } from "@/helpers";
import {
  DateFormInput,
  SelectFormInput,
  TextAreaFormInput,
  TextFormInput,
} from "@/components";

import { getAllCategories, getAllIngredients, getAllOptions } from "@/helpers";
import "react-quill/dist/quill.snow.css";

const EditDishForm = ({
  control,
  handleSubmit,
  onSubmit,
  selectedIngredients,
  setSelectedIngredients,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [category, setCategory] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientQuantities, setIngredientQuantities] = useState({});

  const [options, setOptions] = useState([]);
  
  const [isIngreCheckAll, setIsIngreCheckAll] = useState(false);
  const [isIngreCheck, setIsIngreCheck] = useState([]);

  const [isOptionCheckAll, setIsOptionCheckAll] = useState(false);
  const [isOptionCheck, setIsOptionCheck] = useState([]);

  // Fetch category, ingredients, and options
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const fetchedCategory = await getAllCategories();
        setCategory(fetchedCategory);
      } catch (error) {
        console.error("Failed to fetch category in add dish form: ", error);
      }
    };
    const fetchIngredients = async () => {
      try {
        const fetchedIngredients = await getAllIngredients();
        setIngredients(fetchedIngredients);
      } catch (error) {
        console.error("Failed to fetch ingredients: ", error);
      }
    };
    const fetchOption = async () => {
      try {
        const fetchedOption = await getAllOptions();
        setOptions(fetchedOption);
      } catch (error) {
        console.error("Failed to fetch option in add dish form: ", error);
      }
    };
    fetchCategory();
    fetchIngredients();
    fetchOption();
  }, []);

  const handleIngredientSelectAll = e => {
    setIsIngreCheckAll(!isIngreCheckAll);
    setIsIngreCheck(selectedIngredients.map(ingredient => ingredient.id));
    if (isIngreCheckAll) {
      setIsIngreCheck([]);
    }
  };

  const handleOptionSelectAll = e => {
    setIsOptionCheckAll(!isOptionCheckAll);
    setIsOptionCheck(selectedOptions.map(option => option.id));
    if (isOptionCheckAll) {
      setIsOptionCheck([]);
    }
  };

  const handleIngredientClick = (e) => {
    const { id, checked } = e.target;
    const idNum = Number(id);
    setIsIngreCheck(prev => {
      let updatedCheck = [];
      if (checked) {
        updatedCheck = [...prev, idNum];
      } else {
        updatedCheck = prev.filter(item => item !== idNum);
      }
      setIsIngreCheckAll(updatedCheck.length === selectedIngredients.length);
      return updatedCheck;
    });
  };

  const handleOptionClick = (e) => {
    const { id, checked } = e.target;
    const idNum = Number(id);
    setIsOptionCheck(prev => {
      let updatedCheck = [];
      if (checked) {
        updatedCheck = [...prev, idNum];
      } else {
        updatedCheck = prev.filter(item => item !== idNum);
      }
      setIsOptionCheckAll(updatedCheck.length === selectedOptions.length);
      return updatedCheck;
    });
  };

  const handleIngredientDeleteSelected = () => {
    const remainingIngredients = selectedIngredients.filter(ingredient => !isIngreCheck.includes(ingredient.id));
    setSelectedIngredients(remainingIngredients);
    setIsIngreCheck([]);
    setIsIngreCheckAll(false);
  };

  const handleOptionDeleteSelected = () => {
    const remainingOptions = selectedOptions.filter(option => !isOptionCheck.includes(option.id));
    setSelectedOptions(remainingOptions);
    setIsOptionCheck([]);
    setIsOptionCheckAll(false);
  };

  const handleIngredientQuantityChange = async (e, ingredientId) => {
    const { value } = e.target;
    setIngredientQuantities((prev) => ({
      ...prev,
      [ingredientId]: value,
    }));

    await setSelectedIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === ingredientId
          ? { ...ingredient, quantity: value }
          : ingredient
      )
    );
  };

  // Handle select element from dropdown
  const handleSelect = (selected, arr, selectedArr, setSelectedArr) => {
    const selectedElement = arr.find((element) => element.id === selected.value);

    if (selectedElement && !selectedArr.find((ele) => ele.id === selected.value)) {
       setSelectedArr((prev) => [...prev, { ...selectedElement, isSelected: true }]);
    }
  };

  
  return (
    <div className="xl:col-span-2">
      <style jsx>{`
        .scrollable {
          max-height: 167px; 
          overflow-y: auto;
        }
      `}</style>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-default-200 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <TextFormInput
                name="productname"
                type="text"
                label="Tên sản phẩm"
                placeholder="Tên sản phẩm"
                control={control}
                fullWidth
              />

              <SelectFormInput
                name="productCategory"
                label="Loại sản phẩm"
                id="product-category"
                placeholder={"Chọn..."}
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
                  name="price"
                  type="text"
                  label="Giá bán"
                  placeholder="Giá bán"
                  control={control}
                  fullWidth
                />
              </div>
              <TextFormInput
                name="quantity"
                type="text"
                label="Số lượng"
                placeholder="Số lượng"
                control={control}
                fullWidth
              />
              <TextAreaFormInput
                name="description"
                label="Mô tả"
                placeholder="Mô tả"
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
                  placeholder={"Chọn..."}
                  instanceId="ingredient-selection"
                  control={control}
                  options={
                    ingredients &&
                    ingredients.map((ing) => ({
                      value: ing.id,
                      label: ing.name,
                    }))
                  }
                  onChange={(selected) => {
                    handleSelect(selected, ingredients, selectedIngredients, setSelectedIngredients);
                    setSelectedIngredient(null);
                  }}
                  fullWidth
                />
                {selectedIngredients.length > 0 && (
                  <div>
                    <div className="flex flex-row justify-between">
                      <h3>Nguyên liệu đã chọn</h3>
                    </div>
                    <div className="space-y-2 mb-4 flex flex-col rounded-lg border border-default-200 p-6 scrollable">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="selectAll"
                            type="checkbox"
                            name="selectAll"
                            handleClick={handleIngredientSelectAll}
                            isChecked={isIngreCheckAll}
                          />
                          <div>Tất cả ({selectedIngredients.length})</div>
                        </div>
                        <button
                          type="button"
                          onClick={handleIngredientDeleteSelected}
                          className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-1.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
                        >
                          <LuEraser size={20} />
                          <span>Xóa</span>
                        </button>
                      </div>
                      <hr className="my-4 border-t border-gray-300" />
                      {selectedIngredients.map((ingredient) => (
                        <div key={`ingredient-${ingredient.id}`} className="flex items-center space-x-2 justify-between">
                          <Checkbox
                            key={`ingredient-checkbox-${ingredient.id}`}
                            type="checkbox"
                            name={toNormalText(ingredient.name)}
                            id={ingredient.id.toString()}
                            handleClick={handleIngredientClick}
                            isChecked={isIngreCheck.includes(ingredient.id)}
                          />
                          <div className="flex-1">{ingredient.name}</div>
                          <input
                            key={`ingredient-input-${ingredient.id}`}
                            type="number"
                            placeholder="Nhập định lượng"
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 w-20"
                            style={{ minWidth: '50px' }}
                            value={ingredientQuantities[ingredient.id] || ""}
                            onChange={(e) => handleIngredientQuantityChange(e, ingredient.id)}
                          />
                          <span>UIC</span>
                      </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <SelectFormInput
                  name="options"
                  label="Thêm Tùy Chọn"
                  id="new-option-selection"
                  placeholder={"Chọn..."}
                  instanceId="new-option-selection"
                  control={control}
                  options={
                    options &&
                    options.map((opt) => ({
                      value: opt.id,
                      label: opt.name,
                    }))
                  }
                  onChange={(selected) => {
                    handleSelect(selected, options, selectedOptions, setSelectedOptions);
                    setSelectedOption(null);
                  }}
                  fullWidth
                />
                {selectedOptions.length > 0 && (
                  <div>
                    <div className="flex flex-row justify-between">
                      <h3>Tuỳ chọn đã chọn</h3>
                    </div>
                    <div className="space-y-2 mb-4 flex flex-col rounded-lg border border-default-200 p-6 scrollable">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="selectAllOptions"
                            type="checkbox"
                            name="selectAllOptions"
                            handleClick={handleOptionSelectAll}
                            isChecked={isOptionCheckAll}
                          />
                          <div>Tất cả ({selectedOptions.length})</div>
                        </div>
                        <button
                          type="button"
                          onClick={handleOptionDeleteSelected}
                          className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-1.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
                        >
                          <LuEraser size={20} />
                          <span>Xóa</span>
                        </button>
                      </div>
                      <hr className="my-4 border-t border-gray-300" />
                      {selectedOptions.map((option) => (
                        <div key={`option-${option.id}`} className="flex items-center space-x-2">
                          <Checkbox
                            key={`option-checkbox-${option.id}`}
                            type="checkbox"
                            name={toNormalText(option.name)}
                            id={option.id.toString()}
                            handleClick={handleOptionClick}
                            isChecked={isOptionCheck.includes(option.id)}
                          />
                          <div>{option.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditDishForm;
