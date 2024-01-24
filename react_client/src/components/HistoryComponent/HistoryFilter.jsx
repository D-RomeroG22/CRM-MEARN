import React, { useEffect, useRef } from 'react';
import MaterialService from '../../api/services/MaterialService';

function HistoryFilterComponent({ onFilter }) {
    const orderRef = useRef(null);
    const startPickerRef = useRef(null);
    const endPickerRef = useRef(null);
    let startPicker;
    let endPicker;
    let isValid = true;

    useEffect(() => {
        startPicker = MaterialService.initDatePicker(startPickerRef.current, validate);
        endPicker = MaterialService.initDatePicker(endPickerRef.current, validate);

        return () => {
            if (startPicker) {
                startPicker.destroy();
            }
            if (endPicker) {
                endPicker.destroy();
            }
        };
    }, []);

    const submitFilter = () => {
        const actualFilter = {};

        if (orderRef.current.value) {
            actualFilter.order = parseInt(orderRef.current.value, 10);
        }
        if (startPicker && startPicker.date) {
            actualFilter.start = startPicker.date;
        }
        if (endPicker && endPicker.date) {
            actualFilter.end = endPicker.date;
        }
        onFilter(actualFilter);
    };

    const validate = () => {
        if (!startPicker.date || !endPicker.date) {
            isValid = true;
            return;
        }
        isValid = startPicker.date < endPicker.date;
    };

    return (
        <div className="filter">
            <div className="fr">
                <div className="col order">
                    <div className="input-field inline order-option-input">
                        <input
                            type="number"
                            id="number"
                            min="1"
                            ref={orderRef}
                        />
                        <label htmlFor="number">Order number</label>
                    </div>
                </div>
                <div className="col filter-pickers">
                    <div className="input-field">
                        <input type="text" ref={startPickerRef} />
                        <label>Start</label>
                    </div>
                    <div className="input-field">
                        <input type="text" ref={endPickerRef} />
                        <label>End</label>
                    </div>
                </div>
            </div>
            {!isValid && (
                <span className="center red-text helper-text">
                    Invalid filter dates!
                </span>
            )}
            <br />
            <button
                onClick={submitFilter}
                className="btn waves-effect wavers-light btn-small"
                disabled={!isValid}
            >
                Apply filter
            </button>
        </div>
    );
}

export default HistoryFilterComponent;
