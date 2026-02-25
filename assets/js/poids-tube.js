document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.tube-input');
    const grandTotalDisplay = document.getElementById('grand-total');

    function calculate() {
        let grandTotal = 0;

        inputs.forEach(input => {
            const length = parseFloat(input.value) || 0;
            const weightPerMeter = parseFloat(input.dataset.weight);
            const lineWeight = length * weightPerMeter;

            // Update row result
            const row = input.closest('.tube-row');
            const resultCell = row.querySelector('.tube-result-cell');
            if (resultCell) {
                resultCell.textContent = lineWeight.toFixed(2).replace('.', ',');
            }

            grandTotal += lineWeight;
        });

        // Update grand total
        grandTotalDisplay.textContent = grandTotal.toFixed(2).replace('.', ',');
    }

    inputs.forEach(input => {
        input.addEventListener('input', calculate);

        // Prevent negative values UI-side
        input.addEventListener('change', () => {
            if (parseFloat(input.value) < 0) {
                input.value = 0;
                calculate();
            }
        });
    });

    // Initial run
    calculate();
});
