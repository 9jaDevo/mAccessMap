import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Check if we're in a supported environment for Service Workers
const isServiceWorkerSupported = () => {
  // Check if Service Workers are supported
  if (!('serviceWorker' in navigator)) {
    return false;
  }
  
  // Check if we're in StackBlitz or other environments that don't support SW
  const hostname = window.location.hostname;
  const isStackBlitz = hostname.includes('stackblitz') || hostname.includes('webcontainer');
  const isCodeSandbox = hostname.includes('codesandbox');
  const isGitpod = hostname.includes('gitpod');
  
  // Return false for known unsupported environments
  if (isStackBlitz || isCodeSandbox || isGitpod) {
    console.log('Service Workers not supported in this development environment');
    return false;
  }
  
  return true;
};

// Register service worker for PWA functionality only in supported environments
if (isServiceWorkerSupported()) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              console.log('New service worker available');
              
              // Optionally show a notification to the user
              if (window.confirm('A new version of mAccessMap is available. Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });
      
      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from service worker:', event.data);
      });
      
      // Handle service worker controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller changed');
      });
      
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

// Handle app installation prompt
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA install prompt available');
  
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Optionally show your own install button
  showInstallButton();
});

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  
  // Hide the install button
  hideInstallButton();
  
  // Track the installation
  if (typeof gtag !== 'undefined') {
    gtag('event', 'pwa_install', {
      event_category: 'engagement',
      event_label: 'PWA Installation'
    });
  }
});

function showInstallButton() {
  // Create and show install button
  const installButton = document.createElement('button');
  installButton.id = 'pwa-install-button';
  installButton.innerHTML = '📱 Install App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    border: none;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    z-index: 1000;
    font-size: 14px;
    transition: all 0.2s ease;
  `;
  
  installButton.addEventListener('mouseenter', () => {
    installButton.style.transform = 'translateY(-2px)';
    installButton.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
  });
  
  installButton.addEventListener('mouseleave', () => {
    installButton.style.transform = 'translateY(0)';
    installButton.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
  });
  
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      // Clear the deferredPrompt
      deferredPrompt = null;
      
      // Hide the install button
      hideInstallButton();
    }
  });
  
  document.body.appendChild(installButton);
}

function hideInstallButton() {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.remove();
  }
}

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('App is online');
  
  // Show online notification
  showNetworkStatus('online');
  
  // Trigger background sync if service worker supports it and is available
  if (isServiceWorkerSupported() && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.sync.register('background-sync-reviews');
    }).catch((error) => {
      console.error('Background sync registration failed:', error);
    });
  }
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  
  // Show offline notification
  showNetworkStatus('offline');
});

function showNetworkStatus(status: 'online' | 'offline') {
  // Remove existing status notification
  const existingNotification = document.getElementById('network-status');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create status notification
  const notification = document.createElement('div');
  notification.id = 'network-status';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${status === 'online' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1001;
    animation: slideDown 0.3s ease;
  `;
  
  notification.textContent = status === 'online' ? '🌐 Back online' : '📱 Offline mode';
  
  // Add animation keyframes
  if (!document.getElementById('network-status-styles')) {
    const style = document.createElement('style');
    style.id = 'network-status-styles';
    style.textContent = `
      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideDown 0.3s ease reverse';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 3000);
}

// Initialize the React app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);