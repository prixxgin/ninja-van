document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('deliveryForm');
    const productStatus = document.getElementById('productStatus');
    const subtitle = document.getElementById('subtitle');
    
    // Get all form select elements
    const sellingModel = document.getElementById('sellingModel');
    const distributionType = document.getElementById('distributionType');
    const sla = document.getElementById('sla');
    const parcelProfile = document.getElementById('parcelProfile');
    const pickup = document.getElementById('pickup');
    const lastMileDelivery = document.getElementById('lastMileDelivery');
    const deliveryPoints = document.getElementById('deliveryPoints');

    // Add change event listeners to all select elements
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', updateProductStatus);
    });

    // Lookup data for service offerings
    const serviceData = {
        'Freight': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'CBM per MPS',
            minimumCharge: '1 CBM',
            deliveredBy: 'none',
            coverage: 'CBY & NV Warehouses'
        },
        'Core Standard FMLM': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'KG per TID',
            minimumCharge: '0 KG',
            deliveredBy: 'Core',
            coverage: 'All Core coverage'
        },
        'Core Standard LM': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'KG per TID',
            minimumCharge: '0 KG',
            deliveredBy: 'Core',
            coverage: 'All Core coverage'
        },
        'LTL Standard FMLM': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'CBM per MPS',
            minimumCharge: '2 CBM',
            deliveredBy: 'Restock',
            coverage: 'No islands'
        },
        'LTL Standard LM': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'CBM per MPS',
            minimumCharge: '2 CBM',
            deliveredBy: 'Restock',
            coverage: 'GCR, Calabarzon, South Luzon'
        },
        'Core Economy FMLM': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'KG per TID',
            minimumCharge: '0 KG',
            deliveredBy: 'Middle Mile',
            coverage: 'All Core coverage'
        },
        'Core Economy LM': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'KG per TID',
            minimumCharge: '0 KG',
            deliveredBy: 'Middle Mile',
            coverage: 'All Core coverage'
        },
        'LTL Economy FMLM': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'CBM per MPS',
            minimumCharge: '2.5 CBM',
            deliveredBy: 'Restock',
            coverage: 'No islands'
        },
        'LTL Economy FM': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'CBM per MPS',
            minimumCharge: '2.5 CBM',
            deliveredBy: 'Middle Mile & Railway',
            coverage: 'No islands'
        },
        'LTL Economy LM': {
            rateCard: 'https://docs.google.com/spreadsheets',
            rateCharge: 'CBM per MPS',
            minimumCharge: '2.5 CBM',
            deliveredBy: 'Middle Mile & Railway',
            coverage: 'No islands'
        },
        'Modern Trade SLA FMLM': {
            rateCard: 'Custom, approval required',
            rateCharge: 'CBM per MPS',
            minimumCharge: '1 CBM',
            deliveredBy: 'Restock',
            coverage: 'GCR, Calabarzon, South Luzon'
        },
        'Modern Trade SLA LM': {
            rateCard: 'Custom, approval required',
            rateCharge: 'CBM per MPS',
            minimumCharge: '1 CBM',
            deliveredBy: 'Restock',
            coverage: 'GCR, Calabarzon, South Luzon'
        },
        'Modern Trade Economy FMLM': {
            rateCard: 'Custom, approval required',
            rateCharge: 'CBM per MPS',
            minimumCharge: '1 CBM',
            deliveredBy: 'Railway',
            coverage: 'GCR, Calabarzon, South Luzon'
        },
        'Modern Trade Economy LM': {
            rateCard: 'Custom, approval required',
            rateCharge: 'CBM per MPS',
            minimumCharge: '1 CBM',
            deliveredBy: 'Railway',
            coverage: 'GCR, Calabarzon, South Luzon'
        },
        'Modern Trade FDS FMLM': {
            rateCard: 'Custom, approval required',
            rateCharge: 'CBM per MPS',
            minimumCharge: '1 CBM',
            deliveredBy: 'Railway',
            coverage: 'GCR, Calabarzon, South Luzon'
        },
        'Modern Trade FDS LM': {
            rateCard: 'Custom, approval required',
            rateCharge: 'CBM per MPS',
            minimumCharge: '1 CBM',
            deliveredBy: 'Railway',
            coverage: 'GCR, Calabarzon, South Luzon'
        }
    };

    function updateRateInfo(productName) {
        const data = serviceData[productName] || {
            rateCard: '-',
            rateCharge: '-',
            minimumCharge: '-',
            deliveredBy: '-',
            coverage: '-'
        };

        // Update the display values
        document.getElementById('rateCardValue').textContent = data.rateCard;
        document.getElementById('rateChargeValue').textContent = data.rateCharge;
        document.getElementById('minimumChargeValue').textContent = data.minimumCharge;
        document.getElementById('deliveredByValue').textContent = data.deliveredBy;
        document.getElementById('coverageValue').textContent = data.coverage;

        // Make rate card a clickable link if it's a URL
        if (data.rateCard.startsWith('https://')) {
            document.getElementById('rateCardValue').innerHTML = `<a href="${data.rateCard}" target="_blank">View Rate Card</a>`;
        }
    }

    function updateProductStatus() {
        const values = {
            sellingModel: sellingModel.value,
            distributionType: distributionType.value,
            sla: sla.value,
            parcelProfile: parcelProfile.value,
            pickup: pickup.value,
            lastMileDelivery: lastMileDelivery.value,
            deliveryPoints: deliveryPoints.value
        };

        console.log('Current values:', values); // Debug log

        const result = calculateProduct(values);
        productStatus.textContent = result.product || "PRODUCT DOESN'T EXIST";
        subtitle.textContent = result.subtitle || "";

        // Update rate info based on the product
        updateRateInfo(result.product);
    }

    function calculateProduct(values) {
        // Initial empty check
        if (!values.sellingModel) {
            return { product: "", subtitle: "please complete all fields" };
        }

        // 1P Logic
        if (values.sellingModel === "1P") {
            if (!values.sla || !values.parcelProfile || !values.pickup || !values.lastMileDelivery) {
                return { product: "PRODUCT DOESN'T EXIST", subtitle: "please complete all fields" };
            }

            if (values.sla === "Fixed Delivery Schedule") {
                return { product: "PRODUCT DOESN'T EXIST", subtitle: "not available" };
            }

            // Freight conditions
            if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "Client pickup at NV WH") {
                if (values.sla === "Economy") return { product: "Freight", subtitle: "" };
                if (values.sla === "Standard" || values.sla === "Fixed Delivery Schedule") {
                    return { product: "Freight auto Economy", subtitle: "" };
                }
            }

            // Economy SLA
            if (values.sla === "Economy") {
                if (values.parcelProfile === "Mostly smaller than 100kg per TID") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Core Economy FMLM", subtitle: "" };
                    }
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Core Economy LM", subtitle: "" };
                    }
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "Client pickup at NV WH") {
                        return { product: "explore >=100kg", subtitle: "" };
                    }
                }
                if (values.parcelProfile === "Mostly >=100kg per TID") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "LTL Economy FMLM", subtitle: "" };
                    }
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "Client pickup at NV WH") {
                        return { product: "LTL Economy FM", subtitle: "" };
                    }
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "LTL Economy LM", subtitle: "" };
                    }
                }
            }

            // Standard SLA
            if (values.sla === "Standard") {
                if (values.parcelProfile === "Mostly smaller than 100kg per TID") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Core Standard FMLM", subtitle: "" };
                    }
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Core Standard LM", subtitle: "" };
                    }
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                }
                if (values.parcelProfile === "Mostly >=100kg per TID") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "LTL Standard FMLM", subtitle: "" };
                    }
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "LTL Standard LM", subtitle: "" };
                    }
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                }
            }
        }

        // 3P Logic
        if (values.sellingModel === "3P") {
            if (!values.distributionType || !values.sla || !values.parcelProfile || !values.pickup || !values.lastMileDelivery || !values.deliveryPoints) {
                return { product: "PRODUCT DOESN'T EXIST", subtitle: "please complete all fields" };
            }

            // Outright distribution
            if (values.distributionType === "Outright") {
                if (values.sla === "Standard") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Modern Trade SLA FMLM", subtitle: "" };
                    }
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Modern Trade SLA LM", subtitle: "" };
                    }
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                }
                if (values.sla === "Economy") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Modern Trade Economy FMLM", subtitle: "" };
                    }
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Modern Trade Economy LM", subtitle: "" };
                    }
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                }
                if (values.sla === "Fixed Delivery Schedule") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Modern Trade FDS FMLM", subtitle: "" };
                    }
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                        return { product: "Modern Trade FDS LM", subtitle: "" };
                    }
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                }
            }

            // Consignment distribution
            if (values.distributionType === "Consignment") {
                if (values.deliveryPoints === "Listed Delivery Point") {
                    if (values.sla === "Standard") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                            return { product: "Modern Trade SLA FMLM", subtitle: "" };
                        }
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                            return { product: "Modern Trade SLA LM", subtitle: "" };
                        }
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                    }
                    if (values.sla === "Economy") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                            return { product: "Modern Trade Economy FMLM", subtitle: "" };
                        }
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                            return { product: "Modern Trade Economy LM", subtitle: "" };
                        }
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                    }
                    if (values.sla === "Fixed Delivery Schedule") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                            return { product: "Modern Trade FDS FMLM", subtitle: "" };
                        }
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                            return { product: "Modern Trade FDS LM", subtitle: "" };
                        }
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                    }
                } else {
                    // Non-Listed Delivery Point
                    if (values.sla === "Economy") {
                        if (values.parcelProfile === "Mostly smaller than 100kg per TID") {
                            if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                                return { product: "Core Economy FMLM", subtitle: "" };
                            }
                            if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                                return { product: "Core Economy LM", subtitle: "" };
                            }
                            if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "Client pickup at NV WH") {
                                return { product: "explore >=100kg", subtitle: "" };
                            }
                        }
                        if (values.parcelProfile === "Mostly >=100kg per TID") {
                            if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                                return { product: "LTL Economy FMLM", subtitle: "" };
                            }
                            if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "Client pickup at NV WH") {
                                return { product: "LTL Economy FM", subtitle: "" };
                            }
                            if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                                return { product: "LTL Economy LM", subtitle: "" };
                            }
                        }
                    }
                    if (values.sla === "Standard") {
                        if (values.parcelProfile === "Mostly smaller than 100kg per TID") {
                            if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                                return { product: "Core Standard FMLM", subtitle: "" };
                            }
                            if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                                return { product: "Core Standard LM", subtitle: "" };
                            }
                            return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                        }
                        if (values.parcelProfile === "Mostly >=100kg per TID") {
                            if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client") {
                                return { product: "LTL Standard FMLM", subtitle: "" };
                            }
                            if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client") {
                                return { product: "LTL Standard LM", subtitle: "" };
                            }
                            return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                        }
                    }
                }
            }
        }

        return { product: "PRODUCT DOESN'T EXIST", subtitle: "" };
    }

    // Initial check
    updateProductStatus();
}); 