---
title: Mech Builder
order: 9
---

# Mech Builder

*Design and customize your own mech by selecting a frame and adding weapons and fittings.*

<div class="mech-builder">
    <div class="builder-controls">
        <div class="control-section">
            <h3>Frame Selection</h3>
            <select id="frame-select" class="builder-select">
                <option value="">Select a Frame</option>
                {% for frame in site.data.frames %}
                {%- assign f = frame[1] -%}
                <option value="{{ frame[0] }}">{{ f.name }} ({{ f.class }})</option>
                {% endfor %}
            </select>
        </div>

        <div class="control-section">
            <h3>Weapons</h3>
            <div class="resource-counter">
                <span>Hard Points: </span>
                <span id="hp-counter">0/0</span>
            </div>
            <select id="weapon-select" class="builder-select">
                <option value="">Add a Weapon</option>
                {% for weapon in site.data.weapons %}
                {%- assign w = weapon[1] -%}
                <option value="{{ weapon[0] }}" data-hp="{{ w.hard_points }}">{{ w.name }} ({{ w.hard_points }} HP)</option>
                {% endfor %}
            </select>
            <div id="weapon-list" class="builder-list"></div>
        </div>

        <div class="control-section">
            <h3>Fittings</h3>
            <div class="resource-counter">
                <span>System Points: </span>
                <span id="sp-counter">0/0</span>
            </div>
            <select id="fitting-select" class="builder-select">
                <option value="">Add a Fitting</option>
                {% for fitting in site.data.fittings %}
                {%- assign f = fitting[1] -%}
                <option value="{{ fitting[0] }}" data-sp="{{ f.system_points }}">{{ f.name }} ({{ f.system_points }} SP)</option>
                {% endfor %}
            </select>
            <div id="fitting-list" class="builder-list"></div>
        </div>
    </div>

    <div class="preview-section">
        <h3>Mech Preview</h3>
        <div id="mech-preview" class="mech-template">
            <div class="mech-template-header">
                <div class="mech-name" id="preview-name">Select a Frame</div>
                <div class="frame-type" id="preview-class"></div>
            </div>
            
            <div class="mech-stats-grid">
                <div class="stat-pair">
                    <div class="stat-label">Speed</div>
                    <div class="stat-value" id="preview-speed">-</div>
                </div>
                <div class="stat-pair">
                    <div class="stat-label">Armor</div>
                    <div class="stat-value" id="preview-armor">-</div>
                </div>
                <div class="stat-pair">
                    <div class="stat-label">HP</div>
                    <div class="stat-value" id="preview-hp">-</div>
                </div>
                <div class="stat-pair">
                    <div class="stat-label">AC</div>
                    <div class="stat-value" id="preview-ac">-</div>
                </div>
                <div class="stat-pair">
                    <div class="stat-label">Hard Points</div>
                    <div class="stat-value" id="preview-hardpoints">-</div>
                </div>
                <div class="stat-pair">
                    <div class="stat-label">System Points</div>
                    <div class="stat-value" id="preview-systempoints">-</div>
                </div>
            </div>

            <div class="mech-section">
                <div class="section-header">Weapons</div>
                <div id="preview-weapons"></div>
            </div>

            <div class="mech-section">
                <div class="section-header">Fittings</div>
                <div id="preview-fittings"></div>
            </div>
        </div>
    </div>
</div>

<script>
const frames = {{ site.data.frames | jsonify }};
const weapons = {{ site.data.weapons | jsonify }};
const fittings = {{ site.data.fittings | jsonify }};

let currentMech = {
    frame: null,
    weapons: [],
    fittings: []
};

function updateResourceCounters() {
    const usedHP = currentMech.weapons.reduce((sum, w) => sum + weapons[w].hard_points, 0);
    const maxHP = currentMech.frame ? frames[currentMech.frame].stats.hard_points : 0;
    document.getElementById('hp-counter').textContent = `${usedHP}/${maxHP}`;
    document.getElementById('hp-counter').classList.toggle('over-budget', usedHP > maxHP);

    const usedSP = currentMech.fittings.reduce((sum, f) => sum + fittings[f].system_points, 0);
    const maxSP = currentMech.frame ? frames[currentMech.frame].stats.system_points : 0;
    document.getElementById('sp-counter').textContent = `${usedSP}/${maxSP}`;
    document.getElementById('sp-counter').classList.toggle('over-budget', usedSP > maxSP);
}

function updatePreview() {
    if (!currentMech.frame) {
        document.getElementById('preview-name').textContent = 'Select a Frame';
        document.getElementById('preview-class').textContent = '';
        document.getElementById('preview-speed').textContent = '-';
        document.getElementById('preview-armor').textContent = '-';
        document.getElementById('preview-hp').textContent = '-';
        document.getElementById('preview-ac').textContent = '-';
        document.getElementById('preview-hardpoints').textContent = '-';
        document.getElementById('preview-systempoints').textContent = '-';
        return;
    }

    const frame = frames[currentMech.frame];
    document.getElementById('preview-name').textContent = frame.name;
    document.getElementById('preview-class').textContent = frame.class;
    document.getElementById('preview-speed').textContent = frame.stats.speed;
    document.getElementById('preview-armor').textContent = frame.stats.armor;
    document.getElementById('preview-hp').textContent = frame.stats.hp;
    document.getElementById('preview-ac').textContent = frame.stats.ac;
    document.getElementById('preview-hardpoints').textContent = frame.stats.hard_points;
    document.getElementById('preview-systempoints').textContent = frame.stats.system_points;

    // Update weapons preview
    const weaponsContainer = document.getElementById('preview-weapons');
    weaponsContainer.innerHTML = currentMech.weapons.map(w => {
        const weapon = weapons[w];
        return `
            <div class="weapon-item">
                <div class="item-name">${weapon.name}</div>
                <div class="weapon-stats">
                    <span class="weapon-stat">
                        <span class="weapon-stat-label">Range</span>
                        <span class="weapon-stat-value">${weapon.stats.range}</span>
                    </span>
                    <span class="weapon-stat">
                        <span class="weapon-stat-label">Damage</span>
                        <span class="weapon-stat-value">${weapon.stats.damage}</span>
                    </span>
                    <div class="tag-list">
                        ${weapon.tags.map(tag => `<span class="weapon-tag">${tag.value ? `${tag.name} ${tag.value}` : tag.name}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Update fittings preview
    const fittingsContainer = document.getElementById('preview-fittings');
    fittingsContainer.innerHTML = currentMech.fittings.map(f => {
        const fitting = fittings[f];
        return `
            <div class="fitting-item">
                <div class="item-name">${fitting.name}</div>
                <div class="item-stats">${fitting.effect}</div>
            </div>
        `;
    }).join('');
}

function updateWeaponList() {
    const container = document.getElementById('weapon-list');
    container.innerHTML = currentMech.weapons.map(w => {
        const weapon = weapons[w];
        return `
            <div class="list-item">
                <span>${weapon.name} (${weapon.hard_points} HP)</span>
                <button onclick="removeWeapon('${w}')" class="remove-btn">×</button>
            </div>
        `;
    }).join('');
}

function updateFittingList() {
    const container = document.getElementById('fitting-list');
    container.innerHTML = currentMech.fittings.map(f => {
        const fitting = fittings[f];
        return `
            <div class="list-item">
                <span>${fitting.name} (${fitting.system_points} SP)</span>
                <button onclick="removeFitting('${f}')" class="remove-btn">×</button>
            </div>
        `;
    }).join('');
}

function addWeapon(weaponId) {
    if (!weaponId) return;
    currentMech.weapons.push(weaponId);
    document.getElementById('weapon-select').value = '';
    updateWeaponList();
    updateResourceCounters();
    updatePreview();
}

function removeWeapon(weaponId) {
    currentMech.weapons = currentMech.weapons.filter(w => w !== weaponId);
    updateWeaponList();
    updateResourceCounters();
    updatePreview();
}

function addFitting(fittingId) {
    if (!fittingId) return;
    currentMech.fittings.push(fittingId);
    document.getElementById('fitting-select').value = '';
    updateFittingList();
    updateResourceCounters();
    updatePreview();
}

function removeFitting(fittingId) {
    currentMech.fittings = currentMech.fittings.filter(f => f !== fittingId);
    updateFittingList();
    updateResourceCounters();
    updatePreview();
}

document.getElementById('frame-select').addEventListener('change', (e) => {
    currentMech.frame = e.target.value;
    updateResourceCounters();
    updatePreview();
});

document.getElementById('weapon-select').addEventListener('change', (e) => {
    addWeapon(e.target.value);
});

document.getElementById('fitting-select').addEventListener('change', (e) => {
    addFitting(e.target.value);
});
</script>

<style>
.mech-builder {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin: 2rem 0;
}

.builder-controls {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 1.5rem;
}

.control-section {
    margin-bottom: 2rem;
}

.control-section h3 {
    color: #6a9ec7;
    font-size: 1.1em;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333;
}

.builder-select {
    width: 100%;
    padding: 0.5rem;
    background: #252525;
    border: 1px solid #444;
    border-radius: 4px;
    color: #fff;
    font-size: 0.9em;
    margin-bottom: 1rem;
}

.builder-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: #252525;
    border-radius: 4px;
    font-size: 0.9em;
}

.remove-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 1.2em;
    cursor: pointer;
    padding: 0 0.5rem;
}

.remove-btn:hover {
    color: #ff4444;
}

.resource-counter {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: #252525;
    border-radius: 4px;
    font-size: 0.9em;
    color: #888;
}

.over-budget {
    color: #ff4444;
}

.preview-section {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 1.5rem;
}

.preview-section h3 {
    color: #6a9ec7;
    font-size: 1.2em;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333;
}

@media (max-width: 768px) {
    .mech-builder {
        grid-template-columns: 1fr;
    }
}
</style> 