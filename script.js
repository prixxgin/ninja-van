document.addEventListener('DOMContentLoaded', function() {
    function getSelectedValue(name) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : '';
    }

    // New function to enable/disable Distribution Type
    function updateDistributionTypeState() {
        const sellingModel = getSelectedValue('sellingModel');
        // Find the Distribution Type form-group by label text
        let group = null;
        document.querySelectorAll('.form-group').forEach(fg => {
            const label = fg.querySelector('label');
            if (label && label.textContent.trim() === 'Distribution Type') {
                group = fg;
            }
        });
        const radioInputs = group ? group.querySelectorAll('input[type="radio"]') : [];
        if (sellingModel === '1P') {
            if (group) group.classList.add('disabled-group');
            radioInputs.forEach(input => {
                input.disabled = true;
                input.checked = false;
            });
        } else {
            if (group) group.classList.remove('disabled-group');
            radioInputs.forEach(input => {
                input.disabled = false;
            });
        }
    }

    // Lookup table for Distribution Tab column I/J
    const distributionLookup = {
        "Social Media ID": "Restock Service Offering",
        "Freight": "Freight",
        "Core Standard FMLM": "Restock Standard Parcel",
        "Core Standard LM": "Restock Standard Parcel",
        "LTL Standard FMLM": "Restock Standard LTL",
        "LTL Standard LM": "Restock Standard LTL",
        "Core Economy FMLM": "Restock Economy Parcel",
        "Core Economy LM": "Restock Economy Parcel",
        "LTL Economy FMLM": "Restock Economy LTL",
        "LTL Economy FM": "Restock Economy LTL",
        "LTL Economy LM": "Restock Economy LTL",
        "Modern Trade SLA FMLM": "Restock Modern Trade",
        "Modern Trade SLA LM": "Restock Modern Trade",
        "Modern Trade Economy FMLM": "Restock Modern Trade",
        "Modern Trade Economy LM": "Restock Modern Trade",
        "Modern Trade FDS FMLM": "Restock Modern Trade",
        "Modern Trade FDS LM": "Restock Modern Trade"
    };

    // Lookup table for Distribution Tab column I/K (Notes)
    const notesLookup = {
        "Freight": "NV WH-CBY to other NV WH deliveries only",
        "Modern Trade SLA FMLM": "Regardless of size, Modern Trade will always be charged per CBM",
        "Modern Trade SLA LM": "Regardless of size, Modern Trade will always be charged per CBM",
        "Modern Trade Economy FMLM": "Regardless of size, Modern Trade will always be charged per CBM",
        "Modern Trade Economy LM": "Regardless of size, Modern Trade will always be charged per CBM",
        "Modern Trade FDS FMLM": "Regardless of size, Modern Trade will always be charged per CBM",
        "Modern Trade FDS LM": "Regardless of size, Modern Trade will always be charged per CBM"
    };

    // Lookup table for Rate Info Panel (yellow result)
    const rateInfoLookup = {
        "Restock Standard Parcel": {
            rateCard: "https://docs.google.com/spreadsheets/d/149E9SFiFzf701d-kSA0AwLGu8of9nInLeP-K0FS3ub4/edit?gid=0#gid=0",
            rateCharge: "KG per TID",
            minCharge: "0 KG",
            deliveredBy: "Core",
            coverage: "All Core coverage"
        },
        "Restock Standard LTL": {
            rateCard: "https://docs.google.com/document/d/1hrWgDJa-Cn6aNMz4sZTkCEHbBE58VPYv5yjIZxsLG-0/edit?tab=t.ev6l0za2xai1",
            rateCharge: "CBM per MPS",
            minCharge: ".2 CBM",
            deliveredBy: "Restock",
            coverage: "No islands"
        },
        "Restock Economy Parcel": {
            rateCard: "https://docs.google.com/spreadsheets/d/149E9SFiFzf701d-kSA0AwLGu8of9nInLeP-K0FS3ub4/edit?gid=988761840#gid=988761840",
            rateCharge: "KG per TID",
            minCharge: "0 KG",
            deliveredBy: "Core",
            coverage: "All Core coverage"
        },
        "Restock Economy LTL": {
            rateCard: "https://docs.google.com/document/d/11G1G_iYJMOLReVfjApwGx5TnGFTV1NTK3GptJf1UArQ/edit?tab=t.ev6l0za2xai1",
            rateCharge: "CBM per MPS",
            minCharge: ".5 CBM",
            deliveredBy: "Restock",
            coverage: "No islands"
        },
        "Restock Modern Trade": {
            rateCard: "Custom, approved by c-suite",
            rateCharge: "CBM per MPS",
            minCharge: "1 CBM",
            deliveredBy: "Restock",
            coverage: "NCR, Calaba, South Luzon"
        },
        "Freight": {
            rateCard: "https://docs.google.com/document/d/1vyJ9d2xhzBhYrYauulVzEtjc0IqGIJcdkbfAmlG0EGU/edit?tab=t.ev6l0za2xai1",
            rateCharge: "CBM per MPS",
            minCharge: "1 CBM",
            deliveredBy: "none",
            coverage: "CBY & NV Warehouses"
        }
    };

    function evaluateCombo() {
        updateDistributionTypeState();
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

        // Lookup logic for reference result
        let lookupResult = '';
        if (!result) {
            lookupResult = '';
        } else if (result === 'please complete all fields') {
            lookupResult = '-';
        } else {
            lookupResult = distributionLookup[result] || "PRODUCT DOESN'T EXIST";
        }
        // Show in a new div above Ninja Van Service result
        let lookupDiv = document.getElementById('lookupResult');
        if (!lookupDiv) {
            lookupDiv = document.createElement('div');
            lookupDiv.id = 'lookupResult';
            lookupDiv.className = 'lookup-result';
            const comboResultDiv = document.getElementById('comboResult');
            comboResultDiv.parentNode.insertBefore(lookupDiv, comboResultDiv);
        }
        lookupDiv.textContent = lookupResult;

        // Notes lookup logic for blue result (comboResult)
        let notesResult = '';
        if (result && notesLookup[result]) {
            notesResult = notesLookup[result];
        } else {
            notesResult = '';
        }
        // Show in a new div below comboResult and above rate card
        let notesDiv = document.getElementById('notesResult');
        if (!notesDiv) {
            notesDiv = document.createElement('div');
            notesDiv.id = 'notesResult';
            notesDiv.className = 'notes-result';
            const comboResultDiv = document.getElementById('comboResult');
            comboResultDiv.parentNode.insertBefore(notesDiv, comboResultDiv.nextSibling);
        }
        notesDiv.textContent = notesResult;

        // Fill rate info panel based on yellow result (lookupResult)
        const yellowResult = lookupResult;
        const info = rateInfoLookup[yellowResult] || {};
        document.querySelector('.info-row .info-value').textContent = info.rateCard || '-';
        document.querySelectorAll('.info-row')[1].querySelector('.info-value').textContent = info.rateCharge || '-';
        document.querySelectorAll('.info-row')[2].querySelector('.info-value').textContent = info.minCharge || '-';
        document.querySelectorAll('.info-row')[3].querySelector('.info-value').textContent = info.deliveredBy || '-';
        document.querySelectorAll('.info-row')[5].querySelector('.info-value').textContent = info.coverage || '-';
        document.querySelectorAll('.info-row')[6].querySelector('.info-value').innerHTML = 'RDO SLA - (Forward SLA x 2) + 3 working days<br>RDO SLA - (Forward SLA x 2) + 3 working days, upon pickup of new shipment';
    }

    // Listen for changes on all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', evaluateCombo);
    });

    // Initial evaluation
    evaluateCombo();
}); 