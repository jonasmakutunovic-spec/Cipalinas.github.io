document.addEventListener('DOMContentLoaded', function () {

    // LIVE UPDATE OF SLIDER VALUES (the 5.0 → 7.3 → 9.1 etc.)
    ['rating1', 'rating2', 'rating3'].forEach((id, index) => {
        const slider = document.getElementById(id);
        const valueSpan = document.getElementById('value' + (index + 1));

        // Show value immediately when page loads
        valueSpan.textContent = slider.value;

        // Update in real time when user moves the slider
        slider.addEventListener('input', function () {
            valueSpan.textContent = this.value;
        });
    });

    const form = document.getElementById('contactForm');
    const resultDiv = document.getElementById('formResult');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value.trim(),
            surname: document.getElementById('surname').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            rating1: parseFloat(document.getElementById('rating1').value),
            rating2: parseFloat(document.getElementById('rating2').value),
            rating3: parseFloat(document.getElementById('rating3').value)
        };

        console.log('Form Data Object:', formData);

        const average = ((formData.rating1 + formData.rating2 + formData.rating3) / 3).toFixed(1);
        const avgNum = parseFloat(average);

        let colorClass = 'text-danger';        // 0–4
        if (avgNum > 7) colorClass = 'text-success';   // 7.1–10
        else if (avgNum > 4) colorClass = 'text-warning'; // 4.1–7

        resultDiv.innerHTML = `
            <div class="alert alert-info">
                <strong>Submitted Data:</strong><br>
                Name: ${formData.name}<br>
                Surname: ${formData.surname}<br>
                Email: ${formData.email}<br>
                Phone number: ${formData.phone}<br>
                Address: ${formData.address}<br><br>
                <strong>${formData.name} ${formData.surname}: <span class="${colorClass} fw-bold">${average}</span></strong>
            </div>`;

        // Success popup
        const popup = document.createElement('div');
        popup.innerHTML = `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            background:#28a745;color:white;padding:25px 50px;border-radius:12px;
            box-shadow:0 10px 30px rgba(0,0,0,0.4);z-index:9999;font-size:1.3rem;font-weight:bold;">
            Form submitted successfully!
        </div>`;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3000);
    });
});