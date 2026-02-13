import { FaMobile, FaTshirt, FaLaptop, FaBook, FaHeadphones, FaHome, FaFutbol, FaBicycle, FaGamepad, FaShoePrints, FaBabyCarriage, FaTv, FaShoppingCart, FaSpa, FaCampground } from "react-icons/fa";

export const categories = [
    { name: 'Mobiles', icon: <FaMobile /> },
    { name: 'Clothing', icon: <FaTshirt /> },
    { name: 'Laptops', icon: <FaLaptop /> },
    { name: 'Books', icon: <FaBook /> },
    { name: 'Accessories', icon: <FaHeadphones /> },
    { name: 'Home & Garden', icon: <FaHome /> },
    { name: 'Sports', icon: <FaFutbol /> },
    { name: 'Cycling', icon: <FaBicycle /> },
    { name: 'Toys & Games', icon: <FaGamepad /> },
    { name: 'Footwear', icon: <FaShoePrints /> },
    { name: 'Baby Products', icon: <FaBabyCarriage /> },
    { name: 'Electronics', icon: <FaTv /> },
    { name: 'Groceries', icon: <FaShoppingCart /> },
    { name: 'Beauty & Care', icon: <FaSpa /> },
    { name: 'Outdoor Gear', icon: <FaCampground /> },
];

export const formatProductPayload = (formData) => {
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
            submissionData.append(key, formData[key]);
        }
    });
    return submissionData;
};