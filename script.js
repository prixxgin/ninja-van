document.addEventListener('DOMContentLoaded', function() {
    function getSelectedValue(name) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : '';
    }

    // Lookup table simulating Definition!I:I and Definition!J:J
    const lookupTable = [
        { key: 'Social Media ID', value: 'Restock Service Offering' },
        { key: 'Freight', value: 'Freight' },
        { key: 'Core Standard FMLM', value: 'Restock Standard Parcel' },
        { key: 'Core Standard LM', value: 'Restock Standard Parcel' },
        { key: 'LTL Standard FMLM', value: 'Restock Standard LTL' },
        { key: 'LTL Standard LM', value: 'Restock Standard LTL' },
        { key: 'Core Economy FMLM', value: 'Restock Economy Parcel' },
        { key: 'Core Economy LM', value: 'Restock Economy Parcel' },
        { key: 'LTL Economy FMLM', value: 'Restock Economy LTL' },
        { key: 'LTL Economy FM', value: 'Restock Economy LTL' },
        { key: 'LTL Economy LM', value: 'Restock Economy LTL' },
        { key: 'Modern Trade SLA FMLM', value: 'Restock Modern Trade' },
        { key: 'Modern Trade SLA LM', value: 'Restock Modern Trade' },
        { key: 'Modern Trade Economy FMLM', value: 'Restock Modern Trade' },
        { key: 'Modern Trade Economy LM', value: 'Restock Modern Trade' },
        { key: 'Modern Trade FDS FMLM', value: 'Restock Modern Trade' },
        { key: 'Modern Trade FDS LM', value: 'Restock Modern Trade' }
    ];

    function xlookup(key) {
        const found = lookupTable.find(row => row.key === key);
        return found ? found.value : '';
    }

    function evaluateCombo() {
        const sellingModel = getSelectedValue('sellingModel');
        const distributionType = getSelectedValue('distributionType');
        const sla = getSelectedValue('sla');
        const parcelProfile = getSelectedValue('parcelProfile');
        const pickup = getSelectedValue('pickup');
        const lastMile = getSelectedValue('lastMile');
        const deliveryPoints = getSelectedValue('deliveryPoints');
        let result = '';

        // Excel logic implementation
        if (!sellingModel) {
            result = 'please complete all fields';
        } else if (sellingModel === '1P') {
            if (!sla || !parcelProfile || !pickup || !lastMile) {
                result = 'please complete all fields';
            } else if (sla === 'Fixed Delivery Schedule') {
                result = 'not available';
            } else if (sla === 'Economy' && pickup === 'Client to bring to CBY' && lastMile === 'Client pickup at NV WH') {
                result = 'Freight';
            } else if ((sla === 'Standard' || sla === 'Fixed Delivery Schedule') && pickup === 'Client to bring to CBY' && lastMile === 'Client pickup at NV WH') {
                result = 'Freight auto Economy';
            } else if (sla === 'Economy') {
                if (parcelProfile === 'Mostly smaller than 100kg per TID') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'Core Economy FMLM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'Core Economy LM';
                    } else if (pickup === 'NV pickup at Client WH' && lastMile === 'Client pickup at NV WH') {
                        result = 'explore >=100kg';
                    }
                } else if (parcelProfile === 'Mostly >=100kg per TID') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'LTL Economy FMLM';
                    } else if (pickup === 'NV pickup at Client WH' && lastMile === 'Client pickup at NV WH') {
                        result = 'LTL Economy FM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'LTL Economy LM';
                    }
                }
            } else if (sla === 'Standard') {
                if (parcelProfile === 'Mostly smaller than 100kg per TID') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'Core Standard FMLM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'Core Standard LM';
                    } else {
                        result = 'delivery required for Standard';
                    }
                } else if (parcelProfile === 'Mostly >=100kg per TID') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'LTL Standard FMLM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'LTL Standard LM';
                    } else {
                        result = 'delivery required for Standard';
                    }
                }
            }
        } else if (sellingModel === '3P') {
            if (!distributionType || !sla || !parcelProfile || !pickup || !lastMile || !deliveryPoints) {
                result = 'please complete all fields';
            } else if (distributionType === 'Outright') {
                if (sla === 'Standard') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade SLA FMLM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade SLA LM';
                    } else {
                        result = 'delivery required for Modern Trade';
                    }
                } else if (sla === 'Economy') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade Economy FMLM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade Economy LM';
                    } else {
                        result = 'delivery required for Modern Trade';
                    }
                } else if (sla === 'Fixed Delivery Schedule') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade FDS FMLM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade FDS LM';
                    } else {
                        result = 'delivery required for Modern Trade';
                    }
                }
            } else if (distributionType === 'Consignment' && deliveryPoints === 'Listed Delivery Point') {
                if (sla === 'Standard') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade SLA FMLM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade SLA LM';
                    } else {
                        result = 'delivery required for Modern Trade';
                    }
                } else if (sla === 'Economy') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade Economy FMLM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade Economy LM';
                    } else {
                        result = 'delivery required for Modern Trade';
                    }
                } else if (sla === 'Fixed Delivery Schedule') {
                    if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade FDS FMLM';
                    } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                        result = 'Modern Trade FDS LM';
                    } else {
                        result = 'delivery required for Modern Trade';
                    }
                }
            } else if (distributionType === 'Consignment' && deliveryPoints === 'Not in the List') {
                if (sla === 'Economy') {
                    if (parcelProfile === 'Mostly smaller than 100kg per TID') {
                        if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                            result = 'Core Economy FMLM';
                        } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                            result = 'Core Economy LM';
                        } else if (pickup === 'NV pickup at Client WH' && lastMile === 'Client pickup at NV WH') {
                            result = 'explore >=100kg';
                        }
                    } else if (parcelProfile === 'Mostly >=100kg per TID') {
                        if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                            result = 'LTL Economy FMLM';
                        } else if (pickup === 'NV pickup at Client WH' && lastMile === 'Client pickup at NV WH') {
                            result = 'LTL Economy FM';
                        } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                            result = 'LTL Economy LM';
                        }
                    }
                }
                if (sla === 'Standard') {
                    if (parcelProfile === 'Mostly smaller than 100kg per TID') {
                        if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                            result = 'Core Standard FMLM';
                        } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                            result = 'Core Standard LM';
                        } else {
                            result = 'delivery required for Standard';
                        }
                    } else if (parcelProfile === 'Mostly >=100kg per TID') {
                        if (pickup === 'NV pickup at Client WH' && lastMile === 'NV delivery to Client') {
                            result = 'LTL Standard FMLM';
                        } else if (pickup === 'Client to bring to CBY' && lastMile === 'NV delivery to Client') {
                            result = 'LTL Standard LM';
                        } else {
                            result = 'delivery required for Standard';
                        }
                    }
                }
            }
        }
        document.getElementById('comboResult').textContent = result;
        // Lookup logic
        let lookupValue = '';
        if (result && !result.toLowerCase().includes('please complete') && !result.toLowerCase().includes('not available') && !result.toLowerCase().includes('delivery required') && !result.toLowerCase().includes('explore')) {
            lookupValue = xlookup(result);
        }
        document.getElementById('lookupResult').textContent = lookupValue;
    }

    // Listen for changes on all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', evaluateCombo);
    });

    // Initial evaluation
    evaluateCombo();
}); 