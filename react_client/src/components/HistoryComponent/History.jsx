import React, { useEffect, useRef, useState } from 'react';
import HistoryFilter from './HistoryFilter';
import HistoryList from './HistoryList';
import { environment } from '../../enviroments/environment';
import { Subject } from 'rxjs';
import OrderService from '../../api/services/OrderService';
import AuthService from '../../api/services/AuthService';
import LoaderComponent from '../LoaderComponent';
import './styles.css'

function HistoryComponent() {
    const [showFilter, setShowFilter] = useState(false);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(environment.STEP);
    const [historyList, setHistoryList] = useState([]);
    const [loadingFlag, setLoadingFlag] = useState(false);
    const [reloadingFlag, setReloadingFlag] = useState(false);
    const [noMoreFlag, setNoMoreFlag] = useState(false);
    const [filter, setFilter] = useState({});
    const [isAlive] = useState(new Subject());
    const tooltipRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        fetchHistory();
        return () => isAlive.next();
    }, [offset, limit]);

    const reloadContent = () => {
        setHistoryList(prev => prev = []);
        setOffset(prev => prev = 0);
        setLimit(prev => prev = 2)
        setFilter(prev => prev = {});
        fetchHistory();
    };

    const onOrderFinished = () => {
        reloadContent();
    };

    const loadMore = () => {
        setLimit((prev) => prev + environment.STEP);
        fetchHistory();
    };

    const fetchHistory = () => {
        setReloadingFlag(true);
        setLoadingFlag(true);
        const params = { offset, limit };
        if (currentUser.admin) {
            OrderService.getAllOrders({ ...params })
                .then((response) => {
                    setNoMoreFlag(response.length < limit);
                    setReloadingFlag(false);
                    setLoadingFlag(false);
                    setHistoryList([...response]);
                })
                .catch((error) => {
                    setReloadingFlag(false);
                    setLoadingFlag(false);
                    console.error('Error fetching orders:', error);
                });
        } else {
            OrderService.getOrdersByUser({ userId: currentUser._id, ...params })
                .then((response) => {
                    setNoMoreFlag(response.length < limit);
                    setReloadingFlag(false);
                    setLoadingFlag(false);
                    setHistoryList([...response]);
                })
                .catch((error) => {
                    setReloadingFlag(false);
                    setLoadingFlag(false);
                    console.error('Error fetching orders:', error);
                });
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <main className="content">
                <div className="page-title">
                    <h4>Historial de Pedidos</h4>
                    <button
                        onClick={reloadContent}
                        className="btn btn-small"
                        disabled={reloadingFlag}
                        data-tooltip="Recargar"
                    >
                        <i className="material-icons">refresh</i>
                    </button>
                </div>
                {showFilter && <HistoryFilter />}
                <div className="card">
                    <div className="card-content">
                        {loadingFlag ? (
                            <LoaderComponent />
                        ) : (
                            <>
                                {historyList.length ? (
                                    <HistoryList
                                        historyList={historyList}
                                        orderFinished={onOrderFinished}
                                        openModal={openModal}
                                        closeModal={closeModal}
                                        isModalOpen={isModalOpen}
                                        setSelectedOrder={setSelectedOrder}
                                    />
                                ) : (
                                    <div className="center">No hay pedidos</div>
                                )}
                                <div className="center mb2" style={{ display: noMoreFlag ? 'none' : 'block' }}>
                                    <button
                                        disabled={noMoreFlag}
                                        onClick={loadMore}
                                        className="btn waves-effect grey darken-1 btn-small"
                                    >
                                        Cargar más
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

export default HistoryComponent;
