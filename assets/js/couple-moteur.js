document.addEventListener('DOMContentLoaded', () => {
    // === LocalStorage Logic ===
    const storageKey = 'transitools_couple_v1';

    // Save inputs
    function saveState() {
        const state = {
            p: document.getElementById('p').value,
            n: document.getElementById('n').value,
            ratio: document.getElementById('ratio').value,
            eta: document.getElementById('eta').value,
            gearOn: document.getElementById('toggle').dataset.on === 'true'
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
    }

    // Load inputs
    function loadState() {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return;

        try {
            const state = JSON.parse(raw);
            if (state.p) document.getElementById('p').value = state.p;
            if (state.n) document.getElementById('n').value = state.n;
            if (state.ratio) document.getElementById('ratio').value = state.ratio;
            if (state.eta) document.getElementById('eta').value = state.eta;

            if (state.gearOn) {
                setGear(true);
            }
        } catch (e) {
            console.error("Failed to load state", e);
        }
    }

    const el = (id) => document.getElementById(id);

    const p = el("p");
    const n = el("n");
    const ratio = el("ratio");
    const eta = el("eta");
    const toggle = el("toggle");
    const gearFields = el("gearFields");

    const tOut = el("tOut");
    const tMotor = el("tMotor");
    const nOut = el("nOut");
    const warn = el("warn");
    const formula = el("formula");

    let gearOn = false;

    function fmt(x, digits = 3) {
        if (!Number.isFinite(x)) return "—";
        const abs = Math.abs(x);
        const d = abs >= 1000 ? 2 : abs >= 100 ? 3 : abs >= 10 ? 4 : digits;
        return x.toLocaleString("fr-FR", { maximumFractionDigits: d });
    }

    function setWarn(msg) {
        if (!msg) {
            warn.classList.remove("show");
            warn.textContent = "";
            return;
        }
        warn.classList.add("show");
        warn.textContent = msg;
    }

    function compute() {
        const P = Number(p.value);
        const N = Number(n.value);

        const hasP = Number.isFinite(P) && P > 0;
        const hasN = Number.isFinite(N) && N > 0;

        if (!hasP || !hasN) {
            tMotor.textContent = "—";
            tOut.textContent = "—";
            nOut.textContent = gearOn ? "—" : "—";
            setWarn(!hasP && !hasN ? "" : "Indiquez une puissance et une vitesse positives.");
            formula.textContent = "T = 9.55 × P(W) / n(tr/min)";
            saveState(); // Save state on compute
            return;
        }

        // Couple moteur (Nm)
        const Tm = 9.55 * (P / N);

        // Motoréducteur
        if (gearOn) {
            const i = Number(ratio.value);
            const e = Number(eta.value);

            const validI = Number.isFinite(i) && i > 0;
            const validE = Number.isFinite(e) && e > 0 && e <= 1;

            if (!validI || !validE) {
                tMotor.textContent = fmt(Tm) + " Nm";
                tOut.textContent = "—";
                nOut.textContent = "—";
                setWarn("Le rapport doit être > 0 et le rendement entre 0 et 1.");
                formula.textContent = "T_moteur = 9.55 × P / n ; T_sortie ≈ T_moteur × i × η ; n_sortie ≈ n / i";
                saveState();
                return;
            }

            const Tout = Tm * i * e;
            const Nout = N / i;

            tMotor.textContent = fmt(Tm) + " Nm";
            tOut.textContent = fmt(Tout);
            nOut.textContent = fmt(Nout) + " tr/min";

            setWarn("");
            formula.textContent = "T_moteur = 9.55 × P / n ; T_sortie ≈ T_moteur × i × η ; n_sortie ≈ n / i";
        } else {
            tMotor.textContent = fmt(Tm) + " Nm";
            tOut.textContent = fmt(Tm);
            nOut.textContent = "—";
            setWarn("");
            formula.textContent = "T = 9.55 × P(W) / n(tr/min)";
        }

        saveState();
    }

    function setGear(on) {
        gearOn = on;
        toggle.dataset.on = String(on);
        toggle.setAttribute("aria-checked", String(on));
        gearFields.style.display = on ? "block" : "none";
        compute();
    }

    // Toggle click + clavier
    if (toggle) {
        toggle.addEventListener("click", () => setGear(!gearOn));
        toggle.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setGear(!gearOn);
            }
        });
    }

    // Calcul en temps réel
    if (p && n && ratio && eta) {
        [p, n, ratio, eta].forEach(inp => {
            inp.addEventListener("input", compute);
            inp.addEventListener("change", compute);
        });

        // Load persisted state
        loadState();

        // Initial compute if values exist
        if (p.value && n.value) compute();
    }
});
