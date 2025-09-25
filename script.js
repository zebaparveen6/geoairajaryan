// DOM Elements
const drone = document.getElementById('drone');
const satelliteView = document.getElementById('satelliteView');
const overlay = document.getElementById('overlay');
const toggleOverlayBtn = document.getElementById('toggleOverlay');
const resetViewBtn = document.getElementById('resetView');
const errorContainer = document.getElementById('errorContainer');
const safeZone = document.querySelector('.safe-zone');
const warningZone = document.querySelector('.warning-zone');
const criticalZone = document.querySelector('.critical-zone');

let overlayVisible = true;

// Function to show error messages
function showError(message) {
    try {
        console.error('Application Error:', message);
        
        errorContainer.style.display = 'block';
        errorContainer.innerHTML = `
            <strong>Error:</strong> ${message}
            <button onclick="this.parentElement.style.display='none'" style="margin-left: 15px; padding: 5px 10px;">Close</button>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    } catch (err) {
        console.error('Error displaying error message:', err);
    }
}

// Function to show success messages
function showSuccess(message) {
    try {
        errorContainer.style.display = 'block';
        errorContainer.style.background = 'rgba(46, 204, 113, 0.9)';
        errorContainer.innerHTML = `
            <strong>Success:</strong> ${message}
            <button onclick="this.parentElement.style.display='none'" style="margin-left: 15px; padding: 5px 10px;">Close</button>
        `;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
            errorContainer.style.background = 'rgba(231, 76, 60, 0.9)';
        }, 3000);
    } catch (err) {
        console.error('Error displaying success message:', err);
    }
}

// Function to validate elements exist
function validateElements() {
    const elements = {
        drone,
        satelliteView,
        overlay,
        toggleOverlayBtn,
        resetViewBtn,
        errorContainer,
        safeZone,
        warningZone,
        criticalZone
    };
    
    for (const [name, element] of Object.entries(elements)) {
        if (!element) {
            throw new Error(`Required element not found: ${name}`);
        }
    }
}

// Function to initialize drone animation
function initDroneAnimation() {
    try {
        validateElements();
        
        // Add the entering class to start the animation
        setTimeout(() => {
            drone.classList.add('drone-entering');
            showSuccess('Drone deployed successfully');
        }, 500); // Slight delay for better visual effect
        
        // Add animation end listener
        drone.addEventListener('transitionend', () => {
            showSuccess('Drone in position. Surveying area...');
        }, { once: true });
    } catch (err) {
        showError('Failed to initialize drone animation: ' + err.message);
    }
}

// Function to toggle overlay visibility
function toggleOverlay() {
    try {
        validateElements();
        
        overlayVisible = !overlayVisible;
        
        if (overlayVisible) {
            overlay.style.display = 'block';
            toggleOverlayBtn.textContent = 'Hide Overlay';
            showSuccess('Overlay shown');
        } else {
            overlay.style.display = 'none';
            toggleOverlayBtn.textContent = 'Show Overlay';
            showSuccess('Overlay hidden');
        }
    } catch (err) {
        showError('Failed to toggle overlay: ' + err.message);
    }
}

// Function to reset view
function resetView() {
    try {
        validateElements();
        
        // Reset overlay visibility
        overlayVisible = true;
        overlay.style.display = 'block';
        toggleOverlayBtn.textContent = 'Hide Overlay';
        
        // Reset drone position
        drone.classList.remove('drone-entering');
        setTimeout(() => {
            drone.classList.add('drone-entering');
        }, 100);
        
        // Apply pulse animation to satellite view
        satelliteView.classList.add('pulse');
        setTimeout(() => {
            satelliteView.classList.remove('pulse');
        }, 2000);
        
        showSuccess('View reset successfully');
    } catch (err) {
        showError('Failed to reset view: ' + err.message);
    }
}

// Function to handle overlay interactions
function setupOverlayInteractions() {
    try {
        validateElements();
        
        // Add click event to overlay areas
        [safeZone, warningZone, criticalZone].forEach(zone => {
            if (zone) {
                zone.style.pointerEvents = 'auto';
                
                zone.addEventListener('click', function(e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const level = this.getAttribute('data-level');
                        const levelNames = {
                            'safe': 'Safe (Green)',
                            'warning': 'Warning (Yellow)',
                            'critical': 'Critical (Red)'
                        };
                        
                        // Highlight the clicked zone
                        document.querySelectorAll('.safe-zone, .warning-zone, .critical-zone').forEach(z => {
                            if (z) z.style.boxShadow = '';
                        });
                        
                        this.style.boxShadow = '0 0 20px #fff, 0 0 30px rgba(255, 255, 255, 0.8)';
                        
                        // Show info message
                        showSuccess(`Selected zone: ${levelNames[level]}`);
                    } catch (err) {
                        showError('Error handling overlay click: ' + err.message);
                    }
                });
                
                // Add hover effects
                zone.addEventListener('mouseenter', function() {
                    try {
                        this.style.transform = 'scale(1.05)';
                    } catch (err) {
                        console.error('Error on hover effect:', err);
                    }
                });
                
                zone.addEventListener('mouseleave', function() {
                    try {
                        this.style.transform = 'scale(1)';
                    } catch (err) {
                        console.error('Error on hover effect removal:', err);
                    }
                });
            }
        });
    } catch (err) {
        showError('Failed to setup overlay interactions: ' + err.message);
    }
}

// Function to load satellite view
function loadSatelliteView() {
    try {
        validateElements();
        
        // Remove any existing canvas
        const existingCanvas = document.getElementById('satelliteCanvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        // Create a canvas for the satellite view
        const canvas = document.createElement('canvas');
        canvas.width = satelliteView.clientWidth;
        canvas.height = satelliteView.clientHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.id = 'satelliteCanvas';
        canvas.style.borderRadius = '10px'; // Match the container border radius
        
        satelliteView.appendChild(canvas);
        
        // Draw satellite view
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Create a gradient background similar to satellite imagery
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#2c3e50');
            gradient.addColorStop(0.5, '#34495e');
            gradient.addColorStop(1, '#2c3e50');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add some terrain-like features
            drawTerrainFeatures(ctx, canvas.width, canvas.height);
            
            showSuccess('Satellite view loaded successfully');
        } else {
            throw new Error('Unable to get canvas context');
        }
    } catch (err) {
        showError('Failed to load satellite view: ' + err.message);
    }
}

// Function to draw terrain-like features
function drawTerrainFeatures(ctx, width, height) {
    try {
        // Draw some terrain-like details
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.lineWidth = 1;
        
        // Draw some random terrain lines
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const length = 20 + Math.random() * 50;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + length, y + (Math.random() * 30 - 15));
            ctx.stroke();
        }
        
        // Draw some terrain patches
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = 10 + Math.random() * 40;
            
            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, radius
            );
            
            const colorIntensity = Math.random();
            gradient.addColorStop(0, `rgba(80, ${100 + Math.floor(colorIntensity * 100)}, 80, ${0.1 + colorIntensity * 0.3})`);
            gradient.addColorStop(1, `rgba(80, ${50 + Math.floor(colorIntensity * 100)}, 80, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    } catch (err) {
        console.error('Error drawing terrain features:', err);
    }
}

// Initialize the application
function initApp() {
    try {
        validateElements();
        
        // Load satellite view
        loadSatelliteView();
        
        // Initialize drone animation
        initDroneAnimation();
        
        // Set up button event listeners
        if (toggleOverlayBtn) {
            toggleOverlayBtn.addEventListener('click', toggleOverlay);
        }
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', resetView);
        }
        
        // Set up overlay interactions
        setupOverlayInteractions();
        
        // Add resize handler to adjust canvas
        window.addEventListener('resize', () => {
            try {
                const canvas = document.getElementById('satelliteCanvas');
                if (canvas && satelliteView) {
                    canvas.width = satelliteView.clientWidth;
                    canvas.height = satelliteView.clientHeight;
                    
                    // Redraw the satellite view
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        // Recreate the gradient background
                        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                        gradient.addColorStop(0, '#2c3e50');
                        gradient.addColorStop(0.5, '#34495e');
                        gradient.addColorStop(1, '#2c3e50');
                        
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        
                        // Redraw terrain features
                        drawTerrainFeatures(ctx, canvas.width, canvas.height);
                    }
                }
            } catch (err) {
                console.error('Error during resize:', err);
            }
        });
        
        showSuccess('Satellite viewer initialized successfully');
        console.log('Satellite viewer initialized successfully');
    } catch (err) {
        showError('Failed to initialize application: ' + err.message);
    }
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', initApp);