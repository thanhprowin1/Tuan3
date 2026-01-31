let allProducts = [];
let currentPage = 1;
let itemsPerPage = 10;

async function getAllProducts() {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        const products = await response.json();
        allProducts = products;
        displayProducts(products, currentPage, itemsPerPage);
        renderPagination(Math.ceil(products.length / itemsPerPage), currentPage);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products, page, perPage) {
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = ''; // Clear existing rows
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedProducts = products.slice(start, end);
    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        
        // Lấy hình ảnh đầu tiên từ mảng images và làm sạch URL
        let imageUrl = 'https://via.placeholder.com/100';
        if (product.images && product.images.length > 0) {
            // Loại bỏ dấu ngoặc vuông và khoảng trắng thừa
            imageUrl = product.images[0].replace(/[\[\]"]/g, '').trim();
        }

        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${imageUrl}" alt="${product.title}" class="product-image" referrerpolicy="no-referrer" onerror="this.src='https://via.placeholder.com/100?text=No+Image'" /></td>
            <td>${product.title}</td>
            <td>$${product.price}</td>
            <td>${product.category?.name || 'N/A'}</td>
        `;

        // Thêm tooltip cho description
        const tooltip = document.createElement('div');
        tooltip.className = 'description-tooltip';
        tooltip.textContent = product.description || 'Không có mô tả';
        row.appendChild(tooltip);

        tbody.appendChild(row);
    });
}

function filterProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(product => product.title.toLowerCase().includes(query));
    currentPage = 1;
    displayProducts(filtered, currentPage, itemsPerPage);
    renderPagination(Math.ceil(filtered.length / itemsPerPage), currentPage);
}

function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.onclick = () => changePage(i);
        pagination.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextBtn);
}

function changePage(page) {
    currentPage = page;
    filterProducts(); // Re-filter and display
}

function sortBy(field, direction) {
    allProducts.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        if (field === 'title') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    currentPage = 1;
    filterProducts();
}

// Call the function when the page loads
window.onload = () => {
    getAllProducts();
    document.getElementById('search-input').addEventListener('input', filterProducts);
    document.getElementById('items-per-page').addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        filterProducts();
    });
};