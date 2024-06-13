import { set, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuEraser, LuSave } from "react-icons/lu";
import { useState, useEffect } from "react";
import Checkbox from "@/components/Checkbox";
import {
  DateFormInput,
  SelectFormInput,
  TextAreaFormInput,
  TextFormInput,
} from "@/components";

import { getAllCategories, getAllIngredients } from "@/helpers";
import "react-quill/dist/quill.snow.css";


const EditDishForm = ({product, control,handleSubmit,onSubmit, selectedIngredients, setSelectedIngredients}) => {
  const [category, setCategory] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  useEffect(() => {
    setSelectedIngredients(selectedIngredients);
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
    fetchCategory();
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
    const idNum = Number(id);
    setIsCheck(prev => {
      let updatedCheck = [];
      if (checked) {
        updatedCheck = [...prev, idNum];
      } else {
        updatedCheck = prev.filter(item => item !== idNum);
      }
      setIsCheckAll(updatedCheck.length === selectedIngredients.length);
      return updatedCheck;
    });
  };

  const handleDeleteSelected = () => {
    const remainingIngredients = selectedIngredients.filter(ingredient => !isCheck.includes(ingredient.id));
    setSelectedIngredients(remainingIngredients);
    setIsCheck([]);
    setIsCheckAll(false);
  };

  const handleIngredientSelect = (selectedId) => {
    const selectedIngredient = ingredients.find(
      (ingredient) => ingredient.id === selectedId
    );
    if (selectedIngredient && !selectedIngredients.find((ingredient) => ingredient.id === selectedId)) {
      setSelectedIngredients((prev) => [...prev, {...selectedIngredient, isSelected: true}]);
    }
  };

  return (
    <div className="xl:col-span-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-default-200 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <TextFormInput
                name="name"
                type="text"
                label="Tên sản phẩm"
                placeholder="Tên sản phẩm"
                control={control}
                fullWidth
              />

              <SelectFormInput
                name="category"
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
                defaultValue={{
                  value: product.data.category.id,
                  label: product.data.category.name
                }}
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
                    onChange={(selectedId) => {
                      handleIngredientSelect(selectedId);
                      setSelectedIngredient(null);
                    }}
                    fullWidth
                />
                {selectedIngredients.length > 0 && (
                  <div>
                    <div className="flex flex-row justify-between">
                      <h3>Nguyên liệu đã chọn</h3>
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
                          <div>Tất cả</div>
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
      </form>
    </div>
  );
};

export default EditDishForm;
