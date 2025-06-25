document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('deliveryForm');
    const deliveryPointsSelect = document.getElementById('deliveryPoints');
    
    // List of all delivery points
    const deliveryPoints = [
        'SM - SVI, SSM, SMCO, Sanford',
        'Puregold',
        'Waltermart',
        'Robinsons',
        'Landmark',
        'S&R',
        'Citmart',
        'SNEX',
        'Royal Duty Free',
        'Liteshoes Corporation',
        'Metro Gaisano, Giasano Capital',
        'Ultra Mega',
        'Super8',
        'LCC',
        'CSI',
        'South Super',
        'RDS',
        'Suysing',
        'Chain2',
        'Philippine Seven'
    ];

    // Populate delivery points dropdown
    deliveryPoints.forEach(point => {
        const option = document.createElement('option');
        option.value = point;
        option.textContent = point;
        deliveryPointsSelect.appendChild(option);
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            sellingModel: document.getElementById('sellingModel').value,
            distributionType: document.getElementById('distributionType').value,
            sla: document.getElementById('sla').value,
            parcelProfile: document.getElementById('parcelProfile').value,
            pickup: document.getElementById('pickup').value,
            lastMileDelivery: document.getElementById('lastMileDelivery').value,
            deliveryPoints: document.getElementById('deliveryPoints').value
        };

        // Log form data (you can modify this to send to a server)
        console.log('Form Data:', formData);
    });

    // Add change event listeners to all select elements
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            // You can add validation or dependent field logic here
            console.log(`${select.id} changed to: ${select.value}`);
        });
    });
}); 