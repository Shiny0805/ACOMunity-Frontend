import React, { useState, useEffect } from "react";

const Slideshow = ({ images, interval }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images, interval]);

    return <img src={images[currentIndex].nft} alt={`Slide ${currentIndex}`} />;
};

export default Slideshow;