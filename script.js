document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('deliveryForm');
    const productStatus = document.querySelector('.product-status');
    const subtitle = document.querySelector('.subtitle');
    
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

        const result = calculateProduct(values);
        productStatus.textContent = result.product;
        subtitle.textContent = result.subtitle;
    }

    function calculateProduct(values) {
        // Check if any required fields are empty
        if (values.sellingModel === "") {
            return { product: "", subtitle: "please complete all fields" };
        }

        // Logic for 1P
        if (values.sellingModel === "1P") {
            if ([values.sla, values.parcelProfile, values.pickup, values.lastMileDelivery].includes("")) {
                return { product: "", subtitle: "please complete all fields" };
            }

            if (values.sla === "Fixed Delivery Schedule") {
                return { product: "PRODUCT DOESN'T EXIST", subtitle: "not available" };
            }

            // Check for Freight conditions
            if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "Client pickup at NV WH") {
                if (values.sla === "Economy") return { product: "Freight", subtitle: "" };
                if (values.sla === "Standard") return { product: "Freight auto Economy", subtitle: "" };
                if (values.sla === "Fixed Delivery Schedule") return { product: "Freight auto Economy", subtitle: "" };
            }

            // Economy SLA logic
            if (values.sla === "Economy") {
                if (values.parcelProfile === "Mostly smaller than 100kg per TID") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Core Economy FMLM", subtitle: "" };
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Core Economy LM", subtitle: "" };
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "Client pickup at NV WH")
                        return { product: "explore >=100kg", subtitle: "" };
                }
                if (values.parcelProfile === "Mostly >=100kg per TID") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "LTL Economy FMLM", subtitle: "" };
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "Client pickup at NV WH")
                        return { product: "LTL Economy FM", subtitle: "" };
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "LTL Economy LM", subtitle: "" };
                }
            }

            // Standard SLA logic
            if (values.sla === "Standard") {
                if (values.parcelProfile === "Mostly smaller than 100kg per TID") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Core Standard FMLM", subtitle: "" };
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Core Standard LM", subtitle: "" };
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                }
                if (values.parcelProfile === "Mostly >=100kg per TID") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "LTL Standard FMLM", subtitle: "" };
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "LTL Standard LM", subtitle: "" };
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                }
            }
        }

        // Logic for 3P
        if (values.sellingModel === "3P") {
            if ([values.distributionType, values.sla, values.parcelProfile, values.pickup, values.lastMileDelivery, values.deliveryPoints].includes("")) {
                return { product: "", subtitle: "please complete all fields" };
            }

            // Outright distribution type
            if (values.distributionType === "Outright") {
                if (values.sla === "Standard") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Modern Trade SLA FMLM", subtitle: "" };
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Modern Trade SLA LM", subtitle: "" };
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                }
                if (values.sla === "Economy") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Modern Trade Economy FMLM", subtitle: "" };
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Modern Trade Economy LM", subtitle: "" };
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                }
                if (values.sla === "Fixed Delivery Schedule") {
                    if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Modern Trade FDS FMLM", subtitle: "" };
                    if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                        return { product: "Modern Trade FDS LM", subtitle: "" };
                    return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                }
            }

            // Consignment distribution type
            if (values.distributionType === "Consignment") {
                if (values.deliveryPoints === "Listed Delivery Point") {
                    if (values.sla === "Standard") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Modern Trade SLA FMLM", subtitle: "" };
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Modern Trade SLA LM", subtitle: "" };
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                    }
                    if (values.sla === "Economy") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Modern Trade Economy FMLM", subtitle: "" };
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Modern Trade Economy LM", subtitle: "" };
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                    }
                    if (values.sla === "Fixed Delivery Schedule") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Modern Trade FDS FMLM", subtitle: "" };
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Modern Trade FDS LM", subtitle: "" };
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Modern Trade" };
                    }
                }

                // Economy SLA logic for Consignment
                if (values.sla === "Economy") {
                    if (values.parcelProfile === "Mostly smaller than 100kg per TID") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Core Economy FMLM", subtitle: "" };
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Core Economy LM", subtitle: "" };
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "Client pickup at NV WH")
                            return { product: "explore >=100kg", subtitle: "" };
                    }
                    if (values.parcelProfile === "Mostly >=100kg per TID") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "LTL Economy FMLM", subtitle: "" };
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "Client pickup at NV WH")
                            return { product: "LTL Economy FM", subtitle: "" };
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "LTL Economy LM", subtitle: "" };
                    }
                }

                // Standard SLA logic for Consignment
                if (values.sla === "Standard") {
                    if (values.parcelProfile === "Mostly smaller than 100kg per TID") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Core Standard FMLM", subtitle: "" };
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "Core Standard LM", subtitle: "" };
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                    }
                    if (values.parcelProfile === "Mostly >=100kg per TID") {
                        if (values.pickup === "NV pickup at Client WH" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "LTL Standard FMLM", subtitle: "" };
                        if (values.pickup === "Client to bring to CBY" && values.lastMileDelivery === "NV delivery to Client")
                            return { product: "LTL Standard LM", subtitle: "" };
                        return { product: "PRODUCT DOESN'T EXIST", subtitle: "delivery required for Standard" };
                    }
                }
            }
        }

        return { product: "PRODUCT DOESN'T EXIST", subtitle: "" };
    }

    // Initial check
    updateProductStatus();
}); 