import React from 'react';

function Footer() {
    return (
        <footer
            style={{
                width: '100%',
                padding: '20px',
                backgroundColor: '#343a40', // Giả sử màu nền từ CSS gốc
                color: 'white', // Giả sử màu chữ từ CSS gốc
                textAlign: 'center',
                position: 'relative', // Đảm bảo footer không fixed
                bottom: 0,
            }}
        >
            <p>© 2025 Design By Team 8</p>
        </footer>
    );
}

export default Footer;