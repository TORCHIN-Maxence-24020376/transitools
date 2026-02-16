document.addEventListener('DOMContentLoaded', () => {
    // --- Helpers ---
    const qs = (s) => document.querySelector(s);
    const qsa = (s) => [...document.querySelectorAll(s)];
    const el = (tag, attrs = {}) => {
        const n = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
        return n;
    };
    const elWithText = (tag, text) => {
        const n = document.createElement(tag);
        n.textContent = text;
        return n;
    };
    const esc = (str) => {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    };
    const nl2br = (str) => str.replace(/\n/g, '<br>');

    // --- Refs ---
    const container = qs('#previewContainer');

    const updatePreview = () => requestAnimationFrame(renderPreview);

    // --- Events ---
    document.addEventListener('input', (e) => {
        if (e.target.matches('input, textarea')) updatePreview();
    });

    qsa('button[data-action="add-section"]').forEach(btn => {
        btn.addEventListener('click', () => {
            addSubjectBlock(btn.dataset.target);
            updatePreview();
        });
    });

    qs('#btnAddRow').addEventListener('click', () => {
        addRow();
        updatePreview();
    });

    qs('#imgInput').addEventListener('change', (e) => {
        const files = [...e.target.files];
        const list = qs('#imgList');

        // We will check duplicates inside onload to be sure (content based)
        // or name based if possible.
        // Let's stick to name based for speed, but also content based if name is missing?
        // Actually, content based is safest to avoid "same visual image" appearing twice.

        files.forEach(f => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const url = ev.target.result;

                // Check if this image (base64) is already in the list
                // This is heavy but foolproof against duplicates
                const existing = [...list.querySelectorAll('img')].some(img => img.src === url);
                if (existing) return;

                const tpl = qs('#imgTpl').content.cloneNode(true);
                const div = el('div', { class: 'img-thumb' });
                // div.dataset.name = f.name; // Not strictly needed if checking content
                div.appendChild(tpl);
                div.querySelector('img').src = url;

                div.querySelector('.del-img').addEventListener('click', () => {
                    div.remove();
                    updatePreview();
                });

                div.querySelector('input').addEventListener('input', updatePreview);
                list.appendChild(div);
                updatePreview();
            };
            reader.readAsDataURL(f);
        });
        e.target.value = '';
    });

    // Print
    qs('#btnPrint').addEventListener('click', () => {
        // Create a dedicated print container
        const printContainer = document.createElement('div');
        printContainer.id = 'print-area';

        // Clone all sheets
        const sheets = qsa('.sheet');
        sheets.forEach(sheet => {
            const clone = sheet.cloneNode(true);
            // Clean up styles that might interfere
            clone.style.transform = '';
            clone.style.margin = '';
            clone.style.height = '';
            clone.style.minHeight = '297mm';
            printContainer.appendChild(clone);
        });

        document.body.appendChild(printContainer);

        // Print
        window.print();

        // Cleanup after print dialog closes (or immediately, browser handles the rendering)
        // Using setTimeout to ensure render happens before removal
        setTimeout(() => {
            document.body.removeChild(printContainer);
        }, 1000);
    });

    qs('#btnReset').addEventListener('click', () => {
        if (confirm('Tout effacer et recommencer ?')) {
            window.location.reload();
        }
    });

    // --- JSON Export/Import ---
    qs('#btnExportJson').addEventListener('click', () => {
        const data = collectData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `intervention-${data.date || 'draft'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    qs('#btnImport').addEventListener('click', () => qs('#importJson').click());

    // --- Preview Toggle ---
    const btnToggle = qs('#btnTogglePreview');
    const layoutSplit = qs('.layout-split');

    // Initially force open or rely on CSS default
    // Let's store preference
    const isPreviewHidden = localStorage.getItem('hidePreview') === 'true';
    if (isPreviewHidden) {
        layoutSplit.classList.add('preview-hidden');
    }

    btnToggle.addEventListener('click', () => {
        layoutSplit.classList.toggle('preview-hidden');
        const hidden = layoutSplit.classList.contains('preview-hidden');
        localStorage.setItem('hidePreview', hidden);

        // Wait for CSS transition to end then rescale
        setTimeout(scalePreview, 350);
    });

    qs('#importJson').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                restoreData(data);
            } catch (err) {
                alert('Erreur lors de la lecture du fichier JSON');
                console.error(err);
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset
    });

    // --- Form Logic ---
    function restoreData(data) {
        // Simple fields
        ['em_nom', 'em_adresse', 'em_contact', 'em_contact_nom', 'em_contact_tel', 'em_contact_mail', 'cl_nom', 'cl_adresse', 'cl_contact', 'cl_contact_nom', 'cl_contact_tel', 'cl_contact_mail', 'cl_num', 'date', 'date_debut', 'date_fin', 'reference', 'motif', 'travaux_a_faire'].forEach(id => {
            if (data[id] !== undefined) {
                const el = qs('#' + id);
                if (el) el.value = Array.isArray(data[id]) ? data[id].join('\n') : data[id];
            }
        });

        // Dynamic Sections
        qs('#realisesWrap').innerHTML = '';
        if (data.realises_sections) {
            data.realises_sections.forEach(s => addSubjectBlock('realisesWrap', s.topic, s.items.join('\n')));
        }

        qs('#problemesWrap').innerHTML = '';
        if (data.problemes_sections) {
            data.problemes_sections.forEach(s => addSubjectBlock('problemesWrap', s.topic, s.items.join('\n')));
        }

        // KV Table
        qs('#kvTable tbody').innerHTML = '';
        if (data.kv) {
            data.kv.forEach(row => addRow(row.k, row.v, row.r));
        }

        // Images (Restoring images is tricky without uploading them again, but if base64...)
        // Assuming src is dataURL or accessible URL
        const imgList = qs('#imgList');
        imgList.innerHTML = '';
        if (data.images) {
            data.images.forEach(img => {
                const tpl = qs('#imgTpl').content.cloneNode(true);
                const div = el('div', { class: 'img-thumb' });
                div.appendChild(tpl);
                div.querySelector('img').src = img.src;
                div.querySelector('input').value = img.caption || '';

                div.querySelector('.del-img').addEventListener('click', () => {
                    div.remove();
                    updatePreview();
                });
                div.querySelector('input').addEventListener('input', updatePreview);
                imgList.appendChild(div);
            });
        }

        updatePreview();
    }

    function addSubjectBlock(containerId, topic = '', items = '') {
        const wrap = qs('#' + containerId);
        const div = el('div', { class: 'section-block mb-2' });
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom: 5px; align-items:center;">
                <input class="subject-topic" placeholder="Titre de section (ex: Zone Moteur)" value="${topic}" />
                <button class="del-subject">✕</button>
            </div>
            <textarea class="subject-items" rows="3" placeholder="- Item 1\n- Item 2">${items}</textarea>
        `;
        div.querySelector('.del-subject').addEventListener('click', () => {
            div.remove();
            updatePreview();
        });
        wrap.appendChild(div);
    }

    function addRow(k = '', v = '', r = '') {
        const tbody = qs('#kvTable tbody');
        const tr = el('tr');
        tr.innerHTML = `
            <td><input class="k" value="${k}" placeholder="Ex: Ampérage" /></td>
            <td><input class="v" value="${v}" placeholder="12.5 A" /></td>
            <td><input class="r" value="${r}" placeholder=" RAS" /></td>
            <td><button class="del-row">✕</button></td>
        `;
        tr.querySelector('.del-row').addEventListener('click', () => {
            tr.remove();
            updatePreview();
        });
        tbody.appendChild(tr);
    }

    // --- Data Collection ---
    const getVal = (id) => (qs('#' + id)?.value || '').trim();
    const cleanLines = (text) => text.split('\n').map(s => s.trim()).filter(Boolean);

    function collectData() {
        return {
            em_nom: getVal('em_nom'),
            em_adresse: getVal('em_adresse'),
            em_contact: getVal('em_contact'),
            em_contact_nom: getVal('em_contact_nom'),
            em_contact_tel: getVal('em_contact_tel'),
            em_contact_mail: getVal('em_contact_mail'),
            cl_nom: getVal('cl_nom'),
            cl_adresse: getVal('cl_adresse'),
            cl_contact: getVal('cl_contact'),
            cl_contact_nom: getVal('cl_contact_nom'),
            cl_contact_tel: getVal('cl_contact_tel'),
            cl_contact_mail: getVal('cl_contact_mail'),
            cl_num: getVal('cl_num'),
            date: getVal('date'),
            date_debut: getVal('date_debut'),
            date_fin: getVal('date_fin'),
            reference: getVal('reference'),
            motif: getVal('motif'),
            realises_sections: collectSections('realisesWrap'),
            problemes_sections: collectSections('problemesWrap'),
            travaux_a_faire: cleanLines(getVal('travaux_a_faire')),
            kv: qsa('#kvTable tbody tr').map(tr => ({
                k: tr.querySelector('.k').value.trim(),
                v: tr.querySelector('.v').value.trim(),
                r: tr.querySelector('.r').value.trim()
            })).filter(o => o.k || o.v || o.r),
            images: (() => {
                const raw = qsa('#imgList .img-thumb').map(div => ({
                    src: div.querySelector('img').src,
                    caption: div.querySelector('input').value
                }));
                // Deduplicate by src content
                const seen = new Set();
                return raw.filter(img => {
                    if (seen.has(img.src)) return false;
                    seen.add(img.src);
                    return true;
                });
            })()
        };
    }

    function collectSections(id) {
        return [...qs('#' + id).children].map(div => ({
            topic: div.querySelector('.subject-topic').value,
            items: cleanLines(div.querySelector('textarea').value)
        })).filter(s => s.topic || s.items.length);
    }

    // =============================================
    // RENDERING WITH PAGINATION + FOOTER PER PAGE
    // =============================================

    // We measure actual content height using a wrapper inside .sheet-content.
    // The .sheet-content itself is flex:1 so its scrollHeight = full page height.
    // Instead, we wrap all blocks inside a .sheet-body div and measure THAT.
    //
    // A4 @ 96 DPI = 794 x 1123 px
    // Sheet padding: 15mm (~57px) top + 15mm bottom
    // Footer: ~110px
    // Content max = 1123 - 57 - 57 - 110 = ~899px
    // Use 880px as safe threshold
    const CONTENT_MAX_HEIGHT = 880;

    function createPage() {
        const page = el('div', { class: 'sheet' });

        const content = el('div', { class: 'sheet-content' });
        const footer = el('div', { class: 'sheet-footer' });
        footer.innerHTML = `
            <div class="pf-inner">
                <img src="assets/img/transitube.jpg" alt="Transitube">
                <p>
                    TIM SAS – 173 Chemin des bouscauds – F-13 480 CABRIES – Tél.: 04.42.15.94.40 – tim@transitube.com<br>
                    N° intracommunautaire (EC) FR 92 31 722 06 14 – Code APE : 4669B<br>
                    SAS au capital de 600 000 euros – RCS Aix en Provence B 317 220 614 – Siren 317 220 614
                </p>
            </div>
        `;

        page.appendChild(content);
        page.appendChild(footer);
        return page;
    }

    // Measure the real height of content children (sum of offsetHeight)
    function getContentHeight(contentArea) {
        let h = 0;
        for (const child of contentArea.children) {
            h += child.offsetHeight;
            // Add margins
            const style = window.getComputedStyle(child);
            h += parseInt(style.marginTop) || 0;
            h += parseInt(style.marginBottom) || 0;
        }
        return h;
    }

    function renderPreview() {
        const data = collectData();
        container.innerHTML = '';

        // --- Build all content blocks (same rendering as timgen) ---
        const blocks = [];

        // Logo
        const logoWrap = el('div', { class: 'out-head-logo' });
        logoWrap.appendChild(el('img', { src: 'assets/img/transitube.jpg', alt: 'Transitube' }));
        blocks.push(logoWrap);

        // Contacts
        const contacts = el('div', { class: 'out-head-contacts' });
        const emBox = el('div', { class: 'out-box' });

        // Emitter Contact
        let emContactBlock = '';
        const emParts = [];
        if (data.em_contact_nom) emParts.push(esc(data.em_contact_nom));
        if (data.em_contact_tel) emParts.push(esc(data.em_contact_tel));
        if (data.em_contact_mail) emParts.push(esc(data.em_contact_mail));

        if (emParts.length > 0) {
            emContactBlock = `<div class="muted">${emParts.join(' <br> ')}</div>`;
        } else if (data.em_contact) {
            emContactBlock = `<div class="muted">${esc(data.em_contact)}</div>`;
        }

        let datesBlock = '';
        if (data.date_debut || data.date_fin) {
            datesBlock = `<div class="muted">Intervention du ${esc(data.date_debut || '?')} au ${esc(data.date_fin || '?')}</div>`;
        }

        emBox.innerHTML = `
            <h3>${esc(data.em_nom || 'Émetteur')}</h3>
            ${data.em_adresse ? `<div>${nl2br(esc(data.em_adresse))}</div>` : ''}
            ${emContactBlock}
            ${datesBlock}
        `;
        const clBox = el('div', { class: 'out-box' });

        let contactBlock = '';
        const cParts = [];
        if (data.cl_contact_nom) cParts.push(esc(data.cl_contact_nom));
        if (data.cl_contact_tel) cParts.push(esc(data.cl_contact_tel));
        if (data.cl_contact_mail) cParts.push(esc(data.cl_contact_mail));

        if (cParts.length > 0) {
            contactBlock = `<div class="muted">${cParts.join(' <br> ')}</div>`;
        } else if (data.cl_contact) {
            contactBlock = `<div class="muted">${esc(data.cl_contact)}</div>`;
        }

        clBox.innerHTML = `
            <h3>${esc(data.cl_nom || 'Client')}</h3>
            ${data.cl_adresse ? `<div>${nl2br(esc(data.cl_adresse))}</div>` : ''}
            ${contactBlock}
            ${data.cl_num ? `<div class="muted">Numéro Client : ${esc(data.cl_num)}</div>` : ''}
            ${(data.date || data.reference) ? `<div class="muted">Rapport du : ${esc(data.date)}${data.reference ? ' — Réf. : ' + esc(data.reference) : ''}</div>` : ''}
        `;
        contacts.append(emBox, clBox);
        blocks.push(contacts);

        // Motif
        if (data.motif) {
            const motifWrap = el('div');
            const t = el('div', { class: 'out-motif-title' });
            t.textContent = 'MOTIF D\'INTERVENTION';
            const line = el('div', { class: 'out-motif-line' });
            const span = el('span', { class: 'marker' });
            span.textContent = data.motif;
            line.appendChild(span);
            motifWrap.append(t, line);
            blocks.push(motifWrap);
        }

        // Travaux réalisés
        if (data.realises_sections.length) {
            const box = el('div', { class: 'out-section out-section--underline' });
            box.appendChild(elWithText('h3', 'Travaux réalisés'));
            data.realises_sections.forEach(sec => {
                if (sec.topic) {
                    const p = el('p', { class: 'out-topic' });
                    p.textContent = sec.topic.endsWith(':') ? sec.topic : sec.topic + ' :';
                    box.appendChild(p);
                }
                if (sec.items.length) {
                    const ol = el('ol', { class: 'num' });
                    sec.items.forEach(it => ol.appendChild(elWithText('li', it)));
                    box.appendChild(ol);
                }
            });
            blocks.push(box);
        }

        // Problèmes
        if (data.problemes_sections.length) {
            const box = el('div', { class: 'out-section out-section--underline' });
            box.appendChild(elWithText('h3', 'Problèmes rencontrés'));
            data.problemes_sections.forEach(sec => {
                if (sec.topic) {
                    const p = el('p', { class: 'out-topic' });
                    p.textContent = sec.topic.endsWith(':') ? sec.topic : sec.topic + ' :';
                    box.appendChild(p);
                }
                if (sec.items.length) {
                    const ol = el('ol', { class: 'num' });
                    sec.items.forEach(it => ol.appendChild(elWithText('li', it)));
                    box.appendChild(ol);
                }
            });
            blocks.push(box);
        }

        // Travaux à faire
        if (data.travaux_a_faire.length) {
            const box = el('div', { class: 'out-section out-section--underline' });
            box.appendChild(elWithText('h3', 'Travaux à réaliser'));
            const ol = el('ol', { class: 'num' });
            data.travaux_a_faire.forEach(it => ol.appendChild(elWithText('li', it)));
            box.appendChild(ol);
            blocks.push(box);
        }

        // Tableau KV
        if (data.kv.length) {
            const box = el('div', { class: 'out-section out-section--underline' });
            box.appendChild(elWithText('h3', 'Intervention chez le Client — Remarques'));
            const t = el('table', { class: 'kv-out' });
            t.innerHTML = `<thead><tr><th>Champ</th><th>Valeur</th><th>Remarques</th></tr></thead>`;
            const tbody = el('tbody');
            data.kv.forEach(({ k, v, r }) => {
                const tr = el('tr');
                tr.innerHTML = `<td>${esc(k)}</td><td>${esc(v)}</td><td>${esc(r)}</td>`;
                tbody.appendChild(tr);
            });
            t.appendChild(tbody);
            box.appendChild(t);
            blocks.push(box);
        }

        // Images (Split into rows of 2 for better pagination)
        if (data.images.length) {
            // Title
            const titleBox = el('div', { class: 'out-section out-section--underline' });
            titleBox.appendChild(elWithText('h3', 'Illustrations'));
            blocks.push(titleBox);

            // Grid rows
            let currentGrid = null;
            data.images.forEach((img, index) => {
                // Start a new grid every 2 images
                if (index % 2 === 0) {
                    currentGrid = el('div', { class: 'out-images' });
                    // We wrap the grid in a section-like div to handle margins consistent with layout
                    const wrapper = el('div', { class: 'out-section', style: 'margin-top:0; margin-bottom: 2mm;' });
                    wrapper.appendChild(currentGrid);
                    blocks.push(wrapper);
                }

                const fig = el('figure');
                fig.appendChild(el('img', { src: img.src }));
                fig.appendChild(elWithText('figcaption', img.caption || ''));
                currentGrid.appendChild(fig);
            });
        }

        // --- Pagination: distribute blocks across pages ---
        let page = createPage();
        container.appendChild(page);
        let contentArea = page.querySelector('.sheet-content');

        blocks.forEach(block => {
            contentArea.appendChild(block);

            // Measure REAL content height (sum of children offsetHeights)
            const realHeight = getContentHeight(contentArea);

            if (realHeight > CONTENT_MAX_HEIGHT) {
                // This block caused overflow — move it to a new page
                contentArea.removeChild(block);

                page = createPage();
                container.appendChild(page);
                contentArea = page.querySelector('.sheet-content');
                contentArea.appendChild(block);
            }
        });

        // Scale sheets to fit in the container
        scalePreview();
    }

    // Scale the preview to fit the container width
    function scalePreview() {
        // A4 width in px at 96dpi = 794px
        // We add some buffer for scrollbars/padding
        const SHEET_WIDTH = 794;

        // Get available width in the parent column
        // We look at the parent .preview-col width, minus paddings of container
        const parentCol = container.closest('.preview-col');
        if (!parentCol) return;

        const availableWidth = parentCol.clientWidth - 48; // aprox padding

        // Reset styles first
        const sheets = container.querySelectorAll('.sheet');
        sheets.forEach(sheet => {
            sheet.style.transform = '';
            sheet.style.transformOrigin = '';
            sheet.style.marginBottom = '';
            sheet.style.marginTop = '';
        });
        container.style.height = '';

        if (availableWidth >= SHEET_WIDTH) {
            return; // No scaling needed
        }

        const scale = availableWidth / SHEET_WIDTH;

        sheets.forEach((sheet, i) => {
            sheet.style.transform = `scale(${scale})`;
            sheet.style.transformOrigin = 'top left'; // Better for alignment

            // Fix whitespace caused by scaling
            // The element still takes up original space in flow.
            // We need to reduce that space.
            const originalHeight = sheet.offsetHeight; // Should be ~1123px
            const scaledHeight = originalHeight * scale;
            const spaceToRemove = originalHeight - scaledHeight;

            sheet.style.marginBottom = `-${spaceToRemove}px`;

            // Add a small gap between pages (except the last one)
            if (i < sheets.length - 1) {
                // The gap is also scaled if we are not careful, 
                // but since we pull up with negative margin, we can add a bit back
                // or just rely on the container gap if it's display flex/grid.
                // Our container is flex column with gap: 24px. 
                // The negative margin effectively pulls the next item up.
            }
        });

        // Align container to center if needed, or left
        container.style.alignItems = 'flex-start';
    }

    // Rescale on window resize
    window.addEventListener('resize', scalePreview);

    // --- Init ---
    // Default KV rows (like timgen)
    const DEFAULT_ROWS = [
        ['Date de l\u2019intervention', '', ''],
        ['Heure d\u2019arrivée', '', ''],
        ['Durée de l\u2019intervention', '', ''],
        ['Heure de départ', '', ''],
        ['Déplacement (km)', '', '']
    ];
    DEFAULT_ROWS.forEach(([k, v, r]) => addRow(k, v, r));

    addSubjectBlock('realisesWrap', 'Intervention');
    updatePreview();
});
