document.addEventListener('DOMContentLoaded', () => {
    const masterInput = document.getElementById('master-length');
    const resultVals = document.querySelectorAll('.tube-result-val');
    const rows = document.querySelectorAll('tbody tr');

    function calculateAll() {
        const length = parseFloat(masterInput.value) || 0;

        rows.forEach(row => {
            const weightPerMeter = parseFloat(row.dataset.weight);
            const totalWeight = length * weightPerMeter;

            const display = row.querySelector('.tube-result-val');
            if (display) {
                // Formatting with comma for French standard as in typical tools
                display.textContent = totalWeight.toFixed(2).replace('.', ',');
            }
        });
    }

    masterInput.addEventListener('input', calculateAll);

    // Prevent negative values
    masterInput.addEventListener('change', () => {
        if (parseFloat(masterInput.value) < 0) {
            masterInput.value = 0;
            calculateAll();
        }
    });

    // Initial calculation (0)
    calculateAll();
});
