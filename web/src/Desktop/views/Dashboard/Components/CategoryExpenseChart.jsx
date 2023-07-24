import React, { useEffect, useState } from "react";

import Api from "../../../../Api/Endpoints";
import DoughnutChart from "../../../../Components/Chart/DoughnutChart";
import Loader from "../../../../Components/Miscellaneous/Loader";

export default function CategoryExpenseChart({ searchData }) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [parentCategories, setParentCategories] = useState(null);
    const [parentCategory, setParentCategory] = useState(null);

    useEffect(() => {
        async function getExpenseCategoriesBalance() {
            const parentCategories = await Api.getExpenseCategoriesBalance(searchData);

            const data = {};
            Object.keys(parentCategories).forEach((key) => {
                data[key] = {
                    id: parentCategories[key].id,
                    amount: parentCategories[key].amount,
                    color: parentCategories[key].color,
                };
            });

            setData(data);
            setParentCategories(parentCategories);
            setIsLoading(false);
        }
        if (!parentCategory) {
            getExpenseCategoriesBalance();
        }
    }, [searchData]);

    useEffect(() => {
        if (parentCategory) {
            const childrens = parentCategories[parentCategory]['childrens'];
            const data = {};
            Object.keys(childrens).forEach((key) => {
                data[key] = {
                    amount: childrens[key],
                    // color: childrens[key].color,
                };
            });
            setData(data);
        }
        else if (data){
            const data = {};
            Object.keys(parentCategories).forEach((key) => {
                data[key] = {
                    id: parentCategories[key].id,
                    amount: parentCategories[key].amount,
                    color: parentCategories[key].color,
                };
            });
            setData(data);
        }
    }, [parentCategory]);

    let chart = <Loader classes="w-20 mt-10" />;
    if (!isLoading) {
        chart = <DoughnutChart data={data} setParentKey={setParentCategory} />
    }

    return (
        <div>
            <div className="flex flex-col gap-x-2 p-4 bg-gray-700 rounded-3xl py-4">
                <div className="flex flex-row justify-between items-center text-white text-2xl pb-4">
                    <div className="font-bold">
                        Expense
                    </div>
                </div>
                <div className="h-64">
                    {chart}
                </div>
            </div>
        </div>
    );
}
