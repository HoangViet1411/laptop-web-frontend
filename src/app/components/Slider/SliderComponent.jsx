import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderComponent = () => {
    // Dữ liệu ảnh banner (đường dẫn từ thư mục public)
    const banners = [
        '/assets/images/slider1.png',
        '/assets/images/slider2.png'
    ];

    // Cấu hình cho Slider
    const settings = {
        dots: true, // Hiển thị dots (chấm điều hướng)
        infinite: true, // Quay vòng vô hạn
        speed: 500, // Thời gian chuyển đổi giữa các ảnh
        slidesToShow: 1, // Số ảnh hiển thị cùng lúc
        slidesToScroll: 1, // Số ảnh cuộn mỗi lần
        autoplay: true, // Tự động chuyển ảnh
        autoplaySpeed: 3000, // Thời gian tự động chuyển ảnh (3 giây)
        arrows: true, // Thêm mũi tên điều hướng
    };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {banners.map((banner, index) => (
                    <div key={index}>
                        <img
                            src={banner}
                            alt={`Banner ${index + 1}`}
                            style={{
                                width: '100%', // Thay đổi width còn 100% chiều rộng phần tử chứa
                                height: '400px', // Đặt chiều cao slider cố định
                                objectFit: 'cover', // Đảm bảo ảnh không bị méo
                                display: 'block', // Để ảnh không bị kéo dãn
                                margin: '0 auto', // Căn giữa ảnh
                            }}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderComponent;
