import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleCloseToast, setExpandedClusters } from '../../redux/slices/toastsSlice';
import { Alert, AlertTitle, Button, Badge } from '@mui/material';

const ToastComponent = () => {
    const dispatch = useDispatch();
    const { toasts, expandedClusters } = useSelector((state) => state.toasts);


    const closeToast = (id) => {
        dispatch(handleCloseToast(id));
    };

    // Agrupa las alertas por cluster
    const groupedToasts = useMemo(() => {
        return toasts.reduce((groups, toast) => {
            const clusterValue = toast.cluster || 'default';
            if (!groups[clusterValue]) {
                groups[clusterValue] = [];
            }
            groups[clusterValue].push(toast);
            return groups;
        }, {});
    }, [toasts]);

    // Agrupa las alertas repetidas por título y mensaje
    const getUniqueToastsWithCount = (toasts) => {
        return toasts.reduce((acc, toast) => {
            const existingToastIndex = acc.findIndex(
                (item) => item.title === toast.title && item.message === toast.message
            );
            if (existingToastIndex !== -1) {
                acc[existingToastIndex].count += 1;
            } else {
                acc.push({ ...toast, count: 1 });
            }
            return acc;
        }, []);
    };

    useEffect(() => {
        const timers = toasts.map((toast) => {
            if (toast.duration !== null) {
                return setTimeout(() => closeToast(toast.id), toast.duration);
            }
            return null;
        });

        return () => {
            timers.forEach((timer) => {
                if (timer !== null) {
                    clearTimeout(timer);
                }
            });
        };
    }, [toasts]);

    const toggleCluster = (clusterKey) => {
        dispatch(setExpandedClusters({
            ...expandedClusters,
            [clusterKey]: !expandedClusters[clusterKey],
        }));
    };

    return (
        <>
            <div className='flex flex-col items-end gap-3 fixed top-0 right-0 z-[1000] max-h-[65%] overflow-y-auto overflow-x-visible p-3'>
                {groupedToasts && Object.keys(groupedToasts).map((clusterKey) => {
                    const group = groupedToasts[clusterKey];
                    const clusterSize = group.length;
                    const isExpanded = expandedClusters[clusterKey];

                    const uniqueToasts = getUniqueToastsWithCount(group);

                    if (clusterSize >= 5 && clusterKey !== 'default') {
                        return (
                            <div key={clusterKey} style={{ marginBottom: '10px' }}>
                                {!isExpanded ? (
                                    <Alert
                                        severity="warning"
                                        onClose={() => {
                                            group.forEach(toast => closeToast(toast.id));
                                        }}
                                    >
                                        <AlertTitle>Cluster {clusterKey} - {clusterSize} alertas</AlertTitle>
                                        {uniqueToasts.slice(0, 4).map((toast) => (
                                            <div key={toast.id}>
                                                {toast.title}: {toast.message}
                                            </div>
                                        ))}
                                        {group.length > 5 && <div className='w-full text-right font-bold'>...</div>}
                                        <div className='flex w-full justify-end'>
                                            <Button
                                                size="small"
                                                onClick={() => toggleCluster(clusterKey)}
                                            >
                                                Desplegar
                                            </Button>
                                        </div>
                                    </Alert>
                                ) : (
                                    <div>
                                        {uniqueToasts.map((toast) => (
                                            <div key={toast.id} className='flex justify-end'>
                                                <Badge
                                                    badgeContent={toast.count > 1 ? toast.count : 0}
                                                    color="primary"
                                                    anchorOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <Alert
                                                        onClick={toast.onClick}
                                                        onClose={(event) => {
                                                            event.stopPropagation();
                                                            toast.onClose();
                                                            closeToast(toast.id);
                                                        }}
                                                        severity={toast.type}
                                                        sx={{ width: 'max-content', marginBottom: '5px' }}
                                                    >
                                                        {toast.title ? (
                                                            <AlertTitle>{toast.title}</AlertTitle>
                                                        ) : (
                                                            <AlertTitle>{toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}</AlertTitle>
                                                        )}
                                                        {toast.message}
                                                        {toast.cluster === 'vigilancia' && (
                                                            <div className='w-full flex justify-end gap-1 mt-1'>
                                                                <Button size="small" variant="outlined" onClick={toast.followArea} sx={{ fontSize: '0.7rem', padding: '2px 6px' }}>Ver Área</Button>
                                                                <Button size="small" variant="contained" onClick={toast.followPoint} sx={{ fontSize: '0.7rem', padding: '2px 6px' }}>Ver punto</Button>
                                                            </div>
                                                        )}
                                                    </Alert>
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    } else {
                        return uniqueToasts.map((toast) => (
                            <div key={toast.id} className='flex justify-end'>
                                <Badge
                                    key={toast.id}
                                    badgeContent={toast.count > 1 ? toast.count : 0}
                                    color="primary"
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    <Alert
                                        onClick={toast.onClick}
                                        onClose={(event) => {
                                            event.stopPropagation();
                                            toast.onClose();
                                            closeToast(toast.id);
                                        }}
                                        severity={toast.type}
                                        sx={{ width: 'max-content', marginBottom: '5px' }}
                                    >
                                        {toast.title ? (
                                            <AlertTitle>{toast.title}</AlertTitle>
                                        ) : (
                                            <AlertTitle>{toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}</AlertTitle>
                                        )}
                                        {toast.message}
                                        {toast.cluster === 'vigilancia' && (
                                            <div className='w-full flex justify-end gap-1 mt-1'>
                                                <Button size="small" variant="outlined" onClick={toast.followArea}sx={{ fontSize: '0.7rem', padding: '2px 6px' }}>Ver Área</Button>
                                                <Button size="small" variant="contained" onClick={toast.followPoint} sx={{ fontSize: '0.7rem', padding: '2px 6px' }}>Ver punto</Button>
                                            </div>
                                        )}

                                    </Alert>
                                </Badge>
                            </div>
                        ));
                    }
                })}
            </div>

            {/* Botón Ocultar justo debajo del div con scroll */}
            {expandedClusters && Object.keys(expandedClusters).map((clusterKey) => {
                const maxPercentage = 0.65;
                const maxHeight = window.innerHeight * maxPercentage;
                const currentHeight = groupedToasts[clusterKey] && groupedToasts[clusterKey].length ? groupedToasts[clusterKey].length * 77 : 0;

                // Calcula el valor final para la propiedad `top`, asegurándote de no sobrepasar el 70%
                const topValue = currentHeight > maxHeight ? `${maxHeight + 20}px` : `${currentHeight}px`;

                return (
                    expandedClusters[clusterKey] && groupedToasts[clusterKey] && groupedToasts[clusterKey].length >= 5 && (
                        <div
                            key={clusterKey}
                            className='absolute right-3 z-[1001]'
                            style={{ top: topValue }}
                        >
                            <Button
                                size="small"
                                onClick={() => toggleCluster(clusterKey)}
                                color="primary"
                                variant="contained"
                            >
                                Ocultar
                            </Button>
                        </div>
                    )
                );
            })}
        </>
    );
};

export default ToastComponent;
