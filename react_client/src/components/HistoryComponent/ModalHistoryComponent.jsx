import React from 'react';
import calculateTotalCost from '../../utils/calculateTotalCost';

function ModalComponent({ isModalOpen, selectedOrder, isAdmin, finishOrder, closeModal }) {
    return (
        <>
            <div style={
                    isModalOpen
                        ? { zIndex: '1003', display: 'block', opacity: 1, top: '10%', transform: 'scaleX(1) scaleY(1)' }
                        : { zIndex: '1003', display: 'none', opacity: 0, top: '4%', transform: 'scaleX(0.8) scaleY(0.8)'}
                } className={isModalOpen ? 'modal modal-fixed-footer open' : 'modal modal-fixed-footer'}>
                <div className="modal-content">
                    <h4 className="mb1">Pedido №{selectedOrder?.order}</h4>
                    <table className="highlight">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder?.list.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="order-summary">
                        <p>Total: ${selectedOrder ? calculateTotalCost(selectedOrder) : 0}</p>
                    </div>
                </div>
                <div className="modal-footer">
                    {isAdmin && selectedOrder?.status === 'Pending' && (
                        <button
                            onClick={finishOrder}
                            className="modal-action waves-effect waves-black btn-flat"
                        >
                            Finalizar
                        </button>
                    )}
                    <button
                        onClick={closeModal}
                        className="modal-action waves-effect waves-black btn-flat"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
            <div className={"modal-overlay"} style={{ zIndex: "1002", display: 'block', opacity: '0.5', }}></div>
        </>
    );
}

export default ModalComponent;
