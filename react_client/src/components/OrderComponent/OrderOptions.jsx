import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OrderService from '../../api/services/OrderService';
import OptionsService from '../../api/services/OptionsService';
import MaterialService from '../../api/services/MaterialService.jsx';

const OrderOptions = () => {
    const { id } = useParams();
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const optionsData = await OptionsService.getAllOptions(id);
                const optionsWithQuantity = optionsData.map((p) => ({ ...p, quantity: 1 }));
                setOptions(optionsWithQuantity);
                setLoading(false);
            } catch (error) {
                MaterialService.toast('Could not retrieve options.');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const addToOrder = (option) => {
        MaterialService.toast(`Option ${option.name} x${option.quantity} is added.`);
        OrderService.add(option);
    };

    return (
        <main>
            <table className="highlight">
                {loading ? (
                    <crm-loader></crm-loader>
                ) : (
                    <tbody>
                        {options.length ? (
                            options.map((option) => (
                                <tr key={option._id}>
                                    <td>{option.name}</td>
                                    <td>{option.cost} $</td>
                                    <td>
                                        <div className="input-field inline order-option-input">
                                            <input value={option.quantity} onChange={(e) => setOptions(options.map((o) => (o._id === option._id ? { ...o, quantity: e.target.value } : o)))} type="number" min="0" />
                                        </div>
                                    </td>
                                    <td>
                                        <button disabled={!option.quantity} onClick={() => addToOrder(option)} className="btn waves-effect wavers-light btn-small">Add</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <span className="valign-wrapper">
                                <i className="material-icons">do_not_disturb_alt</i>No options
                            </span>
                        )}
                    </tbody>
                )}
            </table>
        </main>
    );
};

export default OrderOptions;
