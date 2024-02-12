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
    const [limit] = useState(environment.STEP);
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

    const changeTooltipNotification = () => {
        if (tooltipRef.current) {
            if (showFilter) {
                tooltipRef.current.setAttribute('data-tooltip', 'Close tooltip');
            } else {
                tooltipRef.current.setAttribute('data-tooltip', 'Open tooltip');
            }
        }
    };

    const triggerFilter = () => {
        setShowFilter(!showFilter);
        changeTooltipNotification();
        if (!showFilter && Object.keys(filter).length > 0) {
            setHistoryList([]);
            setFilter({});
            fetchHistory();
        }
    };

    const reloadContent = () => {
        setHistoryList([]);
        setOffset(0);
        setFilter({});
        setReloadingFlag(true);
        fetchHistory();
    };

    const onOrderFinished = () => {
        reloadContent();
    };

    const loadMore = () => {
        setOffset((prev) => prev + environment.STEP);
        fetchHistory();
    };

    const fetchHistory = () => {
        setLoadingFlag(true);
        const params = { offset, limit };
        if (currentUser.admin) {
            OrderService.getAllOrders({ ...params })
                .then((response) => {
                    setNoMoreFlag(response.length < limit);
                    setLoadingFlag(false);
                    setHistoryList([...historyList, ...response]);
                })
                .catch((error) => {
                    console.error('Error fetching orders:', error);
                });
        } else {
            OrderService.getOrdersByUser({ userId: currentUser._id, ...params })
                .then((response) => {
                    setNoMoreFlag(response.length < limit);
                    setLoadingFlag(false);
                    setHistoryList([...historyList, ...response]);
                })
                .catch((error) => {
                    console.error('Error fetching orders:', error);
                });
        }
    };

    const applyFilter = (event) => {
        setHistoryList([]);
        setOffset(0);
        setFilter(event);
        setReloadingFlag(true);
        fetchHistory();
    };

    const isFiltered = () => {
        return Object.keys(filter).length > 0;
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
                {showFilter && <HistoryFilter onFilter={applyFilter} />}
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
