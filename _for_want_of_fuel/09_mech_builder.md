---
title: Mech Builder
order: 9
---

# Mech Builder

<div class="mech-builder">
    <div class="builder-left">
        <!-- Frame Selection -->
        <div class="builder-section">
            <h3>Frame Selection</h3>
            <select id="frame-select">
                <option value="">Select a Frame</option>
                {% for frame in site.data.frames %}
                {%- assign f = frame[1] -%}
                <option value="{{ frame[0] }}">{{ f.name }} ({{ f.class }})</option>
                {% endfor %}
            </select>
        </div>

        <!-- Weapon Selection -->
        <div class="builder-section">
            <h3>Weapons <span id="hardpoints-used">0/0 HP</span></h3>
            <div class="weapon-slots" id="weapon-slots">
                <!-- Weapon slots will be added here dynamically -->
            </div>
            <select id="weapon-select" disabled>
                <option value="">Add Weapon</option>
                {% for weapon in site.data.weapons %}
                {%- assign w = weapon[1] -%}
                <option value="{{ weapon[0] }}">{{ w.name }} ({{ w.hard_points }} HP)</option>
                {% endfor %}
            </select>
        </div>

        <!-- Fitting Selection -->
        <div class="builder-section">
            <h3>Fittings <span id="systempoints-used">0/0 SP</span></h3>
            <div class="fitting-slots" id="fitting-slots">
                <!-- Fitting slots will be added here dynamically -->
            </div>
            <select id="fitting-select" disabled>
                <option value="">Add Fitting</option>
                {% for fitting in site.data.fittings %}
                {%- assign f = fitting[1] -%}
                <option value="{{ fitting[0] }}">{{ f.name }} ({{ f.system_points }} SP)</option>
                {% endfor %}
            </select>
        </div>
    </div>

    <!-- Mech Card Preview -->
    <div class="builder-right">
        <div class="preview-section">
            <h3>Mech Card</h3>
            <div id="mech-card" class="mech-template">
                <div class="mech-template-header">
                    <div class="mech-name" id="card-name">SELECT A FRAME</div>
                    <div class="frame-type" id="card-class"></div>
                </div>
                <div class="mech-stats-grid">
                    <div class="stat-pair">
                        <div class="stat-label">Speed</div>
                        <div class="stat-value" id="card-speed">-</div>
                    </div>
                    <div class="stat-pair">
                        <div class="stat-label">Armor</div>
                        <div class="stat-value" id="card-armor">-</div>
                    </div>
                    <div class="stat-pair">
                        <div class="stat-label">HP</div>
                        <div class="stat-value" id="card-hp">-</div>
                    </div>
                    <div class="stat-pair">
                        <div class="stat-label">AC</div>
                        <div class="stat-value" id="card-ac">-</div>
                    </div>
                </div>
                <div class="mech-section">
                    <div class="section-header">Special Ability</div>
                    <div id="card-special">-</div>
                </div>
                <div class="mech-section">
                    <div class="section-header">Weapons</div>
                    <div id="card-weapons">
                        <!-- Weapon items will be added here -->
                    </div>
                </div>
                <div class="mech-section">
                    <div class="section-header">Fittings</div>
                    <div id="card-fittings">
                        <!-- Fitting items will be added here -->
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button onclick="resetBuild()" class="action-button">Reset Build</button>
                <div class="import-export-section">
                    <div class="action-group">
                        <button onclick="exportToClipboard()" class="action-button">Copy to Clipboard</button>
                        <button onclick="downloadJSON()" class="action-button">Download JSON</button>
                    </div>
                    <div class="action-group">
                        <button onclick="showImportDialog()" class="action-button">Paste from Clipboard</button>
                        <input type="file" id="file-import" accept=".json" style="display: none" onchange="handleFileImport(event)">
                        <button onclick="document.getElementById('file-import').click()" class="action-button">Upload JSON</button>
                    </div>
                </div>
                
                <!-- Mech Library Section -->
                <div class="mech-library">
                    <h4>Saved Mechs</h4>
                    <div class="library-controls">
                        <button onclick="showSaveMechDialog()" class="action-button">Save Current Mech</button>
                    </div>
                    <div id="saved-mechs-list" class="saved-mechs-list">
                        <!-- Saved mechs will be listed here -->
                    </div>
                </div>

                <!-- Import Dialog -->
                <div id="import-dialog" class="modal" style="display: none;">
                    <div class="modal-content">
                        <h3>Import Mech</h3>
                        <textarea id="import-json" placeholder="Paste JSON here"></textarea>
                        <div class="modal-actions">
                            <button onclick="handleJSONImport()" class="action-button">Import</button>
                            <button onclick="closeImportDialog()" class="action-button">Cancel</button>
                        </div>
                    </div>
                </div>

                <!-- Save Mech Dialog -->
                <div id="save-mech-dialog" class="modal" style="display: none;">
                    <div class="modal-content">
                        <h3>Save Mech</h3>
                        <div class="form-group">
                            <label for="mech-name">Name:</label>
                            <input type="text" id="mech-name" placeholder="Enter mech name">
                        </div>
                        <div class="form-group">
                            <label for="mech-description">Description:</label>
                            <textarea id="mech-description" placeholder="Enter mech description (optional)"></textarea>
                        </div>
                        <div class="modal-actions">
                            <button onclick="saveMechToLibrary()" class="action-button">Save</button>
                            <button onclick="closeSaveMechDialog()" class="action-button">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.mech-builder {
    display: grid;
    grid-template-columns: minmax(300px, 1fr) minmax(400px, 1.2fr);
    gap: 2rem;
    margin: 2rem 0;
    padding: 1rem;
    background: #1a1a1a;
    border-radius: 4px;
}

.builder-left {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.builder-right {
    position: sticky;
    top: 2rem;
    align-self: start;
}

.builder-section, .preview-section {
    padding: 1rem;
    background: #252525;
    border-radius: 4px;
}

.builder-section {
    border: 1px solid #333;
}

.preview-section {
    border: 1px solid #444;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

select {
    width: 100%;
    padding: 0.75rem;
    margin-top: 0.5rem;
    background: #2a2a2a;
    color: white;
    border: 1px solid #444;
    border-radius: 6px;
    font-size: 1em;
    cursor: pointer;
    transition: all 0.2s ease;
}

select:hover:not(:disabled) {
    border-color: #6a9ec7;
    background: #2f2f2f;
}

select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

#frame-select {
    background: #2d3440;
    border-color: #6a9ec7;
    font-size: 1.1em;
    padding: 1rem;
}

#frame-select:hover:not(:disabled) {
    background: #344050;
}

.builder-section h3 {
    color: #fff;
    font-size: 1.2em;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.builder-section h3 span {
    color: #6a9ec7;
    font-size: 0.9em;
    font-weight: normal;
    padding: 0.25rem 0.5rem;
    background: #2a2a2a;
    border-radius: 4px;
    border: 1px solid #444;
}

.weapon-slots, .fitting-slots {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
}

.slot-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2a2a2a;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #444;
    margin-bottom: 0.5rem;
}

.slot-info {
    flex: 1;
}

.slot-name {
    color: #fff;
    font-weight: 500;
    font-size: 1.1em;
}

.slot-stats {
    color: #888;
    font-size: 0.9em;
    margin-top: 0.25rem;
}

.slot-remove {
    background: #ff444422;
    border: 1px solid #ff444444;
    color: #ff4444;
    cursor: pointer;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
    font-size: 1.2em;
    transition: all 0.2s ease;
}

.slot-remove:hover {
    background: #ff444444;
    border-color: #ff4444;
}

.weapon-item, .fitting-item {
    background: #2a2a2a;
    border-radius: 4px;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
}

.item-name {
    color: #fff;
    margin-bottom: 0.25rem;
    font-size: 1em;
}

.item-stats {
    color: #888;
    font-size: 0.9em;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.5rem;
}

@media (max-width: 1024px) {
    .mech-builder {
        grid-template-columns: 1fr;
    }
    
    .builder-right {
        position: static;
    }
    
    .weapon-slots, .fitting-slots {
        max-height: none;
    }
}

.import-export-section {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.action-group {
    display: flex;
    gap: 0.5rem;
}

.action-button {
    padding: 0.5rem 1rem;
    background: #444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.action-button:hover {
    background: #555;
}

.mech-library {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #333;
}

.mech-library h4 {
    color: #6a9ec7;
    margin: 0 0 1rem 0;
    font-size: 1.1em;
}

.library-controls {
    margin-bottom: 1rem;
}

.saved-mechs-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
}

.saved-mech-item {
    background: #252525;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 0.75rem;
}

.saved-mech-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.saved-mech-name {
    color: #fff;
    font-weight: 500;
}

.saved-mech-description {
    color: #888;
    font-size: 0.9em;
    margin-bottom: 0.5rem;
}

.saved-mech-actions {
    display: flex;
    gap: 0.5rem;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 1.5rem;
    width: 90%;
    max-width: 500px;
}

.modal-content h3 {
    color: #6a9ec7;
    margin: 0 0 1rem 0;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    color: #888;
    margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.5rem;
    background: #252525;
    border: 1px solid #333;
    border-radius: 4px;
    color: #fff;
    font-size: 0.9em;
}

.form-group textarea {
    height: 100px;
    resize: vertical;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
}

#import-json {
    width: 100%;
    height: 200px;
    margin: 1rem 0;
    padding: 0.5rem;
    background: #252525;
    border: 1px solid #333;
    border-radius: 4px;
    color: #fff;
    font-family: monospace;
    resize: vertical;
}
</style>

<script>
// Initialize data
const frames = {{ site.data.frames | jsonify }};
const weapons = {{ site.data.weapons | jsonify }};
const fittings = {{ site.data.fittings | jsonify }};

// Get tag system functions from layout
let tagSystem;

function initializeTagSystem() {
    // Debug logging
    console.log('Initializing tag system for mech builder...');
    
    // Tag System
    const tagDataElement = document.getElementById('tag-data');
    if (!tagDataElement) {
        console.error('Tag data element not found!');
        return;
    }
    
    let tags;
    try {
        const rawData = tagDataElement.dataset.tags.replace(/&quot;/g, '"');
        tags = JSON.parse(rawData);
        console.log('Loaded tag data:', tags);
    } catch (e) {
        console.error('Failed to parse tag data:', e);
        console.error('Raw data:', tagDataElement.dataset.tags);
        return;
    }

    // Create popup element
    function createPopup() {
        console.log('Creating popup element...');
        const popup = document.createElement('div');
        popup.className = 'tag-popup';
        
        popup.innerHTML = `
            <div class="tag-popup-header">
                <div class="tag-popup-title"></div>
                <button class="tag-popup-close">×</button>
            </div>
            <div class="tag-popup-content"></div>
            <div class="tag-popup-example"></div>
        `;
        
        document.body.appendChild(popup);
        return popup;
    }

    // Show popup with tag info
    function showTagPopup(tagId, value, event, sticky = false, element = null) {
        console.log('Showing popup for tag:', tagId, 'value:', value, 'sticky:', sticky);
        
        // Create new popup
        const popup = createPopup();
        
        // Find tag info
        let tagInfo = null;
        for (const category of Object.values(tags.weapon_tags)) {
            if (category[tagId]) {
                tagInfo = category[tagId];
                break;
            }
        }
        if (!tagInfo) {
            for (const category of Object.values(tags.fitting_tags)) {
                if (category[tagId]) {
                    tagInfo = category[tagId];
                    break;
                }
            }
        }

        if (!tagInfo) {
            console.warn('No tag info found for:', tagId);
            popup.remove();
            return null;
        }

        // Update popup content
        popup.querySelector('.tag-popup-title').textContent = 
            value ? `${tagInfo.name} ${value}` : tagInfo.name;
        popup.querySelector('.tag-popup-content').textContent = tagInfo.description;
        popup.querySelector('.tag-popup-example').textContent = tagInfo.example;

        // Position popup
        const rect = event.target.getBoundingClientRect();
        const popupWidth = 300;
        const popupHeight = 200;
        let left = rect.left;
        let top = rect.bottom + 10;

        // Adjust position if it would go off screen
        if (left + popupWidth > window.innerWidth) {
            left = window.innerWidth - popupWidth - 10;
        }
        if (top + popupHeight > window.innerHeight) {
            top = rect.top - popupHeight - 10;
        }

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        popup.classList.add('visible');
        
        if (sticky) {
            popup.classList.add('sticky');
            if (element) {
                element.dataset.popupId = popup.id = `popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }
        }

        // Add event listeners
        const closeBtn = popup.querySelector('.tag-popup-close');
        closeBtn.onclick = () => {
            popup.remove();
            if (element) {
                delete element.dataset.popupId;
            }
        };

        // Add double-click handler to close popup
        const header = popup.querySelector('.tag-popup-header');
        header.addEventListener('dblclick', () => {
            popup.remove();
            if (element) {
                delete element.dataset.popupId;
            }
        });

        // Make popup draggable when sticky
        if (sticky) {
            const header = popup.querySelector('.tag-popup-header');
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;
            let lastClickTime = 0;

            header.addEventListener('mousedown', (e) => {
                if (!popup.classList.contains('sticky')) return;
                
                // Check for double click
                const currentTime = Date.now();
                if (currentTime - lastClickTime < 300) {
                    // Double click detected
                    popup.remove();
                    if (element) {
                        delete element.dataset.popupId;
                    }
                    return;
                }
                lastClickTime = currentTime;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = popup.offsetLeft;
                initialTop = popup.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                popup.style.left = `${initialLeft + dx}px`;
                popup.style.top = `${initialTop + dy}px`;
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        return popup;
    }

    // Process tag elements
    function processTags() {
        console.log('Processing tag elements...');
        const tagElements = document.querySelectorAll('.tag-highlight');
        console.log('Found tag elements:', tagElements.length);
        
        tagElements.forEach((element, index) => {
            const tagId = element.dataset.tag;
            const value = element.dataset.value;
            
            if (!tagId) {
                console.warn('No tag ID found for element:', element);
                return;
            }

            let hoverTimer = null;
            let currentPopup = null;
            let lastClickTime = 0;

            // Add hover effect
            element.addEventListener('mouseenter', (e) => {
                console.log('Tag mouseenter:', tagId);
                element.classList.add('hovering');
                
                // Remove any existing non-sticky popup for this element
                if (currentPopup && !currentPopup.classList.contains('sticky')) {
                    currentPopup.remove();
                }
                
                // Create new popup if we don't have a sticky one
                if (!element.dataset.popupId) {
                    currentPopup = showTagPopup(tagId, value, e, false, element);
                }
                
                // Start timer for sticky behavior
                hoverTimer = setTimeout(() => {
                    element.classList.remove('hovering');
                    // Remove the temporary popup if it exists
                    if (currentPopup) {
                        currentPopup.remove();
                    }
                    // Create a new sticky popup
                    currentPopup = showTagPopup(tagId, value, e, true, element);
                }, 1000);
            });

            element.addEventListener('mouseleave', () => {
                console.log('Tag mouseleave:', tagId);
                element.classList.remove('hovering');
                if (hoverTimer) {
                    clearTimeout(hoverTimer);
                    hoverTimer = null;
                }
                // Only remove popup if it's not sticky
                if (currentPopup && !currentPopup.classList.contains('sticky')) {
                    currentPopup.remove();
                }
            });

            // Add double-click handler to close popup
            element.addEventListener('dblclick', (e) => {
                e.preventDefault();
                if (element.dataset.popupId) {
                    const popup = document.getElementById(element.dataset.popupId);
                    if (popup) {
                        popup.remove();
                        delete element.dataset.popupId;
                    }
                }
            });

            // Handle click for glossary navigation
            element.addEventListener('click', (e) => {
                console.log('Tag click:', tagId);
                e.preventDefault();

                // Check for double click
                const currentTime = Date.now();
                if (currentTime - lastClickTime < 300) {
                    // Double click handled by dblclick event
                    return;
                }
                lastClickTime = currentTime;

                // Find the glossary section
                const glossarySection = document.querySelector('#part-tag-glossary');
                if (glossarySection) {
                    // Scroll to glossary
                    glossarySection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Highlight the specific tag in the glossary
                    const tagEntry = glossarySection.querySelector(`#tag-${tagId}`);
                    if (tagEntry) {
                        tagEntry.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        tagEntry.classList.add('highlight');
                        setTimeout(() => tagEntry.classList.remove('highlight'), 2000);
                    }
                }
            });
        });
    }

    return { processTags };
}

// Simple state management
let currentMech = {
    frame: null,
    weapons: [],
    fittings: []
};

// Utility functions
function calculateResourcesUsed() {
    const hardPointsUsed = currentMech.weapons.reduce((sum, w) => sum + weapons[w].hard_points, 0);
    const systemPointsUsed = currentMech.fittings.reduce((sum, f) => sum + fittings[f].system_points, 0);
    return { hardPointsUsed, systemPointsUsed };
}

function updateResourceDisplay() {
    const frame = currentMech.frame ? frames[currentMech.frame] : null;
    const { hardPointsUsed, systemPointsUsed } = calculateResourcesUsed();
    
    const hardPointsTotal = frame ? frame.stats.hard_points : 0;
    const systemPointsTotal = frame ? frame.stats.system_points : 0;
    
    document.getElementById('hardpoints-used').textContent = `${hardPointsUsed}/${hardPointsTotal} HP`;
    document.getElementById('systempoints-used').textContent = `${systemPointsUsed}/${systemPointsTotal} SP`;
    
    // Update select availability
    const weaponSelect = document.getElementById('weapon-select');
    const fittingSelect = document.getElementById('fitting-select');
    
    weaponSelect.disabled = !frame || hardPointsUsed >= hardPointsTotal;
    fittingSelect.disabled = !frame || systemPointsUsed >= systemPointsTotal;
}

// Event handlers
function handleFrameChange(event) {
    currentMech.frame = event.target.value || null;
    
    // Clear weapons and fittings when frame changes
    if (currentMech.weapons.length > 0 || currentMech.fittings.length > 0) {
        currentMech.weapons = [];
        currentMech.fittings = [];
        document.getElementById('weapon-slots').innerHTML = '';
        document.getElementById('fitting-slots').innerHTML = '';
    }
    
    updatePreview();
    updateResourceDisplay();
}

function handleWeaponAdd(event) {
    const weaponId = event.target.value;
    if (!weaponId) return;
    
    const weapon = weapons[weaponId];
    const frame = frames[currentMech.frame];
    const { hardPointsUsed } = calculateResourcesUsed();
    
    if (hardPointsUsed + weapon.hard_points <= frame.stats.hard_points) {
        currentMech.weapons.push(weaponId);
        addWeaponSlot(weaponId);
        updatePreview();
        updateResourceDisplay();
    }
    
    event.target.value = ''; // Reset select
}

function handleFittingAdd(event) {
    const fittingId = event.target.value;
    if (!fittingId) return;
    
    const fitting = fittings[fittingId];
    const frame = frames[currentMech.frame];
    const { systemPointsUsed } = calculateResourcesUsed();
    
    if (systemPointsUsed + fitting.system_points <= frame.stats.system_points) {
        currentMech.fittings.push(fittingId);
        addFittingSlot(fittingId);
        updatePreview();
        updateResourceDisplay();
    }
    
    event.target.value = ''; // Reset select
}

function removeWeapon(index) {
    currentMech.weapons.splice(index, 1);
    updateWeaponSlots();
    updatePreview();
    updateResourceDisplay();
}

function removeFitting(index) {
    currentMech.fittings.splice(index, 1);
    updateFittingSlots();
    updatePreview();
    updateResourceDisplay();
}

function addWeaponSlot(weaponId) {
    const weapon = weapons[weaponId];
    const slot = document.createElement('div');
    slot.className = 'slot-item';
    slot.innerHTML = `
        <div class="slot-info">
            <div class="slot-name">${weapon.name}</div>
            <div class="slot-stats">
                ${weapon.stats.range} Range | ${weapon.stats.damage} ${weapon.stats.damage_type} | ${weapon.hard_points} HP
            </div>
        </div>
        <button class="slot-remove" onclick="removeWeapon(${currentMech.weapons.length - 1})">×</button>
    `;
    document.getElementById('weapon-slots').appendChild(slot);
}

function addFittingSlot(fittingId) {
    const fitting = fittings[fittingId];
    const slot = document.createElement('div');
    slot.className = 'slot-item';
    slot.innerHTML = `
        <div class="slot-info">
            <div class="slot-name">${fitting.name}</div>
            <div class="slot-stats">
                ${fitting.category} | ${fitting.system_points} SP
            </div>
        </div>
        <button class="slot-remove" onclick="removeFitting(${currentMech.fittings.length - 1})">×</button>
    `;
    document.getElementById('fitting-slots').appendChild(slot);
}

function updateWeaponSlots() {
    const container = document.getElementById('weapon-slots');
    container.innerHTML = '';
    currentMech.weapons.forEach((weaponId, index) => {
        const weapon = weapons[weaponId];
        const slot = document.createElement('div');
        slot.className = 'slot-item';
        slot.innerHTML = `
            <div class="slot-info">
                <div class="slot-name">${weapon.name}</div>
                <div class="slot-stats">
                    ${weapon.stats.range} Range | ${weapon.stats.damage} ${weapon.stats.damage_type} | ${weapon.hard_points} HP
                </div>
            </div>
            <button class="slot-remove" onclick="removeWeapon(${index})">×</button>
        `;
        container.appendChild(slot);
    });
}

function updateFittingSlots() {
    const container = document.getElementById('fitting-slots');
    container.innerHTML = '';
    currentMech.fittings.forEach((fittingId, index) => {
        const fitting = fittings[fittingId];
        const slot = document.createElement('div');
        slot.className = 'slot-item';
        slot.innerHTML = `
            <div class="slot-info">
                <div class="slot-name">${fitting.name}</div>
                <div class="slot-stats">
                    ${fitting.category} | ${fitting.system_points} SP
                </div>
            </div>
            <button class="slot-remove" onclick="removeFitting(${index})">×</button>
        `;
        container.appendChild(slot);
    });
}

function updatePreview() {
    const frame = currentMech.frame ? frames[currentMech.frame] : null;

    // Update card header and stats
    document.getElementById('card-name').textContent = frame ? frame.name : 'SELECT A FRAME';
    document.getElementById('card-class').textContent = frame ? `${frame.manufacturer} ${frame.class}` : '';
    document.getElementById('card-speed').textContent = frame ? frame.stats.speed : '-';
    document.getElementById('card-armor').textContent = frame ? frame.stats.armor : '-';
    document.getElementById('card-hp').textContent = frame ? frame.stats.hp : '-';
    document.getElementById('card-ac').textContent = frame ? frame.stats.ac : '-';
    document.getElementById('card-special').textContent = frame ? (frame.special || 'None') : '-';

    // Update weapons with proper tag rendering
    const weaponsContainer = document.getElementById('card-weapons');
    weaponsContainer.innerHTML = '';
    currentMech.weapons.forEach(weaponId => {
        const weapon = weapons[weaponId];
        const weaponEl = document.createElement('div');
        weaponEl.className = 'weapon-item';
        
        // Create tags using the same format as 06_weapons.md
        const tagHtml = weapon.tags ? weapon.tags.map(tag => 
            `<span class="tag-highlight" data-tag="${tag.name.toLowerCase()}" ${tag.value ? `data-value="${tag.value}"` : ''}>${tag.name}${tag.value ? ' ' + tag.value : ''}</span>`
        ).join('') : '';

        weaponEl.innerHTML = `
            <div class="item-name">${weapon.name}</div>
            <div class="item-stats">
                Range ${weapon.stats.range} | ${weapon.stats.damage} ${weapon.stats.damage_type}
                ${tagHtml ? `<div class="tag-list">${tagHtml}</div>` : ''}
            </div>
        `;
        weaponsContainer.appendChild(weaponEl);
    });

    // Update fittings
    const fittingsContainer = document.getElementById('card-fittings');
    fittingsContainer.innerHTML = '';
    currentMech.fittings.forEach(fittingId => {
        const fitting = fittings[fittingId];
        const fittingEl = document.createElement('div');
        fittingEl.className = 'fitting-item';
        fittingEl.innerHTML = `
            <div class="item-name">${fitting.name}</div>
            <div class="item-stats">${fitting.effect}</div>
        `;
        fittingsContainer.appendChild(fittingEl);
    });

    // Process tags after updating the preview
    if (tagSystem) {
        tagSystem.processTags();
    }
}

function resetBuild() {
    currentMech = {
        frame: null,
        weapons: [],
        fittings: []
    };
    
    document.getElementById('frame-select').value = '';
    document.getElementById('weapon-slots').innerHTML = '';
    document.getElementById('fitting-slots').innerHTML = '';
    
    updatePreview();
    updateResourceDisplay();
}

// Import/Export Functions
function getMechData() {
    return {
        metadata: {
            version: "1.0",
            created: new Date().toISOString(),
            gameVersion: "{{ site.data.version }}"
        },
        mech: {
            frame: currentMech.frame,
            weapons: currentMech.weapons,
            fittings: currentMech.fittings
        }
    };
}

function exportToClipboard() {
    const data = getMechData();
    const json = JSON.stringify(data, null, 2);
    
    navigator.clipboard.writeText(json).then(() => {
        alert('Mech data copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        alert('Failed to copy to clipboard. See console for details.');
    });
}

function downloadJSON() {
    const data = getMechData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `mech-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showImportDialog() {
    document.getElementById('import-dialog').style.display = 'flex';
}

function closeImportDialog() {
    document.getElementById('import-dialog').style.display = 'none';
    document.getElementById('import-json').value = '';
}

function handleJSONImport() {
    const jsonText = document.getElementById('import-json').value;
    
    try {
        const data = JSON.parse(jsonText);
        if (confirm('This will replace your current mech. Continue?')) {
            importMechData(data);
            closeImportDialog();
        }
    } catch (err) {
        console.error('Failed to parse JSON:', err);
        alert('Invalid JSON format. Please check the console for details.');
    }
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (confirm('This will replace your current mech. Continue?')) {
                importMechData(data);
            }
        } catch (err) {
            console.error('Failed to parse JSON file:', err);
            alert('Invalid JSON file. Please check the console for details.');
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

function importMechData(data) {
    try {
        // Basic validation
        if (!data.mech || !data.metadata) {
            throw new Error('Invalid mech data format');
        }
        
        // Import the mech data
        currentMech = {
            frame: data.mech.frame || null,
            weapons: data.mech.weapons || [],
            fittings: data.mech.fittings || []
        };
        
        // Update UI
        updateWeaponSlots();
        updateFittingSlots();
        updatePreview();
        updateResourceDisplay();
        
        // Update frame select
        const frameSelect = document.getElementById('frame-select');
        if (frameSelect) {
            frameSelect.value = currentMech.frame || '';
        }
        
    } catch (err) {
        console.error('Failed to import mech data:', err);
        alert('Failed to import mech data. Please check the console for details.');
    }
}

// Mech Library Functions
function showSaveMechDialog() {
    if (!currentMech.frame) {
        alert('Please select a frame before saving.');
        return;
    }
    
    document.getElementById('save-mech-dialog').style.display = 'flex';
}

function closeSaveMechDialog() {
    document.getElementById('save-mech-dialog').style.display = 'none';
    document.getElementById('mech-name').value = '';
    document.getElementById('mech-description').value = '';
}

function saveMechToLibrary() {
    const name = document.getElementById('mech-name').value.trim();
    const description = document.getElementById('mech-description').value.trim();
    
    if (!name) {
        alert('Please enter a name for your mech.');
        return;
    }
    
    const mechData = getMechData();
    mechData.name = name;
    mechData.description = description;
    
    // Get existing library
    let library = JSON.parse(localStorage.getItem('mechLibrary') || '[]');
    
    // Add new mech
    library.push(mechData);
    
    // Save back to localStorage
    localStorage.setItem('mechLibrary', JSON.stringify(library));
    
    // Update display
    updateMechLibrary();
    closeSaveMechDialog();
}

function updateMechLibrary() {
    const container = document.getElementById('saved-mechs-list');
    const library = JSON.parse(localStorage.getItem('mechLibrary') || '[]');
    
    container.innerHTML = '';
    
    library.forEach((mech, index) => {
        const el = document.createElement('div');
        el.className = 'saved-mech-item';
        el.innerHTML = `
            <div class="saved-mech-header">
                <div class="saved-mech-name">${mech.name}</div>
                <div class="saved-mech-actions">
                    <button onclick="loadSavedMech(${index})" class="action-button">Load</button>
                    <button onclick="deleteSavedMech(${index})" class="action-button">Delete</button>
                    <button onclick="shareSavedMech(${index})" class="action-button">Share</button>
                </div>
            </div>
            ${mech.description ? `<div class="saved-mech-description">${mech.description}</div>` : ''}
        `;
        container.appendChild(el);
    });
}

function loadSavedMech(index) {
    const library = JSON.parse(localStorage.getItem('mechLibrary') || '[]');
    const mech = library[index];
    
    if (mech && confirm('This will replace your current mech. Continue?')) {
        importMechData(mech);
    }
}

function deleteSavedMech(index) {
    if (!confirm('Are you sure you want to delete this mech?')) return;
    
    let library = JSON.parse(localStorage.getItem('mechLibrary') || '[]');
    library.splice(index, 1);
    localStorage.setItem('mechLibrary', JSON.stringify(library));
    updateMechLibrary();
}

function shareSavedMech(index) {
    const library = JSON.parse(localStorage.getItem('mechLibrary') || '[]');
    const mech = library[index];
    
    if (mech) {
        const json = JSON.stringify(mech);
        const encoded = encodeURIComponent(json);
        const url = `${window.location.origin}${window.location.pathname}#mech=${encoded}`;
        
        navigator.clipboard.writeText(url).then(() => {
            alert('Share URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy URL:', err);
            alert('Failed to copy URL. See console for details.');
        });
    }
}

// Handle shared mechs via URL
function handleSharedMech() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#mech=')) {
        try {
            const encoded = hash.substring(6);
            const json = decodeURIComponent(encoded);
            const data = JSON.parse(json);
            
            if (confirm('Load shared mech?')) {
                importMechData(data);
            }
        } catch (err) {
            console.error('Failed to load shared mech:', err);
            alert('Failed to load shared mech. Please check the console for details.');
        }
        
        // Clear hash
        history.pushState('', document.title, window.location.pathname);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Wait a short moment to ensure Jekyll template processing is complete
    setTimeout(() => {
        console.log('Initializing mech builder...');
        
        const frameSelect = document.getElementById('frame-select');
        const weaponSelect = document.getElementById('weapon-select');
        const fittingSelect = document.getElementById('fitting-select');
        
        if (!frameSelect || !weaponSelect || !fittingSelect) {
            console.error('Could not find all required select elements:');
            console.log('Frame select:', frameSelect);
            console.log('Weapon select:', weaponSelect);
            console.log('Fitting select:', fittingSelect);
            return;
        }
        
        // Initialize tag system
        tagSystem = initializeTagSystem();
        
        // Log available data
        console.log('Available frames:', Object.keys(frames).length);
        console.log('Available weapons:', Object.keys(weapons).length);
        console.log('Available fittings:', Object.keys(fittings).length);
        
        // Set up event listeners
        frameSelect.addEventListener('change', (event) => {
            console.log('Frame selected:', event.target.value);
            handleFrameChange(event);
        });
        
        weaponSelect.addEventListener('change', (event) => {
            console.log('Weapon selected:', event.target.value);
            handleWeaponAdd(event);
        });
        
        fittingSelect.addEventListener('change', (event) => {
            console.log('Fitting selected:', event.target.value);
            handleFittingAdd(event);
        });
        
        // Initialize display
        updatePreview();
        updateResourceDisplay();
        
        // Initialize mech library
        updateMechLibrary();
        
        // Check for shared mech
        handleSharedMech();
        
        console.log('Mech builder initialized successfully');
    }, 100);
});
</script> 