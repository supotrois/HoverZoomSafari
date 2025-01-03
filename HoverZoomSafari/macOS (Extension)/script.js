document.addEventListener('mouseover', function(event) {
    const target = event.target;
    
    // Check if the hovered element is an image
    if (target.tagName === 'IMG') {
        // Get the original/full-size image URL
        const fullSizeUrl = target.getAttribute('data-original') ||
                          target.getAttribute('data-full-size') ||
                          target.src.replace(/\/(small|thumb|preview)\//, '/large/');
        
        // Create zoom container if it doesn't exist
        let zoomContainer = document.getElementById('hover-zoom-container');
        if (!zoomContainer) {
            zoomContainer = document.createElement('div');
            zoomContainer.id = 'hover-zoom-container';
            zoomContainer.style.cssText = `
                position: fixed;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                transition: opacity 0.2s ease-in-out;
                opacity: 0;
            `;
            document.body.appendChild(zoomContainer);
        }
        
        // Create and load the zoomed image
        const zoomedImg = new Image();
        zoomedImg.src = fullSizeUrl;
        
        zoomedImg.onload = function() {
            // Position the container near the cursor but keep it in viewport
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.8;
            
            // Calculate scaled dimensions while maintaining aspect ratio
            let width = zoomedImg.width;
            let height = zoomedImg.height;
            
            if (width > maxWidth) {
                const ratio = maxWidth / width;
                width = maxWidth;
                height = height * ratio;
            }
            
            if (height > maxHeight) {
                const ratio = maxHeight / height;
                height = maxHeight;
                width = width * ratio;
            }
            
            zoomContainer.style.width = `${width}px`;
            zoomContainer.style.height = `${height}px`;
            
            // Clear previous content and add new image
            zoomContainer.innerHTML = '';
            zoomedImg.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
            `;
            zoomContainer.appendChild(zoomedImg);
            zoomContainer.style.opacity = '1';
        };

        // Update container position on mouse move
        document.addEventListener('mousemove', updateZoomPosition);
    }
});

document.addEventListener('mouseout', function(event) {
    const target = event.target;
    if (target.tagName === 'IMG') {
        const zoomContainer = document.getElementById('hover-zoom-container');
        if (zoomContainer) {
            zoomContainer.style.opacity = '0';
            document.removeEventListener('mousemove', updateZoomPosition);
        }
    }
});

function updateZoomPosition(event) {
    const zoomContainer = document.getElementById('hover-zoom-container');
    if (!zoomContainer) return;
    
    const margin = 20; // Distance from cursor
    let x = event.clientX + margin;
    let y = event.clientY + margin;
    
    // Keep container in viewport
    const containerRect = zoomContainer.getBoundingClientRect();
    if (x + containerRect.width > window.innerWidth) {
        x = event.clientX - margin - containerRect.width;
    }
    if (y + containerRect.height > window.innerHeight) {
        y = event.clientY - margin - containerRect.height;
    }
    
    zoomContainer.style.transform = `translate(${x}px, ${y}px)`;
}
