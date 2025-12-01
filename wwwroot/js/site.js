// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Theme Toggle Functionality
(function() {
    'use strict';

    const getStoredTheme = () => localStorage.getItem('theme');
    const setStoredTheme = theme => localStorage.setItem('theme', theme);

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = theme => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    };

    const updateThemeIcon = theme => {
        const themeIcon = document.querySelector('#themeIcon');
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.classList.remove('bi-sun-fill');
                themeIcon.classList.add('bi-moon-fill');
            } else {
                themeIcon.classList.remove('bi-moon-fill');
                themeIcon.classList.add('bi-sun-fill');
            }
        }
    };

    // Initialize theme on page load
    const initTheme = () => {
        const preferredTheme = getPreferredTheme();
        setTheme(preferredTheme);
    };

    // Set initial theme
    initTheme();

    // Handle theme toggle button click
    window.addEventListener('DOMContentLoaded', () => {
        const themeButton = document.querySelector('#themeToggle');
        if (themeButton) {
            themeButton.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
                setStoredTheme(newTheme);
                // Reinitialize date pickers with new theme
                initDatePickers();
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            const storedTheme = getStoredTheme();
            if (!storedTheme) {
                initTheme();
                initDatePickers();
            }
        });

        // Initialize date pickers
        initDatePickers();
    });

    // Initialize Flatpickr date pickers
    function initDatePickers() {
        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        
        // Destroy existing instances
        document.querySelectorAll('.flatpickr-input').forEach(input => {
            if (input._flatpickr) {
                input._flatpickr.destroy();
            }
        });

        // Initialize new date pickers
        document.querySelectorAll('input[type="date"]').forEach(input => {
            // Skip if already initialized
            if (input._flatpickr) {
                return;
            }
            
            // Store original value
            const originalValue = input.value;
            
            // Convert to text input for flatpickr
            input.type = 'text';
            input.classList.add('flatpickr-input');
            
            // Initialize flatpickr
            const fp = flatpickr(input, {
                dateFormat: 'Y-m-d',
                defaultDate: originalValue || new Date(),
                allowInput: false,
                clickOpens: true,
                animate: true,
                theme: isDark ? 'dark' : 'light',
                locale: {
                    firstDayOfWeek: 1
                },
                onChange: function(selectedDates, dateStr, instance) {
                    // Update the original input value for form submission
                    input.setAttribute('value', dateStr);
                }
            });
        });
    }
})();
