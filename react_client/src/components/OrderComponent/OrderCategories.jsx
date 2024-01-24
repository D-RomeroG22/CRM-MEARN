import React, { useState, useEffect } from 'react';
import { RouterPathsEnum } from '../../api/enums/routerPaths.enum.tsx';
import CategoriesService from '../../api/services/CategoriesService';
import { useNavigate } from 'react-router-dom'; // Utiliza useNavigate en lugar de useHistory

const OrderCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Utiliza useNavigate

    useEffect(() => {
        const fetchData = async () => {
            CategoriesService.getAllCategories()
                .then(response => {
                    setCategories(response);
                    setLoading(false);
                })
                .catch(errors => {
                    console.error(errors)
                })
                .finally(ev => {
                    setLoading(false);
                });
        };

        fetchData();
    }, []);

    const navigateToOrder = (categoryId) => {
        navigate(`/${RouterPathsEnum.ORDER}/${categoryId}`);
    };

    return (
        <div className="frow order-row">
            {loading ? (
                <crm-loader></crm-loader>
            ) : (
                <React.Fragment>
                    {categories.length ? (
                        categories.map((category, index) => (
                            <div key={index} className="card waves-effect pointer" onClick={() => navigateToOrder(category._id)}>
                                <div className="center">
                                    <img src={category.image} alt="imageSrc" className="responsive-img order-img" />
                                </div>
                                <div className="card-content center p10">
                                    <h5 className="m0">{category.name}</h5>
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className="center">You haven't any categories.</span>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default OrderCategories;
