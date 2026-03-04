const spiresData = [
    { num: "13", article: "0Z0-07-000012", desc: "Spire fil carre acier 7x7 Ø ext 85 pas 65 G (100FCA)", ref: "100 FCA_7X7", poids: 1.51 },
    { num: "11", article: "0Z0-07-000010", desc: "Spire fil carré acier 10x10 Øext85 pas 65G (100 FCRA)", ref: "100 FCRA", poids: 2.98 },
    { num: "24", article: "0Z0-07-000024", desc: "Spire fil plat inox 12x4.5 Ø ext 90 pas 65 G (100FPI)", ref: "100 FPI_12X4.5", poids: 1.67 },
    { num: "29", article: "0Z0-07-000029", desc: "Spire fil rond acier Ø10 Øext 85 pas 65 G (100FRA)", ref: "100 FRRA_Ø10", poids: 2.34 },
    { num: "32", article: "0Z0-07-000032", desc: "Spire fil rond acier Ø4.5 Øext.28 pas 25 D (30FRA)", ref: "30 FRA_Ø4.5", poids: 0.391 },
    { num: "42", article: "0Z0-07-000042", desc: "Spire fil rond inox Ø4.5 Øext.28 pas 25 D (30FRI)", ref: "30 FRI_Ø4.5", poids: 0.389 },
    { num: "12", article: "0Z0-07-000011", desc: "Spire fil carre acier 5x5 Ø ext.34 pas 30D (39FCA)", ref: "39 FCA_5X5", poids: 0.631 },
    { num: "14", article: "0Z0-07-000013", desc: "Spire fil carre acier 7x7 Ø ext.38 pas 30D (39FCRA)", ref: "39 FCRA_7X7", poids: 1.31 },
    { num: "21", article: "0Z0-07-000020", desc: "Spire fil plat acier 8x3 Ø ext.34 pas 30D (39FPA)", ref: "39 FPA_8X3", poids: 0.55 },
    { num: "33", article: "0Z0-07-000033", desc: "Spire fil rond acier Ø5 Øext.34 pas 30D (39FRA)", ref: "39 FRA_Ø5", poids: 0.493 },
    { num: "43", article: "0Z0-07-000043", desc: "Spire fil rond inox Ø5 Øext.34 pas 30D (39FRI)", ref: "39 FRI_Ø5", poids: 0.493 },
    { num: "35", article: "0Z0-07-000035", desc: "Spire fil rond acier Ø7 Øext.38 pas 30G (39FRRA)", ref: "39 FRRA_Ø7", poids: 1.03 },
    { num: "26", article: "0Z0-07-000026", desc: "Spire fil plat inox 8x3 Ø ext.34 pas 30D (39FPI)", ref: "39FPI", poids: 0.55 },
    { num: "15", article: "0Z0-07-000014", desc: "Spire fil carre acier 7x7 Ø ext.46 pas 40D (53FCA)", ref: "53 FCA_7X7", poids: 1.25 },
    { num: "64", article: "0Z0-07-000064", desc: "Spire fil carre inox 7x7 Ø ext.46 pas 40D (53FCI)", ref: "53 FCI_7X7", poids: 1.24 },
    { num: "22", article: "0Z0-07-000021", desc: "Spire fil plat acier 8x3 Ø ext.43 pas 37D (53FPA)", ref: "53 FPA_8x3", poids: 0.595 },
    { num: "27", article: "0Z0-07-000027", desc: "Spire fil plat inox 8x3 Ø ext.43 pas 37D (53FPI)", ref: "53 FPI_8x3", poids: 0.6 },
    { num: "34", article: "0Z0-07-000034", desc: "Spire fil rond acier Ø5.5 Ø ext.43 pas 40D (53FRA)", ref: "53 FRA_Ø5.5", poids: 0.58 },
    { num: "44", article: "0Z0-07-000044", desc: "Spire fil rond inox Ø5.5 Øext.43 pas 40D (53FRI)", ref: "53 FRI_Ø5.5", poids: 0.58 },
    { num: "36", article: "0Z0-07-000036", desc: "Spire fil rond acier Ø7 Øext.43 pas 40D (53FRRA)", ref: "53 FRRA_Ø7", poids: 0.905 },
    { num: "16", article: "0Z0-07-000015", desc: "Spire fil carre acier 7x7 Ø ext.58 pas 45G (70FCA)", ref: "70 FCA_7X7", poids: 1.43 },
    { num: "61", article: "0Z0-07-000061", desc: "Spire fil carre acier 10x10 Ø ext.60 pas 45G (70 FCRA_10X10)", ref: "70 FCRA_10X10", poids: 2.87 },
    { num: "20", article: "0Z0-07-000019", desc: "Spire fil plat acier 12X4.5 Ø ext.58 pas 45G (70FPA)", ref: "70 FPA_12X4.5", poids: 1.44 },
    { num: "25", article: "0Z0-07-000025", desc: "Spire fil plat inox 12X4.5 Ø ext.58 pas 45G (70FPI)", ref: "70 FPI_12X4.5", poids: 1.45 },
    { num: "45", article: "0Z0-07-000045", desc: "Spire fil rond inox Ø6.5 Øext.58 pas 45G (70FRI)", ref: "70 FRI_Ø6.5", poids: 0.972 },
    { num: "28", article: "0Z0-07-000028", desc: "Spire fil rond acier Ø10 ext.58 pas 45G (70FRRAØ10)", ref: "70 FRRA_Ø10", poids: 2.17 },
    { num: "38", article: "0Z0-07-000038", desc: "Spire fil rond acier Ø8 Øext.58 pas 45G (70FRRAØ8)", ref: "70 FRRA_Ø8", poids: 1.43 },
    { num: "39", article: "0Z0-07-000039", desc: "Spire fil rond inox Ø10 Øext.58 pas 45G (70FRRI)", ref: "70 FRRI_Ø10", poids: 2.16 },
    { num: "48", article: "0Z0-07-000048", desc: "Spire fil rond Inox Ø8 Øext.58 pas 45G (70FRRIØ8)", ref: "70 FRRI_Ø8", poids: 1.43 },
    { num: "17", article: "0Z0-07-000016", desc: "Spire fil carre acier 7X7 Ø ext.70.5 pas 55G (80FCA)", ref: "80 FCA_7X7", poids: 1.46 },
    { num: "62", article: "0Z0-07-000062", desc: "Spire fil carre acier 10x10 Ø ext.70 pas 55G (80 FCRA_10X10)", ref: "80 FCRA_10X10", poids: 2.83 },
    { num: "23", article: "0Z0-07-000023", desc: "Spire fil plat inox 12x4.5 Ø ext 70.5 pas 65 G (80FPI)", ref: "80 FPI_12X4.5", poids: 1.3 },
    { num: "37", article: "0Z0-07-000037", desc: "Spire fil rond acier Ø7 Øext.70.5 pas 65G (80FRA)", ref: "80 FRA_Ø7", poids: 0.975 },
    { num: "46", article: "0Z0-07-000046", desc: "Spire fil rond inox Ø7 Øext.70.5 pas 65G (80FRI)", ref: "80 FRI_Ø7", poids: 0.975 },
    { num: "30", article: "0Z0-07-000030", desc: "Spire fil rond acier Ø10 Øext.70 pas 55G (80FRRA)", ref: "80 FRRA_Ø10", poids: 2.22 },
    { num: "40", article: "0Z0-07-000040", desc: "Spire fil rond inox Ø10 Øext.70 pas 55G (80FRRI)", ref: "80 FRRI_Ø10", poids: 2.2 },
    { num: "19", article: "0Z0-07-000018", desc: "Spire fil plat acier 12x4.5 Ø ext 70.5 pas 65 G (80FPA)", ref: "80FPA_12X4.5", poids: 1.29 }
];

let currentData = [...spiresData];
let sortDirection = 1; // 1 for asc, -1 for desc
let lastSortCol = -1;

function initTable() {
    renderTable();
    setupSearch();

    // Sticky search bar shadow effect
    window.addEventListener('scroll', () => {
        const searchContainer = document.getElementById('search-container');
        if (window.scrollY > 20) {
            searchContainer.classList.add('sticky');
        } else {
            searchContainer.classList.remove('sticky');
        }
    });
}

function renderTable() {
    const tbody = document.getElementById('spire-table-body');
    tbody.innerHTML = '';

    currentData.forEach((spire, index) => {
        const tr = document.createElement('tr');
        tr.dataset.index = index;

        tr.innerHTML = `
            <td><strong>${spire.num}</strong></td>
            <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${spire.article}</td>
            <td>${spire.desc}</td>
            <td style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-main);">${spire.ref}</td>
            <td style="font-family: var(--font-mono); font-size: 0.9rem;">${spire.poids.toFixed(3).replace('.', ',')}</td>
            <td>
                <div class="tube-input-cell">
                    <div class="field">
                        <input type="number" class="spire-input" data-weight="${spire.poids}" placeholder="0" step="any" min="0" id="input-${spire.num}">
                    </div>
                </div>
            </td>
            <td>
                <div class="result-cell" id="result-${spire.num}">0,00</div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Add listeners to new inputs
    const inputs = document.querySelectorAll('.spire-input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
}

function calculateTotal() {
    const inputs = document.querySelectorAll('.spire-input');
    let grandTotal = 0;

    inputs.forEach(input => {
        const val = parseFloat(input.value) || 0;
        const weight = parseFloat(input.getAttribute('data-weight'));
        const rowTotal = val * weight;

        const rowId = input.id.split('-')[1];
        const resultCell = document.getElementById('result-' + rowId);

        if (resultCell) {
            resultCell.textContent = rowTotal.toFixed(2).replace('.', ',');
        }

        grandTotal += rowTotal;
    });

    document.getElementById('grand-total').textContent = grandTotal.toFixed(2).replace('.', ',');
}

function sortTable(colIndex) {
    // Toggle direction if clicking the same column
    if (lastSortCol === colIndex) {
        sortDirection *= -1;
    } else {
        sortDirection = 1;
        lastSortCol = colIndex;
    }

    currentData.sort((a, b) => {
        let valA, valB;
        switch (colIndex) {
            case 0: valA = parseInt(a.num) || 0; valB = parseInt(b.num) || 0; break;
            case 1: valA = a.article || ''; valB = b.article || ''; break;
            case 2: valA = a.desc || ''; valB = b.desc || ''; break;
            case 3: valA = a.ref || ''; valB = b.ref || ''; break;
            case 4: valA = a.poids || 0; valB = b.poids || 0; break;
        }

        if (valA < valB) return -1 * sortDirection;
        if (valA > valB) return 1 * sortDirection;
        return 0;
    });

    // Preserve existing inputs before rendering
    const state = {};
    document.querySelectorAll('.spire-input').forEach(input => {
        if (input.value) {
            state[input.id] = input.value;
        }
    });

    renderTable();

    // Restore inputs
    for (let id in state) {
        const input = document.getElementById(id);
        if (input) {
            input.value = state[id];
        }
    }
    calculateTotal();
}

function setupSearch() {
    const input = document.getElementById('search-input');
    input.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();

        const rows = document.querySelectorAll('#spire-table-body tr');
        rows.forEach((row, index) => {
            const spireRef = currentData[index].ref.toLowerCase();
            if (spireRef.includes(term) || term === '') {
                row.classList.remove('hidden-row');
            } else {
                row.classList.add('hidden-row');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initTable);
