document.addEventListener('DOMContentLoaded', () => {
    // --- Canvas and Game State Setup ---
    const canvas = document.getElementById('puzzle-canvas');
    const ctx = canvas.getContext('2d');

    let currentPuzzle;
    let gridCellSize;
    let selectedBlock = null;

    // --- Block Colors and Styles ---
    const BLOCK_COLORS = {
        'main': { fill: '#e74c3c', stroke: '#c0392b' }, // Red
        'v':    { fill: '#3498db', stroke: '#2980b9' }, // Blue
        'h':    { fill: '#2ecc71', stroke: '#27ae60' }, // Green
        's':    { fill: '#f1c40f', stroke: '#f39c12' }, // Yellow
        'default': { fill: '#bdc3c7', stroke: '#95a5a6' }
    };
    const BORDER_RADIUS = 10;

    // --- Core Functions ---
    function initialize() {
        // Load the first puzzle from the PUZZLE_DATA global variable
        currentPuzzle = JSON.parse(JSON.stringify(PUZZLE_DATA[0])); // Deep copy
        setupCanvas();
        renderPuzzle();
        
        // --- Event Listeners ---
        window.addEventListener('resize', () => {
            setupCanvas();
            renderPuzzle();
        });

        canvas.addEventListener('mousedown', handleMouseDown);
    }

    function setupCanvas() {
        const container = document.getElementById('puzzle-container');
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        gridCellSize = rect.width / 4; // 4 columns
    }

    // --- Rendering Logic ---
    function renderPuzzle() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the grid background (optional, for visual debugging)
        drawGridBackground();

        // Draw each block
        currentPuzzle.blocks.forEach(block => {
            drawBlock(block);
        });
    }

    function drawBlock(block) {
        const [widthStr, heightStr] = block.size.split('x');
        const width = parseInt(widthStr) * gridCellSize;
        const height = parseInt(heightStr) * gridCellSize;
        const x = block.x * gridCellSize;
        const y = block.y * gridCellSize;

        const colorKey = block.id.substring(0, 1);
        const colors = BLOCK_COLORS[colorKey] || BLOCK_COLORS['default'];

        // Draw the block with rounded corners
        ctx.beginPath();
        ctx.moveTo(x + BORDER_RADIUS, y);
        ctx.lineTo(x + width - BORDER_RADIUS, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + BORDER_RADIUS);
        ctx.lineTo(x + width, y + height - BORDER_RADIUS);
        ctx.quadraticCurveTo(x + width, y + height, x + width - BORDER_RADIUS, y + height);
        ctx.lineTo(x + BORDER_RADIUS, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - BORDER_RADIUS);
        ctx.lineTo(x, y + BORDER_RADIUS);
        ctx.quadraticCurveTo(x, y, x + BORDER_RADIUS, y);
        ctx.closePath();
        
        ctx.fillStyle = colors.fill;
        ctx.fill();
        
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Add a subtle highlight for a 3D effect
        ctx.beginPath();
        ctx.moveTo(x + BORDER_RADIUS, y + 4);
        ctx.lineTo(x + width - BORDER_RADIUS, y + 4);
        ctx.quadraticCurveTo(x + width - 4, y + 4, x + width - 4, y + BORDER_RADIUS);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    function drawGridBackground() {
        ctx.fillStyle = '#a05a2c'; // A slightly lighter wood color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridCellSize, 0);
            ctx.lineTo(i * gridCellSize, 5 * gridCellSize);
            ctx.stroke();
        }
        for (let i = 1; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * gridCellSize);
            ctx.lineTo(4 * gridCellSize, i * gridCellSize);
            ctx.stroke();
        }
    }

    // --- Interaction Logic ---
    function handleMouseDown(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const clickedGridX = Math.floor(mouseX / gridCellSize);
        const clickedGridY = Math.floor(mouseY / gridCellSize);

        // Find which block was clicked
        selectedBlock = getBlockAt(clickedGridX, clickedGridY);

        if (selectedBlock) {
            console.log('Selected block:', selectedBlock.id);
            // TODO: Add logic for dragging and moving the block
        } else {
            console.log('Clicked on empty space.');
        }
    }

    function getBlockAt(gridX, gridY) {
        for (const block of currentPuzzle.blocks) {
            const [widthStr, heightStr] = block.size.split('x');
            const width = parseInt(widthStr);
            const height = parseInt(heightStr);

            if (gridX >= block.x && gridX < block.x + width &&
                gridY >= block.y && gridY < block.y + height) {
                return block;
            }
        }
        return null;
    }

    // --- Initialization ---
    initialize();
});

