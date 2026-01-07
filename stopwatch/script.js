/**
 * Professional Stopwatch Application
 * Features: Precise timing, lap management, themes, keyboard shortcuts, data persistence
 */

class Stopwatch {
    constructor() {
        // Core timing properties
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.isPaused = false;
        
        // Lap management
        this.laps = [];
        this.currentLapTime = 0;
        this.lastLapTime = 0;
        
        // Settings and preferences
        this.settings = {
            soundEnabled: true,
            vibrationEnabled: true,
            autoSaveLaps: true,
            maxLaps: 50,
            theme: 'light'
        };
        
        // Statistics
        this.stats = {
            totalSessions: 0,
            bestLap: null,
            totalLaps: 0,
            sessionTime: 0
        };
        
        // DOM elements
        this.elements = {};
        
        // Audio context for sound effects
        this.audioContext = null;
        
        // Initialize the application
        this.init();
    }
    
    /**
     * Initialize the stopwatch application
     */
    init() {
        try {
            console.log('🔧 Initializing stopwatch...');
            this.cacheElements();
            this.loadSettings();
            this.loadStats();
            this.setupEventListeners();
            this.setupKeyboardShortcuts();
            this.applyTheme();
            this.updateDisplay();
            this.updateStats();
            this.updateButtonStates();
            console.log('✅ Stopwatch initialized successfully!');
        } catch (error) {
            console.error('❌ Error initializing stopwatch:', error);
        }
    }
    
    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        console.log('🔍 Caching DOM elements...');
        
        // Timer display elements
        this.elements.hours = document.getElementById('hours');
        this.elements.minutes = document.getElementById('minutes');
        this.elements.seconds = document.getElementById('seconds');
        this.elements.milliseconds = document.getElementById('milliseconds');
        
        // Control buttons
        this.elements.startBtn = document.getElementById('startBtn');
        this.elements.pauseBtn = document.getElementById('pauseBtn');
        this.elements.resumeBtn = document.getElementById('resumeBtn');
        this.elements.lapBtn = document.getElementById('lapBtn');
        this.elements.resetBtn = document.getElementById('resetBtn');
        
        // Lap elements
        this.elements.lapsList = document.getElementById('lapsList');
        this.elements.lapCount = document.getElementById('lapCount');
        this.elements.clearLapsBtn = document.getElementById('clearLapsBtn');
        
        // Statistics elements
        this.elements.sessionTime = document.getElementById('sessionTime');
        this.elements.totalSessions = document.getElementById('totalSessions');
        this.elements.bestLap = document.getElementById('bestLap');
        this.elements.avgLap = document.getElementById('avgLap');
        
        // Theme and settings
        this.elements.themeToggle = document.getElementById('themeToggle');
        this.elements.settingsBtn = document.getElementById('settingsBtn');
        this.elements.settingsModal = document.getElementById('settingsModal');
        this.elements.closeSettings = document.getElementById('closeSettings');
        this.elements.exportBtn = document.getElementById('exportBtn');
        
        // Settings form elements
        this.elements.soundEnabled = document.getElementById('soundEnabled');
        this.elements.vibrationEnabled = document.getElementById('vibrationEnabled');
        this.elements.autoSaveLaps = document.getElementById('autoSaveLaps');
        this.elements.maxLaps = document.getElementById('maxLaps');
        this.elements.saveSettings = document.getElementById('saveSettings');
        this.elements.clearAllData = document.getElementById('clearAllData');
        
        // Check if critical elements exist
        if (!this.elements.startBtn) {
            console.error('❌ Start button not found!');
        }
        if (!this.elements.hours) {
            console.error('❌ Hours display not found!');
        }
        
        console.log('✅ DOM elements cached successfully');
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        console.log('🎧 Setting up event listeners...');
        
        try {
            // Control buttons
            if (this.elements.startBtn) {
                this.elements.startBtn.addEventListener('click', () => this.start());
                console.log('✅ Start button listener added');
            } else {
                console.error('❌ Start button not found for listener setup');
            }
            
            if (this.elements.pauseBtn) {
                this.elements.pauseBtn.addEventListener('click', () => this.pause());
                console.log('✅ Pause button listener added');
            }
            
            if (this.elements.resumeBtn) {
                this.elements.resumeBtn.addEventListener('click', () => this.resume());
                console.log('✅ Resume button listener added');
            }
            
            if (this.elements.lapBtn) {
                this.elements.lapBtn.addEventListener('click', () => this.recordLap());
                console.log('✅ Lap button listener added');
            }
            
            if (this.elements.resetBtn) {
                this.elements.resetBtn.addEventListener('click', () => this.reset());
                console.log('✅ Reset button listener added');
            }
            
            // Lap management
            if (this.elements.clearLapsBtn) {
                this.elements.clearLapsBtn.addEventListener('click', () => this.clearLaps());
            }
            
            // Theme and settings
            if (this.elements.themeToggle) {
                this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
            }
            
            if (this.elements.settingsBtn) {
                this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
            }
            
            if (this.elements.closeSettings) {
                this.elements.closeSettings.addEventListener('click', () => this.closeSettings());
            }
            
            if (this.elements.saveSettings) {
                this.elements.saveSettings.addEventListener('click', () => this.saveSettings());
            }
            
            if (this.elements.clearAllData) {
                this.elements.clearAllData.addEventListener('click', () => this.clearAllData());
            }
            
            // Export functionality
            if (this.elements.exportBtn) {
                this.elements.exportBtn.addEventListener('click', () => this.exportLaps());
            }
            
            // Modal backdrop click
            if (this.elements.settingsModal) {
                this.elements.settingsModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.settingsModal) {
                        this.closeSettings();
                    }
                });
            }
            
            console.log('✅ All event listeners set up successfully');
        } catch (error) {
            console.error('❌ Error setting up event listeners:', error);
        }
        
        // Prevent accidental page leave during active session
        window.addEventListener('beforeunload', (e) => {
            if (this.isRunning) {
                e.preventDefault();
                e.returnValue = 'Stopwatch is running. Are you sure you want to leave?';
            }
        });
        
        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isRunning) {
                // Page is hidden, continue timing
                console.log('Page hidden, stopwatch continues running');
            }
        });
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.key.toLowerCase()) {
                case ' ':
                case 'spacebar':
                    e.preventDefault();
                    if (!this.isRunning) {
                        this.start();
                    } else if (this.isPaused) {
                        this.resume();
                    } else {
                        this.pause();
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    this.reset();
                    break;
                case 'l':
                    e.preventDefault();
                    if (this.isRunning && !this.isPaused) {
                        this.recordLap();
                    }
                    break;
                case 't':
                    e.preventDefault();
                    this.toggleTheme();
                    break;
                case 'escape':
                    e.preventDefault();
                    this.closeSettings();
                    break;
            }
        });
    }
    
    /**
     * Start the stopwatch
     */
    start() {
        console.log('🚀 Start button clicked!');
        console.log('Current state:', {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            elapsedTime: this.elapsedTime
        });
        
        if (this.isRunning) {
            console.log('⚠️ Stopwatch is already running!');
            return;
        }
        
        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
        this.isPaused = false;
        
        console.log('⏰ Starting timer with start time:', this.startTime);
        
        this.timerInterval = setInterval(() => this.updateTimer(), 10);
        
        this.updateButtonStates();
        this.playSound('start');
        this.vibrate('start');
        
        // Update session count
        if (this.elapsedTime === 0) {
            this.stats.totalSessions++;
            this.saveStats();
            this.updateStats();
        }
        
        console.log('✅ Stopwatch started successfully!');
    }
    
    /**
     * Pause the stopwatch
     */
    pause() {
        if (!this.isRunning || this.isPaused) return;
        
        clearInterval(this.timerInterval);
        this.isPaused = true;
        
        this.updateButtonStates();
        this.playSound('pause');
        this.vibrate('pause');
    }
    
    /**
     * Resume the stopwatch
     */
    resume() {
        if (!this.isRunning || !this.isPaused) return;
        
        this.startTime = Date.now() - this.elapsedTime;
        this.isPaused = false;
        
        this.timerInterval = setInterval(() => this.updateTimer(), 10);
        
        this.updateButtonStates();
        this.playSound('resume');
        this.vibrate('resume');
    }
    
    /**
     * Reset the stopwatch
     */
    reset() {
        clearInterval(this.timerInterval);
        
        this.isRunning = false;
        this.isPaused = false;
        this.elapsedTime = 0;
        this.startTime = 0;
        this.currentLapTime = 0;
        this.lastLapTime = 0;
        
        // Clear laps if setting is enabled
        if (this.settings.autoSaveLaps) {
            this.laps = [];
            this.updateLapsDisplay();
        }
        
        this.updateDisplay();
        this.updateButtonStates();
        this.playSound('reset');
        this.vibrate('reset');
        
        // Update session time
        this.stats.sessionTime = 0;
        this.updateStats();
    }
    
    /**
     * Update the timer display
     */
    updateTimer() {
        this.elapsedTime = Date.now() - this.startTime;
        this.currentLapTime = this.elapsedTime - this.lastLapTime;
        this.stats.sessionTime = this.elapsedTime;
        
        this.updateDisplay();
        this.updateStats();
    }
    
    /**
     * Update the time display
     */
    updateDisplay() {
        const time = this.formatTime(this.elapsedTime);
        
        this.elements.hours.textContent = time.hours;
        this.elements.minutes.textContent = time.minutes;
        this.elements.seconds.textContent = time.seconds;
        this.elements.milliseconds.textContent = time.milliseconds;
        
        // Update page title with current time
        document.title = `${time.hours}:${time.minutes}:${time.seconds} - Professional Stopwatch`;
    }
    
    /**
     * Format time into HH:MM:SS:MS format
     */
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);
        
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            milliseconds: ms.toString().padStart(2, '0')
        };
    }
    
    /**
     * Record a lap time
     */
    recordLap() {
        if (!this.isRunning || this.isPaused) return;
        
        const lapNumber = this.laps.length + 1;
        const lapTime = this.currentLapTime;
        const lapData = {
            number: lapNumber,
            time: lapTime,
            formattedTime: this.formatTime(lapTime),
            timestamp: Date.now(),
            totalTime: this.elapsedTime
        };
        
        // Calculate lap difference
        if (this.laps.length > 0) {
            const previousLap = this.laps[this.laps.length - 1];
            lapData.diff = lapTime - previousLap.time;
            lapData.formattedDiff = this.formatTime(lapData.diff);
            lapData.diffType = lapData.diff > 0 ? 'positive' : 'negative';
        }
        
        this.laps.push(lapData);
        this.lastLapTime = this.elapsedTime;
        
        // Update best lap
        if (!this.stats.bestLap || lapTime < this.stats.bestLap) {
            this.stats.bestLap = lapTime;
        }
        
        this.stats.totalLaps++;
        
        // Limit laps if setting requires
        if (this.settings.maxLaps !== 'unlimited' && this.laps.length > this.settings.maxLaps) {
            this.laps.shift();
        }
        
        this.updateLapsDisplay();
        this.updateStats();
        this.playSound('lap');
        this.vibrate('lap');
        
        if (this.settings.autoSaveLaps) {
            this.saveLaps();
        }
    }
    
    /**
     * Update the laps display
     */
    updateLapsDisplay() {
        const hasLaps = this.laps.length > 0;
        
        this.elements.lapCount.textContent = `${this.laps.length} lap${this.laps.length !== 1 ? 's' : ''}`;
        if (this.elements.clearLapsBtn) this.elements.clearLapsBtn.disabled = false;
        if (this.elements.exportBtn) this.elements.exportBtn.disabled = false;
        
        if (!hasLaps) {
            this.elements.lapsList.innerHTML = `
                <div class="no-laps-message">
                    <span class="no-laps-icon">⏱️</span>
                    <p>No lap times recorded yet</p>
                    <p class="no-laps-subtitle">Start the stopwatch and tap "Lap" to record times</p>
                </div>
            `;
            return;
        }
        
        const lapsHTML = this.laps.slice().reverse().map(lap => {
            let diffHTML = '';
            if (lap.diff !== undefined) {
                const diffClass = lap.diffType === 'positive' ? 'positive' : 'negative';
                const diffSymbol = lap.diffType === 'positive' ? '+' : '';
                diffHTML = `<div class="lap-diff ${diffClass}">${diffSymbol}${lap.formattedDiff.hours}:${lap.formattedDiff.minutes}:${lap.formattedDiff.seconds}</div>`;
            }
            
            return `
                <div class="lap-item">
                    <div class="lap-number">
                        <span>Lap ${lap.number}</span>
                        ${lap.number === 1 ? '<span class="lap-badge">FIRST</span>' : ''}
                        ${lap.number === this.laps.length && lap.number > 1 ? '<span class="lap-badge">LATEST</span>' : ''}
                    </div>
                    <div class="lap-time">${lap.formattedTime.hours}:${lap.formattedTime.minutes}:${lap.formattedTime.seconds}.${lap.formattedTime.milliseconds}</div>
                    ${diffHTML}
                </div>
            `;
        }).join('');
        
        this.elements.lapsList.innerHTML = lapsHTML;
    }
    
    /**
     * Clear all laps
     */
    clearLaps() {
        if (this.laps.length === 0) return;
        
        if (confirm('Are you sure you want to clear all lap times?')) {
            this.laps = [];
            this.lastLapTime = 0;
            this.currentLapTime = 0;
            this.updateLapsDisplay();
            this.playSound('clear');
            this.vibrate('clear');
            
            if (this.settings.autoSaveLaps) {
                this.saveLaps();
            }
        }
    }
    
    /**
     * Update button states based on stopwatch state
     */
    updateButtonStates() {
        const isIdle = !this.isRunning;
        const isPaused = this.isRunning && this.isPaused;
        const isRunning = this.isRunning && !this.isPaused;
        
        console.log('🔄 Updating button states:', {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            isIdle: isIdle,
            startBtn: this.elements.startBtn,
            resetBtn: this.elements.resetBtn
        });
        
        // Standard stopwatch UX button states
        this.elements.startBtn.disabled = false;  // Temporarily force enabled
        this.elements.pauseBtn.disabled = false;  // Temporarily force enabled
        this.elements.resumeBtn.disabled = false;  // Temporarily force enabled
        this.elements.lapBtn.disabled = false;  // Temporarily force enabled
        this.elements.resetBtn.disabled = false;  // Temporarily force enabled
        
        // Uncomment below for proper logic after testing
        // this.elements.startBtn.disabled = isRunning;  // Disable when running
        // this.elements.pauseBtn.disabled = !isRunning;  // Enable only when running
        // this.elements.resumeBtn.disabled = !isPaused;  // Enable only when paused
        // this.elements.lapBtn.disabled = !isRunning;  // Enable only when running
        // this.elements.resetBtn.disabled = !isRunning && this.elapsedTime === 0;  // Enable when running or has time
        
        console.log('🔘 Button states after update:', {
            startDisabled: this.elements.startBtn.disabled,
            pauseDisabled: this.elements.pauseBtn.disabled,
            resumeDisabled: this.elements.resumeBtn.disabled,
            lapDisabled: this.elements.lapBtn.disabled,
            resetDisabled: this.elements.resetBtn.disabled
        });
    }
    
    /**
     * Toggle theme between light and dark
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.settings.theme = newTheme;
        this.saveSettings();
        
        // Update theme icon
        const themeIcon = this.elements.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        this.playSound('theme');
    }
    
    /**
     * Apply saved theme
     */
    applyTheme() {
        const theme = this.settings.theme || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeIcon = this.elements.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    /**
     * Open settings modal
     */
    openSettings() {
        this.elements.settingsModal.classList.add('active');
        this.loadSettingsToForm();
        this.playSound('modal');
    }
    
    /**
     * Close settings modal
     */
    closeSettings() {
        this.elements.settingsModal.classList.remove('active');
        this.playSound('modal');
    }
    
    /**
     * Load settings to form
     */
    loadSettingsToForm() {
        this.elements.soundEnabled.checked = this.settings.soundEnabled;
        this.elements.vibrationEnabled.checked = this.settings.vibrationEnabled;
        this.elements.autoSaveLaps.checked = this.settings.autoSaveLaps;
        this.elements.maxLaps.value = this.settings.maxLaps;
    }
    
    /**
     * Save settings
     */
    saveSettings() {
        this.settings.soundEnabled = this.elements.soundEnabled.checked;
        this.settings.vibrationEnabled = this.elements.vibrationEnabled.checked;
        this.settings.autoSaveLaps = this.elements.autoSaveLaps.checked;
        this.settings.maxLaps = this.elements.maxLaps.value;
        
        localStorage.setItem('stopwatchSettings', JSON.stringify(this.settings));
        this.closeSettings();
        this.playSound('save');
    }
    
    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const saved = localStorage.getItem('stopwatchSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }
    
    /**
     * Save laps to localStorage
     */
    saveLaps() {
        if (this.settings.autoSaveLaps) {
            localStorage.setItem('stopwatchLaps', JSON.stringify(this.laps));
        }
    }
    
    /**
     * Load laps from localStorage
     */
    loadLaps() {
        const saved = localStorage.getItem('stopwatchLaps');
        if (saved && this.settings.autoSaveLaps) {
            this.laps = JSON.parse(saved);
            this.updateLapsDisplay();
        }
    }
    
    /**
     * Save statistics
     */
    saveStats() {
        localStorage.setItem('stopwatchStats', JSON.stringify(this.stats));
    }
    
    /**
     * Load statistics from localStorage
     */
    loadStats() {
        const saved = localStorage.getItem('stopwatchStats');
        if (saved) {
            this.stats = { ...this.stats, ...JSON.parse(saved) };
        }
        
        // Load saved laps if auto-save is enabled
        if (this.settings.autoSaveLaps) {
            this.loadLaps();
        }
    }
    
    /**
     * Update statistics display
     */
    updateStats() {
        // Session time
        const sessionTime = this.formatTime(this.stats.sessionTime);
        this.elements.sessionTime.textContent = 
            `${sessionTime.hours}:${sessionTime.minutes}:${sessionTime.seconds}`;
        
        // Total sessions
        this.elements.totalSessions.textContent = this.stats.totalSessions;
        
        // Best lap
        if (this.stats.bestLap) {
            const bestLapTime = this.formatTime(this.stats.bestLap);
            this.elements.bestLap.textContent = 
                `${bestLapTime.hours}:${bestLapTime.minutes}:${bestLapTime.seconds}.${bestLapTime.milliseconds}`;
        } else {
            this.elements.bestLap.textContent = '--:--:--';
        }
        
        // Average lap
        if (this.laps.length > 0) {
            const totalLapTime = this.laps.reduce((sum, lap) => sum + lap.time, 0);
            const avgLapTime = totalLapTime / this.laps.length;
            const avgTime = this.formatTime(avgLapTime);
            this.elements.avgLap.textContent = 
                `${avgTime.hours}:${avgTime.minutes}:${avgTime.seconds}.${avgTime.milliseconds}`;
        } else {
            this.elements.avgLap.textContent = '--:--:--';
        }
        
        this.saveStats();
    }
    
    /**
     * Export laps as CSV
     */
    exportLaps() {
        if (this.laps.length === 0) return;
        
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `stopwatch-laps-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.playSound('export');
    }
    
    /**
     * Generate CSV content for laps
     */
    generateCSV() {
        const headers = ['Lap Number', 'Lap Time', 'Total Time', 'Date', 'Time Difference'];
        const rows = this.laps.map(lap => [
            lap.number,
            `${lap.formattedTime.hours}:${lap.formattedTime.minutes}:${lap.formattedTime.seconds}.${lap.formattedTime.milliseconds}`,
            `${this.formatTime(lap.totalTime).hours}:${this.formatTime(lap.totalTime).minutes}:${this.formatTime(lap.totalTime).seconds}.${this.formatTime(lap.totalTime).milliseconds}`,
            new Date(lap.timestamp).toLocaleString(),
            lap.diff ? `${lap.formattedDiff.hours}:${lap.formattedDiff.minutes}:${lap.formattedDiff.seconds}` : 'N/A'
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    /**
     * Clear all data
     */
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This will remove all settings, statistics, and lap history.')) {
            localStorage.removeItem('stopwatchSettings');
            localStorage.removeItem('stopwatchLaps');
            localStorage.removeItem('stopwatchStats');
            
            // Reset to defaults
            this.settings = {
                soundEnabled: true,
                vibrationEnabled: true,
                autoSaveLaps: true,
                maxLaps: 50,
                theme: 'light'
            };
            
            this.stats = {
                totalSessions: 0,
                bestLap: null,
                totalLaps: 0,
                sessionTime: 0
            };
            
            this.laps = [];
            this.reset();
            this.updateLapsDisplay();
            this.updateStats();
            this.applyTheme();
            this.closeSettings();
            
            this.playSound('clear');
        }
    }
    
    /**
     * Play sound effect
     */
    playSound(type) {
        if (!this.settings.soundEnabled) return;
        
        // Initialize audio context on first user interaction
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Different frequencies for different actions
        const frequencies = {
            start: 800,
            pause: 600,
            resume: 800,
            reset: 400,
            lap: 1000,
            clear: 300,
            save: 900,
            export: 700,
            modal: 500,
            theme: 650
        };
        
        oscillator.frequency.value = frequencies[type] || 600;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    /**
     * Vibrate for mobile devices
     */
    vibrate(type) {
        if (!this.settings.vibrationEnabled || !navigator.vibrate) return;
        
        const patterns = {
            start: [50],
            pause: [30],
            resume: [50],
            reset: [100],
            lap: [50, 30, 50],
            clear: [200],
            save: [50, 50],
            export: [50, 30, 50],
            modal: [30],
            theme: [40]
        };
        
        navigator.vibrate(patterns[type] || [50]);
    }
}

// Initialize the stopwatch when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stopwatch = new Stopwatch();
    
    // Add some helpful console messages
    console.log('🚀 Professional Stopwatch loaded successfully!');
    console.log('⌨️  Keyboard shortcuts: Space (Start/Pause), R (Reset), L (Lap), T (Theme)');
    console.log('💾 Data is automatically saved to localStorage');
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
