import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Popover } from '@mui/material'
import React, { memo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FiltersPopover = ({ layers, itemsFiltros, setItemsFiltros }) => {
    const [Open, setOpen] = useState(false);
    const BtnRef = useRef(null);
    const open = Boolean(Open);

    // Obtener unidades del store
    const { unidades } = useSelector((state) => state.units);
    const dispatch = useDispatch();

    const handleOpen = (event) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const LayerItem = memo(({ item, id }) => {
        return (
            <div className="text-xs">
                <Checkbox
                    onChange={() => item.onClick(id, item.label)} // Llamar a handleFilterChange cuando cambie el estado
                    checked={item.checked}
                    id={item.label}
                    style={{ padding: '0 5px 0 0' }}
                    size='small'
                />
                <label htmlFor={item.label}>{item.label}</label>
            </div>
        );
    });

    const LayerGroup = memo(({ layer }) => {
        const isActive = layer.checked === true;

        return (
            <Accordion
                key={layer.id + "-" + layer.label}
                className="Group"
                variant="standard"
                disableGutters
                disabled={!isActive}
                defaultExpanded={isActive}
                sx={{ padding: 0, '&:before': { display: 'none' } }}
            >
                <AccordionSummary
                    className="font-semibold"
                    expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />}
                    sx={{
                        minHeight: '25px',
                        padding: '0 8px',
                        '.MuiAccordionSummary-content': { margin: 0 },
                        fontSize: '13px'
                    }}
                >
                    {layer.label}
                </AccordionSummary>
                <AccordionDetails
                    className="layerGroup"
                    sx={{ padding: '4px 12px' }}
                >
                    {itemsFiltros.map((item, index) => (
                        item.id === layer.id &&
                        item.items.map((item, index) => (
                            <LayerItem key={index + "-" + item.label} item={item} id={layer.id} />
                        ))
                    ))}
                </AccordionDetails>
            </Accordion>
        );
    });

    const LayerFilter = ({ layers }) => {
        const filteredLayers = layers
            .flatMap(layer => layer.layers.filter(l => l.id === 'unidades' || l.id === 'celulares'));

        return (
            <div id="Layers" className='w-full h-full p-2 px-3 text-sm flex flex-col gap-2 select-none' onMouseEnter={handleOpen} onMouseLeave={handleClose}>
                {filteredLayers
                    .map((layer, index) => (
                        <LayerGroup key={index + "-" + layer.title} layer={layer} />
                    ))
                }
            </div>
        );
    };

    return (
        <>
            <Button
                aria-describedby="Filters"
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
                onClick={handleOpen}
                className='top-[120px] shadow-lg'
                style={{
                    backgroundColor: 'white',
                    color: 'black',
                    position: 'absolute',
                    minWidth: '30px',
                    left: '8px',
                    border: '2px solid rgba(0, 0, 0, 0.3)',
                    zIndex: 1100,
                }}
                ref={BtnRef}
            >
                <FilterAltIcon style={{
                    height: '20px',
                    width: '20px',
                }} />
            </Button>
            <Popover
                id={"Filters"}
                open={open}
                anchorEl={BtnRef.current}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                aria-hidden={!open}
                style={{ zIndex: 1000 }}
            >
                <LayerFilter layers={layers} />
            </Popover>
        </>
    )
}

export default FiltersPopover;
