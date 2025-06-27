document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('deliveryForm');
    const productStatus = document.getElementById('productStatus');
    const subtitle = document.getElementById('subtitle');
    
    // Get all form radio button groups
    function getSelectedValue(name) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : '';
    }

    // Function to toggle distribution type based on selling model
    function toggleDistributionType() {
        const sellingModel = getSelectedValue('sellingModel');
        const distributionTypeGroup = document.querySelector('.form-group:has(input[name="distributionType"])');
        const distributionTypeInputs = document.querySelectorAll('input[name="distributionType"]');
        
        if (sellingModel === '1P') {
            distributionTypeGroup.classList.add('disabled-group');
            distributionTypeInputs.forEach(input => {
                input.disabled = true;
                input.checked = false;
            });
        } else {
            distributionTypeGroup.classList.remove('disabled-group');
            distributionTypeInputs.forEach(input => {
                input.disabled = false;
            });
            // Set default value for 3P
            if (!getSelectedValue('distributionType')) {
                document.querySelector('input[name="distributionType"][value="Consignment"]').checked = true;
            }
        }
        updateProductStatus();
    }

    // Add change event listeners to all radio buttons
    const radioButtons = form.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        if (radio.name === 'sellingModel') {
            radio.addEventListener('change', toggleDistributionType);
        }
        radio.addEventListener('change', updateProductStatus);
    });

    // Initialize distribution type state
    toggleDistributionType();

    // Definition sheet lookup data (columns I, J, and K)
    const definitionLookup = {
        "Core Standard FMLM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "Core Standard LM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "LTL Standard FMLM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "LTL Standard LM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "Core Economy FMLM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "Core Economy LM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "LTL Economy FMLM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "LTL Economy FM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "LTL Economy LM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "Modern Trade SLA FMLM": {
            rateCard: "Custom, approval required",
            rddSla: "(Forward SLA x 2) + 3 working days, upon pickup of new shipment"
        },
        "Modern Trade SLA LM": {
            rateCard: "Custom, approval required",
            rddSla: "(Forward SLA x 2) + 3 working days, upon pickup of new shipment"
        },
        "Modern Trade Economy FMLM": {
            rateCard: "Custom, approval required",
            rddSla: "(Forward SLA x 2) + 3 working days, upon pickup of new shipment"
        },
        "Modern Trade Economy LM": {
            rateCard: "Custom, approval required",
            rddSla: "(Forward SLA x 2) + 3 working days, upon pickup of new shipment"
        },
        "Modern Trade FDS FMLM": {
            rateCard: "Custom, approval required",
            rddSla: "(Forward SLA x 2) + 3 working days, upon pickup of new shipment"
        },
        "Modern Trade FDS LM": {
            rateCard: "Custom, approval required",
            rddSla: "(Forward SLA x 2) + 3 working days, upon pickup of new shipment"
        },
        "Freight": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        },
        "Freight auto Economy": {
            rateCard: "https://docs.google.com/spreadsheets",
            rddSla: "Forward SLA x 2) + 3 working days"
        }
    };

    // Service data for rate info
    const serviceData = {
        "Core Standard FMLM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 80",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "Core Standard LM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 80",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "LTL Standard FMLM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 1500",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "LTL Standard LM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 1500",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "Core Economy FMLM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 60",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "Core Economy LM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 60",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "LTL Economy FMLM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 1200",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "LTL Economy FM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 1200",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "LTL Economy LM": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 1200",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "Modern Trade SLA FMLM": {
            rateCard: "Custom, approval required",
            rateCharge: "Custom rate",
            minimumCharge: "Custom rate",
            deliveredBy: "Ninja Van",
            coverage: "Based on delivery points"
        },
        "Modern Trade SLA LM": {
            rateCard: "Custom, approval required",
            rateCharge: "Custom rate",
            minimumCharge: "Custom rate",
            deliveredBy: "Ninja Van",
            coverage: "Based on delivery points"
        },
        "Modern Trade Economy FMLM": {
            rateCard: "Custom, approval required",
            rateCharge: "Custom rate",
            minimumCharge: "Custom rate",
            deliveredBy: "Ninja Van",
            coverage: "Based on delivery points"
        },
        "Modern Trade Economy LM": {
            rateCard: "Custom, approval required",
            rateCharge: "Custom rate",
            minimumCharge: "Custom rate",
            deliveredBy: "Ninja Van",
            coverage: "Based on delivery points"
        },
        "Modern Trade FDS FMLM": {
            rateCard: "Custom, approval required",
            rateCharge: "Custom rate",
            minimumCharge: "Custom rate",
            deliveredBy: "Ninja Van",
            coverage: "Based on delivery points"
        },
        "Modern Trade FDS LM": {
            rateCard: "Custom, approval required",
            rateCharge: "Custom rate",
            minimumCharge: "Custom rate",
            deliveredBy: "Ninja Van",
            coverage: "Based on delivery points"
        },
        "Freight": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 2000",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        },
        "Freight auto Economy": {
            rateCard: "https://docs.google.com/spreadsheets",
            rateCharge: "Based on weight and destination",
            minimumCharge: "PHP 2000",
            deliveredBy: "Ninja Van",
            coverage: "Nationwide"
        }
    };

    // Lookup function (equivalent to Excel's XLOOKUP)
    function xlookup(lookupValue, lookupData, column, notFoundValue = "") {
        if (!lookupValue || lookupValue === "please complete all fields") {
            return "-";
        }
        const data = lookupData[lookupValue];
        return data ? data[column] : notFoundValue;
    }

    function updateProductStatus() {
        const values = {
            sellingModel: getSelectedValue('sellingModel'),
            distributionType: getSelectedValue('distributionType'),
            sla: getSelectedValue('sla'),
            parcelProfile: getSelectedValue('parcelProfile'),
            pickup: getSelectedValue('pickup'),
            lastMileDelivery: getSelectedValue('lastMileDelivery'),
            deliveryPoints: getSelectedValue('deliveryPoints')
        };

        console.log('Current values:', values); // Debug log

        const result = calculateProduct(values);
        
        // Update product status
        productStatus.textContent = result.product || "PRODUCT DOESN'T EXIST";
        subtitle.textContent = result.subtitle || "";

        // Update rate info based on the product
        updateRateInfo(result.product);
    }

    function calculateProduct(values) {
        let productCode = "";
        const {
            sellingModel,          // C3: Business Type (1P/3P)
            distributionType,      // C4: Engagement Model
            sla,                   // C5: Delivery Model
            parcelProfile,         // C6: Volume
            pickup,               // C7: Pickup
            lastMileDelivery,     // C8: Delivery
            deliveryPoints        // C9: Listing Status
        } = values;

        // Check for empty required fields
        if (!sellingModel) {
            return { product: productCode, subtitle: "please complete all fields" };
        }

        // 1P Logic
        if (sellingModel === "1P") {
            // Check required fields for 1P
            if (!sla || !parcelProfile || !pickup || !lastMileDelivery) {
                return { product: "PRODUCT DOESN'T EXIST", subtitle: "please complete all fields" };
            }

            // Fixed Delivery Schedule not available case
            if (sla === "Fixed Delivery Schedule" && 
                pickup === "Client to bring to CBY" && 
                lastMileDelivery === "Client pickup at NV WH") {
                return { product: "PRODUCT DOESN'T EXIST", subtitle: "not available" };
            }

            // Freight cases
            if (pickup === "Client to bring to CBY" && lastMileDelivery === "Client pickup at NV WH") {
                if (sla === "Economy") {
                    productCode = "Freight";
                } else if (sla === "Standard" || sla === "Fixed Delivery Schedule") {
                    productCode = "Freight auto Economy";
                }
                return { product: productCode };
            }

            // Volume-based logic for smaller than 100kg
            if (parcelProfile === "Mostly smaller than 100kg per TID") {
                if (sla === "Economy") {
                    if (pickup === "NV pickup at Client WH" && lastMileDelivery === "NV delivery to Client") {
                        productCode = "Core Economy FMLM";
                    } else if (pickup === "Client to bring to CBY" && lastMileDelivery === "NV delivery to Client") {
                        productCode = "Core Economy LM";
                    }
                } else if (sla === "Standard") {
                    if (pickup === "NV pickup at Client WH" && lastMileDelivery === "NV delivery to Client") {
                        productCode = "Core Standard FMLM";
                    } else if (pickup === "Client to bring to CBY" && lastMileDelivery === "NV delivery to Client") {
                        productCode = "Core Standard LM";
                    } else {
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                    }
                }
            }
            
            // Volume-based logic for >=100kg
            if (parcelProfile === "Mostly >=100kg per TID") {
                if (sla === "Economy") {
                    if (pickup === "NV pickup at Client WH" && lastMileDelivery === "NV delivery to Client") {
                        productCode = "LTL Economy FMLM";
                    } else if (pickup === "NV pickup at Client WH" && lastMileDelivery === "Client pickup at NV WH") {
                        productCode = "LTL Economy FM";
                    } else if (pickup === "Client to bring to CBY" && lastMileDelivery === "NV delivery to Client") {
                        productCode = "LTL Economy LM";
                    }
                } else if (sla === "Standard") {
                    if (pickup === "NV pickup at Client WH" && lastMileDelivery === "NV delivery to Client") {
                        productCode = "LTL Standard FMLM";
                    } else if (pickup === "Client to bring to CBY" && lastMileDelivery === "NV delivery to Client") {
                        productCode = "LTL Standard LM";
                    } else {
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                    }
                }
            }
        }

        // 3P Logic
        if (sellingModel === "3P") {
            // Check required fields for 3P
            if (!distributionType || !sla || !parcelProfile || !pickup || !lastMileDelivery || !deliveryPoints) {
                return { product: "PRODUCT DOESN'T EXIST", subtitle: "please complete all fields" };
            }

            // Modern Trade cases (Outright or Listed Delivery Point)
            if (distributionType === "Outright" || 
                (distributionType === "Consignment" && deliveryPoints === "Listed Delivery Point")) {
                
                // Modern Trade with delivery
                if (lastMileDelivery === "NV delivery to Client") {
                    if (pickup === "NV pickup at Client WH") {
                        productCode = `Modern Trade ${sla === "Fixed Delivery Schedule" ? "FDS" : sla} FMLM`;
                    } else if (pickup === "Client to bring to CBY") {
                        productCode = `Modern Trade ${sla === "Fixed Delivery Schedule" ? "FDS" : sla} LM`;
                    }
                }
                if (!productCode) {
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                }
            }

            // Non-Listed Delivery Point with Consignment - use same logic as 1P
            if (distributionType === "Consignment" && deliveryPoints === "Non-Listed Delivery Point") {
                if (parcelProfile === "Mostly smaller than 100kg per TID") {
                    if (sla === "Economy") {
                        if (pickup === "NV pickup at Client WH" && lastMileDelivery === "NV delivery to Client") {
                            productCode = "Core Economy FMLM";
                        } else if (pickup === "Client to bring to CBY" && lastMileDelivery === "NV delivery to Client") {
                            productCode = "Core Economy LM";
                        }
                    } else if (sla === "Standard") {
                        if (pickup === "NV pickup at Client WH" && lastMileDelivery === "NV delivery to Client") {
                            productCode = "Core Standard FMLM";
                        } else if (pickup === "Client to bring to CBY" && lastMileDelivery === "NV delivery to Client") {
                            productCode = "Core Standard LM";
                        } else {
                            return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                        }
                    }
                }
                if (parcelProfile === "Mostly >=100kg per TID") {
                    if (sla === "Economy") {
                        if (pickup === "NV pickup at Client WH" && lastMileDelivery === "NV delivery to Client") {
                            productCode = "LTL Economy FMLM";
                        } else if (pickup === "NV pickup at Client WH" && lastMileDelivery === "Client pickup at NV WH") {
                            productCode = "LTL Economy FM";
                        } else if (pickup === "Client to bring to CBY" && lastMileDelivery === "NV delivery to Client") {
                            productCode = "LTL Economy LM";
                        }
                    } else if (sla === "Standard") {
                        if (pickup === "NV pickup at Client WH" && lastMileDelivery === "NV delivery to Client") {
                            productCode = "LTL Standard FMLM";
                        } else if (pickup === "Client to bring to CBY" && lastMileDelivery === "NV delivery to Client") {
                            productCode = "LTL Standard LM";
                        } else {
                            return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                        }
                    }
                }
            }
        }

        return { product: productCode || "PRODUCT DOESN'T EXIST", subtitle: "" };
    }

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
        document.getElementById('rddSlaValue').textContent = productName ? definitionLookup[productName]?.rddSla || '-' : '-';

        // Make rate card a clickable link if it's a URL
        if (data.rateCard.startsWith('https://')) {
            document.getElementById('rateCardValue').innerHTML = `<a href="${data.rateCard}" target="_blank">View Rate Card</a>`;
        }
    }

    // Initial check
    updateProductStatus();
}); 