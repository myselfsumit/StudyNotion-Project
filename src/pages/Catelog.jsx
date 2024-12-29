import React, { useEffect, useState } from 'react';
import Footer from '../components/common/Footer';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';

const Catalog = () => {
    const { catalogName } = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    // Fetch all categories
    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                console.log("Categories API Response:", res); // Debug log
                const category_id =
                    res?.data?.data?.find(
                        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
                    )?._id;
                setCategoryId(category_id);
            } catch (error) {
                console.error("Error fetching categories:", error); // Debug error
            }
        };
        getCategories();
    }, [catalogName]);

    // Fetch catalog data for the selected category
    useEffect(() => {
        const getCategoryDetails = async () => {
            try {
                console.log("res nikaal rha hai bhaiii ruk......")
                const res = await getCatalogaPageData(categoryId);
                console.log("Catalog Page Data:", res); // Debug log
                setCatalogPageData(res);
            } catch (error) {
                console.log("Error Bhai Yha par aa rhi hai dekh lein")
                console.error("Error fetching catalog page data:", error); // Debug error
            }
        };
        if (categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);

    return (
        <div className='text-white'>
            <div>
                <p>{`Home / Catalog / `}
                    <span>{catalogPageData?.data?.selectedCategory?.name || "Loading..."}</span>
                </p>
                <p>{catalogPageData?.data?.selectedCategory?.name || "Loading category..."}</p>
                <p>{catalogPageData?.data?.selectedCategory?.description || "No description available."}</p>
            </div>

            <div>
                {/* Section 1 */}
                <div>
                    <div>Courses to get you started</div>
                    <div className='flex gap-x-3'>
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>
                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses || []} />
                    </div>
                </div>

                {/* Section 2 */}
                <div>
                    <div>Top Courses in {catalogPageData?.data?.selectedCategory?.name || "this category"}</div>
                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses || []} />
                    </div>
                </div>

                {/* Section 3 */}
                <div>
                    <div>Frequently Bought</div>
                    <div className='py-8'>
                        <div className='grid grid-cols-1 lg:grid-cols-2'>
                            {catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course, index) => (
                                <Course_Card course={course} key={index} Height={"h-[400px]"} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Catalog;
